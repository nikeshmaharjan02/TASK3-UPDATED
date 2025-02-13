const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, 
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true }, 
                quantity: { type: Number, required: true }, 
                price: { type: Number, required: true }, 
            }
        ],
        totalAmount: { type: Number, required: true }, 
    },
    { timestamps: true } 
);

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);

module.exports = cartModel;
