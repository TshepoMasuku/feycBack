const handleSignIn = (db, bcrypt, req, res) => {
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
};

module.exports = {
    handleSignIn,
}