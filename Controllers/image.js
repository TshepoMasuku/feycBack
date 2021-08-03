const Clarifai = require('clarifai');

const app = new Clarifai.App({ 
    // apiKey:  process.env.API_CLARIFAI 
    apiKey: '3176a6426124469aaae986f2d621c227' 
});

const handleImage = (db, req, res) => {
    const { id } = req.body;
    db("users").where("id","=",id)
        .increment("entries", 1)
        .returning("entries")
        .then( entries => res.json(entries[0]) )
        .catch(err => res.status(404).json("Error User Entries Not Found.", err))
};

const handleAPIcall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        // .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'))
}

module.exports = {
    handleImage,
    handleAPIcall
}
