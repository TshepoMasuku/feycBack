// IMPORTING DEPENDENCIES
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
// IMPORTING ALL CONTROLLERS/HANDLERS
const signIn = require("./Controllers/signin.js");
const register = require('./Controllers/register.js');
const profile = require('./Controllers/profile.js');
const image = require('./Controllers/image.js');

const db = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "7852",
        database: "smartbrain"
    }
})

const app = express();

// MIDDLEWARE
app.use( express.json() );
app.use( express.urlencoded({extended: false}) );
app.use( cors() );


// SIMPLE API EXAMPLE
app.get("/",(req,res) => {
    db.select("*").from("users")
        .then(users => res.json(users));
});

app.post("/signIn",(req,res) => { signIn.handleSignIn(db, bcrypt, req, res) });
app.post("/register", (req,res) => { register.handleRegister(db, bcrypt, req, res) });
app.get("/profile/:id",(req,res) => { profile.handleProfile(db, req, res) });
app.put("/image",(req,res) => { image.handleImage(db, req, res) });
app.post("/imageURL",(req,res) => { image.handleAPIcall(req, res) });

app.listen(process.env.PORT || 3000, () => {
    console.log(`It is working on PORT ${process.env.PORT}`);
});
