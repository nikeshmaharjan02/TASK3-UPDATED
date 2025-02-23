const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, 
        description: { type: String },
        price: { type: Number, required: true }, 
        category: { type: String, required: true }, 
        images: { type: [String] },
        tags: { type: [String], default: [] },
        views: { type: Number, default: 0 }, 
        reviews: { type: Number, default: 0 }, 
        popularity: { type: Number, default: 0 }, 
        createdAt: { type: Date, default: Date.now }, 
    },
    { timestamps: true }
);


productSchema.index({ name: "text", description: "text", category: "text", tags: "text" });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

module.exports = productModel;
