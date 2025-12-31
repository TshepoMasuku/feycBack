// IMPORTING DEPENDENCIES
require("dotenv-flow").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const prisma = require("./prisma/generated/client.mts");
const Clarifai = require('clarifai'); 


// INITIALIZING THE EXPRESS APP AND CLARIFAI APP
const app = express();
const clarifaiApp = new Clarifai.App({ 
  apiKey:  process.env.API_CLARIFAI 
});

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Test database connection to Online Prisma Client db.
app.get("/", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Connected to Prisma Postgres!" });
  } catch (error) {
    res.status(500).json({ 
      error: "Database connection failed", details: error.message
    });
  }
});

app.post("/signIn", async (prisma, bcrypt, req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json("Enter the required form details.");
  }
  try {
    // Find login record by email
    const login = await prisma.login.findUnique({
      where: { email },
      select: { hash: true }, // Only select the hash field
    });
    if (!login) {
      return res.status(400).json("Incorrect Log In Credentials.");
    }

    // Validate password
    const isValid = bcrypt.compare(password, login.hash);
    if (isValid) {
      // Find user by email
      const user = await prisma.users.findUnique({
        where: { email },
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json("Error: User Not Found.");
      }
    } else {
      res.status(400).json("Incorrect Log In Credentials.");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json("Incorrect Log In Credentials.");
  }
});

app.post("/register", async (prisma, bcrypt, req, res) => {
  const { name, surname, email, password } = req.body;
  // Validate input
  if (!name || !surname || !email || !password) {
    return res.status(400).json("Enter the required form details.");
  }

  try {
    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Start transaction
    await prisma.$transaction(async (prisma) => {
      // Create login record
      const login = await prisma.login.create({
        data: { hash, email },
      });

      // Create user record
      const user = await prisma.users.create({
        data: {
          name, surname, email: login.email, joined: new Date(),
        },
      });
      res.json({ message: "Registration successful", user });
      return user;
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json("Registration Unsuccessful.");
  }
});

app.get("/profile/:id", async (prisma, req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await prisma.user.findUnique({
    where: { 
        id: Number(id)  // Ensure 'id' is a number
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json("User Not Found.");
    }
  } catch (err) {
    console.error("Error getting user profile:", err);
    res.status(404).json("Error Getting User Profile.");
  }
});

app.put("/image", async (prisma, req, res) => {
  try {
    const { id } = req.body;
    // Increment 'entries' by 1 and return the updated value
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) }, // Ensure 'id' is a number
      data: {
        entries: {
          increment: 1, // Prisma's increment syntax
        },
      },
    });
    res.json({ entries: updatedUser.entries });
  } catch (err) {
    console.error("Error updating user entries:", err);
    res.status(404).json("Error: User entries not found.");
  }
});

app.post("/imageURL", (req, res) => {
  // app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input) 
  clarifaiApp.models.predict(
    {
      id: 'face-detection',
      name: 'face-detection',
      version: '6dc7e46bc9124c5c8824be4822abe105',
      type: 'visual-detector',
    }, req.body.input) 
    .then(data => res.json(data))
    .catch(err => res.status(400).json('unable to work with API.'))
});


// SERVER LISTENING PORT
app.listen(process.env.PORT, () => {
  console.log(`
    SERVER currently working on PORT ${process.env.PORT} and 
    The node environment is in ${process.env.NODE_ENV}.
  `);
});

module.exports = app;