const express = require('express');
const { getUsers, getUserActivity, getUsersWithActivityLogs } = require('../controllers/adminController'); 
const { authUser, authAdmin } = require('../middlewares/authMiddleware'); 

const adminRouter = express.Router();

adminRouter.get('/get-all-users', authUser, authAdmin, getUsers);
adminRouter.get('/get-users-with-activity-logs', authUser, authAdmin, getUsersWithActivityLogs);
adminRouter.get('/get-user-activity/:userId', authUser, authAdmin, getUserActivity);

module.exports = adminRouter;
