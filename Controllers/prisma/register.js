const handleRegister = async (prisma, bcrypt, req, res) => {
    const { name, surname, email, password } = req.body;

    // Validate input
    if (!name || !surname || !email || !password) {
        return res.status(400).json("Enter the required form details.");
    }

    try {
        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Start transaction
        await prisma.$transaction(async (prisma) => {
            // Create login record
            const login = await prisma.login.create({
                data: {
                hash,
                email,
                },
            });

            // Create user record
            const user = await prisma.users.create({
                data: {
                name,
                surname,
                email: login.email,
                joined: new Date(),
                },
            });

            res.json({ message: "Registration successful", user });
            return user;
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(400).json("Registration Unsuccessful.");
    }
};

module.exports = {
    handleRegister,
}