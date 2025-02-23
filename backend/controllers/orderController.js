const orderModel = require("../models/orderModel");

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; 

        const orders = await orderModel.find({ userId })
            .select("-__v") 
            .sort({ createdAt: -1 }); 

        if (!orders.length) {
            return res.status(404).json({ success: false, message: "No orders found." });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = { getUserOrders, getOrderById };
