// IMPORTING DEPENDENCIES
require('dotenv-flow').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
// IMPORTING ALL CONTROLLERS/HANDLERS
const signIn = require("./Controllers/signIn.js");
const register = require('./Controllers/register.js');
const profile = require('./Controllers/profile.js');
const image = require('./Controllers/image.js');


// FOR RUNNING SERVER ONLINE 
const client = require('./elephantsql');
const db = knex({
    client: "pg",
    connection: {
        host: client.host,
        user: client.user,
        password: process.env.DATABASE_PASSWORD,
        database: client.database
    }
})

// FOR RUNNING SERVER LOCALLY 
// const db = knex({
//     client: "pg",
//     connection: {
//         host: "127.0.0.1",
//         user: "postgres",
//         password: process.env.DATABASE_PASSWORD,
//         database: "smartbrain"
//     }
// })


const app = express();
// MIDDLEWARE
app.use( express.json() );
app.use( express.urlencoded({extended: false}) );
app.use( cors() );


// SIMPLE API EXAMPLES
app.get("/",(req,res) => { 
    res.send(` <h1> SERVER IS WORKING...</br > on PORT ${process.env.PORT}  ;~) </h1> `) 
});
app.get("/",(req,res) => {
    db.select("*").from("users")
        .then(users => res.json(users));
});

app.post("/signIn",(req,res) => { signIn.handleSignIn(db, bcrypt, req, res) });
app.post("/register", (req,res) => { register.handleRegister(db, bcrypt, req, res) });
app.get("/profile/:id",(req,res) => { profile.handleProfile(db, req, res) });
app.put("/image",(req,res) => { image.handleImage(db, req, res) });
app.post("/imageURL",(req,res) => { image.handleAPIcall(req, res) });

app.listen(process.env.PORT, () => {
    console.log(`
        SERVER is working on PORT ${process.env.PORT} 
        ...The process.env.NODE_ENV is ${process.env.NODE_ENV}.
    `);
});

// Export the Express API 
module.exports = app;