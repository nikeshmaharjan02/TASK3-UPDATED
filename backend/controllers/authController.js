const validator = require('validator');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/emailService');
const logActivity = require('../utils/logActivity');


// api to register user
const registerUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body

        // checking for all data to add user
        if (!name || !password || !email) {
            return res.json({success:false,message:"Missing Details"})
        }

        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please Enter a Valid Email"})
        }

        //validating strong password
        if (password.length < 8){ 
            return res.json({success:false,message:"Please Enter a Strong Password"})
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Creating new user
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            role: role || "user"  // Default role is "user"
        });
        await user.save()

        // const token = jwt.sign({id: user._id, role: user.role},process.env.JWT_SECRET)
        res.json({ success: true, message: "User registered successfully" });
        // res.json({success:true,token})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
};

// api to register user
const loginUser = async (req,res) => {
    try {
        const { email, password} = req.body
        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({success:false,message:"User doesnot exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch) {
            res.json({success:false,message:"Invalid Credentials!!"})
        } else {
            // const token = jwt.sign({id: user._id, role: user.role },process.env.JWT_SECRET)
            // **Store user session**
            req.session.user = { id: user._id, name:user.name, role: user.role, email: user.email, };
            // res.json({success:true,token})
            await logActivity(user._id, 'LOGIN');
            res.status(200).json({ success: true, message: "Login successful" });
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
};
// **Check if User is Logged In**
const checkSession = (req, res) => {
    if (req.session.user) {
        res.status(200).json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: "Not authenticated" });
    }
}
// **Logout User**
const logoutUser = (req, res) => {
    if (!req.session.user && !req.user) {
        return res.status(400).json({ success: false, message: "User not logged in" });
    }
    const userId = req.session.user?.id || req.user?.id;  // Accessing userId from session
    
    if (!userId) {
        return res.status(400).json({ success: false, message: "User not logged in" });
    }
    logActivity(userId, 'LOGOUT');
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: "Logout failed" });
        res.clearCookie("connect.sid");
        req.logout(() => {
            res.status(200).json({ success: true, message: "Logged out successfully" });
        });
    });
};


const forgotPassword = async (req,res)=> {
    try {
        const {email} = req.body

        //validate required fiels
        if (!email) {
            return res.json({success:false, message:"Email required"})
        }

        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false,message:"User not found"})
        }
        const resetToken = jwt.sign({id: user._id, role: user.role},process.env.RESET_TOKEN,{expiresIn: "10m"})


        // const resetLink = `http://localhost:4000/api/auth/reset-password?token=${resetToken}`
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`

        await sendEmail(user.email, "Reset Password", `Click the link to reset your password: ${resetLink}`);
        res.json({success:true, message:"Reset Password Email Sent Successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
const resetPassword = async (req,res)=> {
    try {
        const {password} = req.body
        const token = req.query.token;

        //validate required fiels
        if (!token || !password) {
            return res.json({success:false, message:"Password is required"})
        }

        const decoded = jwt.verify(token, process.env.RESET_TOKEN);
        // hashing  password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const updatedUser = await userModel.findByIdAndUpdate(decoded.id,{password:hashedPassword}, { new: true }).select("-password");

        
        res.json({success:true, message:"Reset Password Successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}



module.exports = { registerUser, loginUser, checkSession, logoutUser, forgotPassword, resetPassword };
