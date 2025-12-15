// IMPORTING DEPENDENCIES
require("dotenv-flow").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
const prisma = require('prisma.js');

// IMPORTING ALL CONTROLLERS/HANDLERS
const signIn = require("./Controllers/signIn.js");
const register = require("./Controllers/register.js");
const profile = require("./Controllers/profile.js");
const image = require("./Controllers/image.js");


// FOR RUNNING SERVER ONLINE
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL_CLOUDD || {
    host: process.env.DATABASE_HOST_CLOUD,
    user: process.env.DATABASE_USER_CLOUD,
    password: process.env.DATABASE_PASSWORD_CLOUD,
    database: process.env.DATABASE_NAME_CLOUD,
  },
});

// FOR RUNNING SERVER LOCALLY
// const db = knex({
//     client: "pg",
//     connection: {
//         host: "127.0.0.1",
//         user: "postgres",
//         password: process.env.DATABASE_PASSWORD_LOCAL,
//         database: "smartbrain"
//     }
// })

const app = express();
// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// FOR RUNNING SERVER ONLINE
// Test database connection -- Online db server using Prisma Client.
app.get("/", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Connected to Prisma Postgres!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Database connection failed", details: error.message });
  }
});

// Get all users -- Online db server using Prisma Client.
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// FOR RUNNING SERVER LOCALLY
// Only allows you to display the response once per sent request.
// Shows that server is working on a specified port. Comment out if you want get all users from local db.
// app.get("", () => {});
// app.get("/", (req, res) => {
//   res.send(
//     ` <h1> SERVER IS WORKING...</br > on PORT ${process.env.PORT}  ;~) </h1> `
//   );
// });

// Get all users -- local db server.
// app.get("/", (req, res) => {
//   db.select("*")
//     .from("users")
//     .then((users) => res.json(users));
// });


app.post("/signIn", (req, res) => {
  signIn.handleSignIn(db, bcrypt, req, res);
});
app.post("/register", (req, res) => {
  register.handleRegister(db, bcrypt, req, res);
});
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(db, req, res);
});
app.put("/image", (req, res) => {
  image.handleImage(db, req, res);
});
app.post("/imageURL", (req, res) => {
  image.handleAPIcall(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`
        SERVER is working on PORT ${process.env.PORT} 
        ...The process.env.NODE_ENV is ${process.env.NODE_ENV}.
    `);
});

// Export the Express API
module.exports = app;
