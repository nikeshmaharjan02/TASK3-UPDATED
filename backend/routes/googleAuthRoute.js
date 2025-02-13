const express = require('express');
const passport = require('passport');
const { loginWithGoogle, logoutUser } = require('../controllers/googleAuthController');  // ✅ Correct import

const googleAuthRouter = express.Router();

// Google OAuth login route
googleAuthRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
googleAuthRouter.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    loginWithGoogle
);

// Google Logout Route (Using common logout function)
googleAuthRouter.post('/logout', logoutUser);  // ✅ Use logoutUser (not logoutGoogleUser)

module.exports = googleAuthRouter;
