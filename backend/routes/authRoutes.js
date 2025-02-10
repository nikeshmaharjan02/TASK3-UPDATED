const express = require('express');
const { registerUser, loginUser,checkSession, logoutUser, forgotPassword, resetPassword } = require('../controllers/authController.js');

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login',loginUser)
authRouter.get('/session', checkSession);
authRouter.post('/logout', logoutUser);
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)

module.exports = authRouter;
