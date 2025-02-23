const productModel = require("../models/productModel");
const logger = require("../utils/logger");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const redisClient = require('../utils/redisClient');

const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, min_price, max_price, sort, category, search, tags } = req.query;

        let filter = {}; 

        if (min_price || max_price) {
            filter.price = {};
            if (min_price) filter.price.$gte = parseFloat(min_price);
            if (max_price) filter.price.$lte = parseFloat(max_price);
        }

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$text = { $search: search };
        }

        if (tags) {
            const tagsArray = tags.split(",").map(tag => tag.trim());
            filter.tags = { $in: tagsArray }; // Search for products that have any of the provided tags
        }

        let sortOption = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };
        if (sort === "views") sortOption = { views: -1 };
        if (sort === "popularity") sortOption = { popularity: -1 };
        if (sort === "reviews") sortOption = { reviews: -1 };

        if (search) {
            sortOption = { score: { $meta: "textScore" }, ...sortOption };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const cacheKey = `products:page=${page}&limit=${limit}&min_price=${min_price || ''}&max_price=${max_price || ''}&sort=${sort || ''}&category=${category || ''}&search=${search || ''}&tags=${tags || ''}`;

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            logger.info('Cache hit for products');
            return res.json({ source: 'cache', ...JSON.parse(cachedData) });
        } else {
            logger.info('Cache miss, fetching from database');
        }

        const products = await productModel.find(filter, search ? { score: { $meta: "textScore" } } : {})
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await productModel.countDocuments(filter);

        const responseData = {
            success: true,
            message: "Products fetched successfully",
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            data: products,
        };

        await redisClient.set(cacheKey, JSON.stringify(responseData), {
            EX: 600 
        });

        res.status(200).json(responseData);
    } catch (error) {
        logger.error(`Error fetching products: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const { id } = req.params; 

        const product = await productModel.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product details fetched successfully",
            data: product
        });
    } catch (error) {
        logger.error(`Error fetching product: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, tags } = req.body;
        const imageFiles = req.files;

        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Name, price, and category are required.",
            });
        }

        let imageUrls = [];

        if (imageFiles && imageFiles.length > 0) {
            try {
                for (let i=0; i< imageFiles.length; i++){
                    const imageUpload = await cloudinary.uploader.upload(imageFiles[i].path, { resource_type: "image" });
                    imageUrls.push(imageUpload.secure_url);
                    fs.unlinkSync(imageFiles[i].path);
                }
            } catch (uploadError) {
                logger.error(`Image upload failed: ${uploadError.message}`);
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: uploadError.message,
                });
            }
        }

        const newProduct = new productModel({
            name,
            description,
            price,
            category,
            tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
            images: imageUrls,
        });

        await newProduct.save();

        // const cacheKeyPattern = `products:page=*&limit=*&min_price=&max_price=&sort=&category=${category || ''}`;
        // await redisClient.del(cacheKeyPattern);
        await redisClient.flushall();

        logger.info(`New product added: ${name} (ID: ${newProduct._id})`);

        res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: newProduct,
        });

    } catch (error) {
        logger.error(`Error adding product: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

module.exports = { getProducts, getProduct, addProduct };
