const express = require('express');
const passport = require('passport');
const { loginWithGoogle, logoutUser } = require('../controllers/googleAuthController');  // ✅ Correct import

const googleAuthRouter = express.Router();


googleAuthRouter.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));


googleAuthRouter.get('/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    loginWithGoogle
);


// googleAuthRouter.post('/logout', logoutUser);  

module.exports = googleAuthRouter;
