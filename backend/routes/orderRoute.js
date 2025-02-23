const express = require("express");
const { getUserOrders } = require("../controllers/orderController");
const { authUser } = require("../middlewares/authMiddleware");

const orderRouter = express.Router();

orderRouter.get("/", authUser, getUserOrders);



module.exports = orderRouter;
