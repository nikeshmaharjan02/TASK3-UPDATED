const productModel = require("../models/productModel");
const logger = require("../utils/logger");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


// @desc   Fetch products with filtering, sorting, and pagination
// @route  GET /api/products/get-products
// @access Public
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, min_price, max_price, sort, category } = req.query;

        let filter = {}; // Define filter object

        // Apply price filtering
        if (min_price || max_price) {
            filter.price = {};
            if (min_price) filter.price.$gte = parseFloat(min_price);
            if (max_price) filter.price.$lte = parseFloat(max_price);
        }

        // Apply category filter
        if (category) {
            filter.category = category;
        }

        // Sorting (default is newest first)
        let sortOption = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };
        if (sort === "views") sortOption = { views: -1 };
        if (sort === "popularity") sortOption = { popularity: -1 };
        if (sort === "reviews") sortOption = { reviews: -1 };

        // Pagination calculations
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch products with filters, sorting, and pagination
        const products = await productModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination metadata
        const total = await productModel.countDocuments(filter);

        // Respond with success and data
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            data: products,
        });
    } catch (error) {
        logger.error(`Error fetching products: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const imageFile = req.file;  

        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Name, price, and category are required.",
            });
        }

        let imageUrl;

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

            imageUrl = imageUpload.secure_url;

            // Remove uploaded file from local storage (after Cloudinary upload)
            fs.unlinkSync(imageFile.path);
        }

        const newProduct = new productModel({
            name,
            description,
            price,
            category,
            image: imageUrl,  
        });

        await newProduct.save();


        logger.info(`New product added: ${name} (ID: ${newProduct._id})`);

        res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: newProduct,
        });
    } catch (error) {
        logger.error(`Error adding product: ${error.message}`);

        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};


module.exports = { getProducts, addProduct };
