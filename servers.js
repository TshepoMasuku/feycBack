// IMPORTING DEPENDENCIES
require('dotenv-flow').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
const Clarifai = require('clarifai'); 

const appClarifai = new Clarifai.App({ 
    apiKey:  process.env.API_CLARIFAI 
});


// FOR RUNNING SERVER LOCALLY
const db = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: process.env.DATABASE_PASSWORD,
        database: "smartbrain"
    }
})


const app = express();
// MIDDLEWARE
app.use( express.json() );
app.use( express.urlencoded({extended: false}) );
app.use( cors() );


// SIMPLE API EXAMPLES
app.get("/",(req,res) => { 
    res.send(` <h1> SERVER IS WORKING  ;~) <br> ...on PORT ${process.env.PORT} </h1> `) 
});
app.get("/",(req,res) => {
    db.select("*").from("users")
        .then(users => res.json(users));
});


app.post("/signIn",(req, res, db, bcrypt) => { 
    const { email,password } = req.body;
    if ( !email || !password ){
        return res.status(400).json("Enter the required form details.")
    }
    db.select("email","hash").from("login").where("email","=", email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if(isValid){
                return db.select("*").from("users").where("email","=", email)
                    .then( user => res.json(user[0]) )
                    .catch(err => res.status(404).json("Error User Not Found."))
            } else {
                res.status(400).json("Incorrect Log In Credentials.")
            }
        })
        .catch( err => res.status(400).json("Incorrect Log In Credentials."))
});


app.post("/register", (req, res, db, bcrypt) => { 
    const { name,surname,email,password } = req.body;
    if ( !name || !surname || !email || !password ){
        return res.status(400).json("Enter the required form details.")
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into("login")
        .returning("email")
        .then(loginEmail => {
            return trx("users")
                .returning("*")
                .insert({
                    name: name,
                    surname: surname,
                    email: loginEmail[0],
                    joined: new Date()
                })
                .then( user => res.json(user[0]) )
        })
        .then(trx.commit)
        .then(trx.rollback)
    })
    .catch( err => res.status(400).json("Registration Unsuccesful."))
});


app.get("/profile/:id",(req, res, db) => { 
    const { id } = req.params;
    db.select("*").from("users").where({id})
        .then( user => {
            if(user.length){
                res.json(user[0]);
            } else {
                res.status(404).json("User Not Found.");
            }
        })
        .catch(err => res.status(404).json("Error Getting User Profile."))
});


app.post("/imageURL",(req,res) => { 
    appClarifai.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input) 
        .then(data => res.json(data))
        .catch(err => res.status(400).json('unable to work with API.'))
});


app.put("/image",(req, res, db) => { 
    const { id } = req.body;
    db("users").where("id","=",id)
        .increment("entries", 1)
        .returning("entries")
        .then( entries => res.json(entries[0]) )
        .catch(err => res.status(404).json("Error User Entries Not Found."))
});


app.listen(process.env.PORT, () => { 
    console.log(`
        SERVER is working on PORT ${process.env.PORT}
        on Node_Environment: ${process.env.NODE_ENV}.
    `);
});

// Export the Express API 
module.exports = app;