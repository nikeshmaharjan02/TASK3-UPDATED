const userModel = require('../models/userModel');
const ActivityLog = require('../models/activityLogModel');

// Helper function to fetch activity logs for a user
const getUserActivityLogs = async (userId) => {
    try {
        return await ActivityLog.find({ userId }).sort({ timestamp: -1 });
    } catch (error) {
        throw new Error('Error fetching activity logs');
    }
};

// Controller to get all users (without activity logs)
const getUsers = async (req, res) => {
    try {

        const users = await userModel.find({ role: 'user' }).select('-password');

        const totalUsers = await userModel.countDocuments({ role: 'user' });

        res.json({
            success: true,
            data: users,
            totalUsers  
        });
    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({ success: false, message: 'Server error occurred' });
    }
};

// Controller to get users with their activity logs
const getUsersWithActivityLogs = async (req, res) => {
    try {
        const users = await userModel.find({ role: 'user' }).select('-password');

        // Fetch activity logs for each user and prepare response
        const usersWithActivityLogs = await Promise.all(
            users.map(async (user) => {
                const activityLogs = await getUserActivityLogs(user._id);
                return { 
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    activityLogs
                };
            })
        );

        res.json({
            success: true,
            data: usersWithActivityLogs
        });

    } catch (error) {
        console.error('Error in getUsersWithActivityLogs:', error);
        res.status(500).json({ success: false, message: 'Server error occurred' });
    }
};

// Controller to get activity logs for a particular user
const getUserActivity = async (req, res) => {
    try {
        const { userId } = req.params;  // Extract userId from the URL parameters
        
        // Check if the user exists
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch the activity logs for the particular user
        const activityLogs = await getUserActivityLogs(userId);

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                activityLogs
            }
        });

    } catch (error) {
        console.error('Error in getUserActivity:', error);
        res.status(500).json({ success: false, message: 'Server error occurred' });
    }
};

module.exports = { getUsers, getUsersWithActivityLogs, getUserActivity };
