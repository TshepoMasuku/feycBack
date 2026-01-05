const handleProfile = async (prisma, req, res) => {
    try {
        const { id } = req.params;

        // Find user by ID
        const user = await prisma.users.findUnique({
        where: { 
                id: Number(id)  // Ensure 'id' is a number
            },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json("User Not Found.");
        }
    } catch (err) {
        console.error("Error getting user profile:", err);
        res.status(404).json("Error Getting User Profile.");
    }
};

module.exports = {
    handleProfile,
}