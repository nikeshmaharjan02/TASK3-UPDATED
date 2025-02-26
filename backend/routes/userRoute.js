const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { authUser } = require('../middlewares/authMiddleware');
const   upload  = require("../middlewares/multer.js");

const userRouter = express.Router();

userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, upload.array('image', 5), updateUserProfile);


module.exports = userRouter;
