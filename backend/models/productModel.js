const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Product name
        description: { type: String }, // Product description
        price: { type: Number, required: true }, // Product price
        category: { type: String, required: true }, // Product category
        image: { type: String }, // Product image URL
        views: { type: Number, default: 0 }, // Number of views
        reviews: { type: Number, default: 0 }, // Number of reviews
        popularity: { type: Number, default: 0 }, // Popularity score
        createdAt: { type: Date, default: Date.now }, // Timestamp
    },
    { timestamps: true }
);

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

module.exports = productModel;
