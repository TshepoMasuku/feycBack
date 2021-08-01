const handleRegister = (db, bcrypt, req, res) => {
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
};

module.exports = {
    handleRegister,
}