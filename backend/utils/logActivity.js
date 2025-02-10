const ActivityLog = require('../models/activityLogModel');  

// Reusable function to log user activities
const logActivity = async (userId, action) => {
    try {
        const activityLog = new ActivityLog({
            userId,
            action
        });
        await activityLog.save();  
    } catch (error) {
        console.error("Error logging activity:", error.message);
    }
};

module.exports = logActivity;
