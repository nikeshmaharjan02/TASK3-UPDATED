const express = require('express');
const { registerUser, loginUser,checkSession, logoutUser, forgotPassword, resetPassword } = require('../controllers/authController.js');
const rateLimit = require('express-rate-limit');


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, 
    message: "Too many requests from this IP, please try again after a minute",
    headers: true, 
});

const authRouter = express.Router();

authRouter.post('/register',limiter, registerUser);
authRouter.post('/login',limiter,loginUser)
authRouter.get('/session', checkSession);
authRouter.post('/logout', logoutUser);
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)

module.exports = authRouter;
