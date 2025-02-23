const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, 
        cartId: { type: mongoose.Schema.Types.ObjectId, ref: "cart", required: true }, 
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
                name: {type:String,required:true},
                quantity: { type: Number, required: true }, 
                price: { type: Number, required: true },
                image: { type: String },
            }
        ],
        totalAmount: { type: Number, required: true }, 
        status: { 
            type: String, 
            enum: ["pending","processing", "paid", "shipped", "delivered", "cancelled"], 
            default: "pending" 
        }, 
       
    },
    { timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

module.exports = orderModel;
