const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        gender: { type: String, default: "Not Selected" },
        dob: { type: String, default: "Not Selected" },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        image: {type: String }
    });

const userModel =
    mongoose.models.user || mongoose.model("user", userSchema);

module.exports = userModel;
