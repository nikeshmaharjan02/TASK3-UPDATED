const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/task3`);
};

module.exports = connectDB;
