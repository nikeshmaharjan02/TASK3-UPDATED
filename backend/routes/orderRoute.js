const express = require("express");
const { getUserOrders, getDailySales, getMonthlySales, getSalesTrends, getTotalReport, getTotallReport } = require("../controllers/orderController");
const { authUser, authAdmin } = require("../middlewares/authMiddleware");

const orderRouter = express.Router();

orderRouter.get("/", authUser, getUserOrders);
orderRouter.get("/sales/daily/:date",authUser, authAdmin, getDailySales);
orderRouter.get("/sales/monthly/:year/:month", authUser, authAdmin, getMonthlySales);
// Get sales trends for the last 6 months
orderRouter.get("/sales/trends",authUser, authAdmin, getSalesTrends);
orderRouter.get('/sales/total-report',authUser, authAdmin, getTotalReport);
orderRouter.get('/sales/totall-report',authUser, authAdmin, getTotallReport);

module.exports = orderRouter;
