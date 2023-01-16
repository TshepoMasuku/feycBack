require('dotenv-flow').config();
const Clarifai = require('clarifai'); 

const app = new Clarifai.App({ 
    apiKey:  process.env.API_CLARIFAI 
});

const handleAPIcall = (req, res) => {
    // app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input) 
    app.models.predict(
        {
            id: 'face-detection',
            name: 'face-detection',
            version: '6dc7e46bc9124c5c8824be4822abe105',
            type: 'visual-detector',
        }, req.body.input) 
        .then(data => res.json(data))
        .catch(err => res.status(400).json('unable to work with API.'))
}

const handleImage = (db, req, res) => {
    const { id } = req.body;
    db("users").where("id","=",id)
        .increment("entries", 1)
        .returning("entries")
        .then( entries => res.json(entries[0]) )
        .catch(err => res.status(404).json("Error User Entries Not Found."))
};

module.exports = {
    handleImage,
    handleAPIcall
}