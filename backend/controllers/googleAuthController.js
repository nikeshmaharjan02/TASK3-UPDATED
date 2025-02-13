const userModel = require('../models/userModel');
const logActivity = require("../utils/logActivity");


const loginWithGoogle = async (req, res) => {
    console.log("req.user at the start:", req.user);
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication failed" });
    }

    try {
        console.log("Checking for existing user with email:", req.user.email);
        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: req.user.email });
        console.log("Existing User:", existingUser);

        if (existingUser) {
           
        // User exists, store in session and log activity
            req.session.user = { 
                id: existingUser._id, 
                name: existingUser.name, 
                email: existingUser.email, 
                role: existingUser.role 
            };
            await logActivity(existingUser._id, "LOGIN");
        } else {

            const newUser = new userModel({
                name: req.user.name,
                email: req.user.email,
                role: "user" 
            });

            await newUser.save();

            req.session.user = { 
                id: newUser._id, 
                name: newUser.name, 
                email: newUser.email, 
                role: newUser.role 
            };
            await logActivity(newUser._id, "LOGIN");
        }

        const userData = encodeURIComponent(JSON.stringify(req.session.user));
        res.redirect(`http://localhost:5173/google-login-success?user=${userData}`);
    } catch (error) {
        console.error("Error during Google login:", error);
        res.status(500).json({ success: false, message: "Something went wrong during login." });
    }
};

// Logout User (Google + Normal Auth)
const logoutUser = (req, res) => {
    if (!req.session.user && !req.user) {
        return res.status(400).json({ success: false, message: "User not logged in" });
    }

    const userId = req.session.user?.id || req.user?.id;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User not logged in" });
    }

    logActivity(userId, "LOGOUT");

    req.session.destroy((err) => {
        if (err) return res.status(500).json({ success: false, message: "Logout failed" });
        res.clearCookie("connect.sid");
        req.logout(() => {
            res.status(200).json({ success: true, message: "Logged out successfully" });
        });
    });
};

module.exports = { loginWithGoogle, logoutUser };
