// IMPORTING DEPENDENCIES
require("dotenv-flow").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require("knex");

// IMPORTING ALL CONTROLLERS/HANDLERS
const signIn = require("./Controllers/knex/signIn.js");
const register = require("./Controllers/knex/register.js");
const profile = require("./Controllers/knex/profile.js");
const image = require("./Controllers/knex/image.js");

// FOR RUNNING SERVER
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: process.env.DATABASE_PASSWORD_LOCAL,
    database: "smartbrain"
  }
})

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Only allows you to display the response once per sent request.
// Shows that server is working on a specified port. 
// Comment out if you want to get all users from local db.
// app.get("", () => {});
app.get("/", (req, res) => {
  res.send(
    ` <h1> SERVER IS WORKING...</br > on PORT ${process.env.PORT}  ;~) </h1> `
  );
});

// Get all users -- local db server.
app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => res.json(users));
});

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

module.exports = app;