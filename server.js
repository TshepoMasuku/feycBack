// IMPORTING DEPENDENCIES
require("dotenv-flow").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const prisma = require("./prisma/generated/client.mts");

// IMPORTING ALL CONTROLLERS/HANDLERS
const signIn = require("./Controllers/prisma/signIn.js");
const register = require("./Controllers/prisma/register.js");
const profile = require("./Controllers/prisma/profile.js");
const image = require("./Controllers/prisma/image.js");

// INITIALIZING THE EXPRESS APP
const app = express();

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

// Get all users from Online Prisma Client db.
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/signIn", (req, res) => {
  signIn.handleSignIn(prisma, bcrypt, req, res);
});
app.post("/register", (req, res) => {
  register.handleRegister(prisma, bcrypt, req, res);
});
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(prisma, req, res);
});
app.put("/image", (req, res) => {
  image.handleImage(prisma, req, res);
});
app.post("/imageURL", (req, res) => {
  image.handleAPIcall(req, res);
});


// SERVER LISTENING PORT
app.listen(process.env.PORT, () => {
  console.log(`
    SERVER currently working on PORT ${process.env.PORT} and 
    The node environment is in ${process.env.NODE_ENV}.
  `);
});

module.exports = app;