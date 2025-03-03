const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
    {
        searchTerm: { type: String, required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, 
        searchedAt: { type: Date, default: Date.now }
    },
    { timestamps: true } 
);

const searchHistoryModel = mongoose.models.searchHistory || mongoose.model("searchHistory", searchHistorySchema);

module.exports = searchHistoryModel;
