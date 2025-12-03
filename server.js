// IMPORTING DEPENDENCIES
require('dotenv-flow').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

// FOR RUNNING SERVER ONLINE 
// const PrismaClient = require("prisma/client/edge");
// const withAccelerate = require("prisma/extension-accelerate");

// IMPORTING ALL CONTROLLERS/HANDLERS
const signIn = require("./Controllers/signIn.js");
const register = require('./Controllers/register.js');
const profile = require('./Controllers/profile.js');
const image = require('./Controllers/image.js');


// const client = new PrismaClient().$extends(withAccelerate())

// FOR RUNNING SERVER ONLINE 
// const db = knex({
//     client: "pg",
//     connection: process.env.POSTGRES_URL || {
//         host: client.host,
//         user: client.user,
//         password: process.env.DATABASE_PASSWORD,
//         database: client.database
//     }
// })

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


// app.get("", () => {}); 
// Only allows you to display the response once per sent request. 
// Shows that server is working on a specified port. Comment out if you want get all users from local db.
app.get("/",(req,res) => { 
    res.send(` <h1> SERVER IS WORKING...</br > on PORT ${process.env.PORT}  ;~) </h1> `) 
});

// Get all users -- local db server.
app.get("/",(req,res) => {
    db.select("*").from("users")
        .then(users => res.json(users));
});

// Get all users -- Online db server using Prisma Client.
// app.get('/', async (req, res) => {
//     const users = await client.user.findMany();
//     res.json(users);
// });

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