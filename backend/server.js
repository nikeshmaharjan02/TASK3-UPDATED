const express = require('express');
require('dotenv/config');
const cors = require('cors')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/mongodb.js');
const connectCloudinary = require('./config/cloudinary.js');
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoute.js');
const adminRouter = require('./routes/adminRoute.js')


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173", // First allowed frontend URL
        "http://localhost:5174", // Second allowed frontend URL
    ],
    credentials: true,
}));

// Session Middleware (Stores sessions in MongoDB)
app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,
        dbName: "task3",
        collectionName: "sessions",
    }),  // Store sessions in MongoDB
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// api endpoints
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/admin', adminRouter)



app.get('/',(req,res)=>{
    res.send("API WORKING")
})

app.listen(port, ()=> console.log("Server Started",port))