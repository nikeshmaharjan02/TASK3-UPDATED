const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,  // Store the action (LOGIN, LOGOUT, PROFILE_UPDATED, etc.)
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now  
    }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
