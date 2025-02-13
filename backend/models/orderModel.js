const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, 
        cartId: { type: mongoose.Schema.Types.ObjectId, ref: "cart", required: true }, 
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
                quantity: { type: Number, required: true }, 
                price: { type: Number, required: true }, 
            }
        ],
        totalAmount: { type: Number, required: true }, 
        status: { 
            type: String, 
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"], 
            default: "pending" 
        }, // Order status
        paymentMethod: { type: String, required: true }, 
        transactionId: { type: String }, 
    },
    { timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

module.exports = orderModel;
