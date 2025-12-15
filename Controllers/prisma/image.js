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

const handleImage = async (prisma, req, res) => {
    try {
        const { id } = req.body;

    // Increment 'entries' by 1 and return the updated value
    const updatedUser = await prisma.user.update({
        where: { id: Number(id) }, // Ensure 'id' is a number
        data: {
            entries: {
                increment: 1, // Prisma's increment syntax
            },
        },
    });

    res.json({ entries: updatedUser.entries });
    } catch (err) {
        console.error("Error updating user entries:", err);
        res.status(404).json("Error: User entries not found.");
    }
};

module.exports = {
    handleImage,
    handleAPIcall
}