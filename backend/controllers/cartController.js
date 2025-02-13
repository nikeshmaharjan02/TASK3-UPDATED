const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const logger = require("../utils/logger");

// @desc   Add item to cart
// @route  POST /api/cart/add-to-cart
// @access Private (User should be logged in)
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; 

        // Validate if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if cart already exists for the user
        let cart = await cartModel.findOne({ userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new cartModel({
                userId,
                items: [{ productId, quantity, price: product.price }],
                totalAmount: product.price * quantity,
            });
        } else {
            // If cart exists, check if product is already in the cart
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                // If item exists, update the quantity and price
                existingItem.quantity += quantity;
                existingItem.price = product.price * existingItem.quantity;
            } else {
                // If item doesn't exist, add it to the cart
                cart.items.push({ productId, quantity, price: product.price * quantity });
            }

            // Recalculate total amount
            cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);
        }

        // Save or update the cart in the database
        await cart.save();

        logger.info(`User ${userId} added product ${productId} to cart`);

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cart,
        });
    } catch (error) {
        logger.error(`Error adding to cart: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc   Get user's cart
// @route  GET /api/cart
// @access Private (User should be logged in)
const getCart = async (req, res) => {
    try {
        const userId = req.user.id; // Assume userId is attached from authentication middleware

        // Fetch cart for the user
        const cart = await cartModel.findOne({ userId }).populate("items.productId", "name price image");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart,
        });
    } catch (error) {
        logger.error(`Error fetching cart: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/remove-from-cart
// @access Private (User should be logged in)
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; // Assume userId is attached from authentication middleware

        // Fetch user's cart
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Find the product in the cart and remove it
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        // Remove the item
        cart.items.splice(itemIndex, 1);

        // Recalculate the total amount
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);

        // Save the updated cart
        await cart.save();

        logger.info(`User ${userId} removed product ${productId} from cart`);

        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart,
        });
    } catch (error) {
        logger.error(`Error removing from cart: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc   Update item quantity in the cart
// @route  PUT /api/cart/update-cart
// @access Private (User should be logged in)
const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; // Assume userId is attached from authentication middleware

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: "Invalid productId or quantity" });
        }

        // Fetch user's cart and populate the productId to access price
        let cart = await cartModel.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const item = cart.items.find(item => item.productId._id.toString() === productId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        // Ensure price is valid before using it
        if (!item.productId.price || isNaN(item.productId.price)) {
            return res.status(400).json({ success: false, message: "Invalid product price" });
        }

        // Update the item quantity and price
        item.quantity = quantity;
        item.price = item.productId.price * quantity;

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);

        // Save the updated cart
        await cart.save();

        logger.info(`User ${userId} updated product ${productId} in the cart`);

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart,
        });
    } catch (error) {
        logger.error(`Error updating cart: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


module.exports = { addToCart, getCart, removeFromCart, updateCart };
