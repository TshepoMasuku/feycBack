const handleSignIn = async (prisma, bcrypt, req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json("Enter the required form details.");
    }

    try {
        // Find login record by email
        const login = await prisma.login.findUnique({
            where: { email },
            select: { hash: true }, // Only select the hash field
        });

        if (!login) {
            return res.status(400).json("Incorrect Log In Credentials.");
        }

        // Validate password
        const isValid = bcrypt.compare(password, login.hash);

        if (isValid) {
            // Find user by email
            const user = await prisma.users.findUnique({
                where: { email },
            });

            if (user) {
                res.json(user);
            } else {
                res.status(404).json("Error: User Not Found.");
            }
        } else {
            res.status(400).json("Incorrect Log In Credentials.");
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(400).json("Incorrect Log In Credentials.");
    }
};

module.exports = {
    handleSignIn,
}