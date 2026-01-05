require('dotenv-flow').config();

const handleAPIcall = async (req, res) => {
    const { input } = req.body;
    if (!input) {
        return res.status(400).json({ error: "Missing Image URL Input" });
    }
    
    const faceDataReq = await fetch(
        "https://api.clarifai.com/v2/users/clarifai/apps/main/models/face-detection/versions/45fb9a671625463fa646c3523a3087d5/outputs",
        {
            method: "POST",
            headers: {
                Authorization: `Key ${process.env.CLARIFAI_PAT}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                inputs: [
                    {
                        data: {
                            image: {
                                url: input,
                            },
                        },
                    },
                ],
            }),
        }
    );

    if (!faceDataReq.ok) {
        const err = await faceDataReq.json();
        throw new Error(`Clarifai ${faceDataReq.status}: ${err.status?.description || err.message}`);
    } else {
        await faceDataReq.json()
            .then(faceData => res.json(faceData))
            .catch(err => res.status(400).json({ error: "Clarifai API failed", details: err.message }));
    }
}

const handleImage = async (prisma, req, res) => {
    try {
        const { id } = req.body;

    // Increment 'entries' by 1 and return the updated value
    const updatedUser = await prisma.users.update({
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