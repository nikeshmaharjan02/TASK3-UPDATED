const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        gender: { type: String, default: "Not Selected" },
        dob: { type: String, default: "Not Selected" },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        image: {type: String },
        googleId: { type: String },
        loginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date, default: null }
    });
userSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
};

const userModel =
    mongoose.models.user || mongoose.model("user", userSchema);

module.exports = userModel;
