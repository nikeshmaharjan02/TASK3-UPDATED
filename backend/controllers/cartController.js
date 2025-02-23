const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel")
const productModel = require("../models/productModel");
const logger = require("../utils/logger");


const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; 

        // Validate if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        
        let cart = await cartModel.findOne({ userId });

        
        if (!cart) {
            cart = new cartModel({
                userId,
                items: [{ productId, quantity,name:product.name, price: product.price }],
                totalAmount: product.price * quantity,
            });
        } else {
           
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                
                existingItem.quantity += quantity;
                existingItem.price = product.price * existingItem.quantity;
            } else {
                
                cart.items.push({ productId, quantity, price: product.price * quantity });
            }

            
            cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);
        }

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



const getCart = async (req, res) => {
    try {
        const userId = req.user.id; 

        
        const cart = await cartModel.findOne({ userId }).populate("items.productId", "name price images");

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

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; 
     
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
    
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }
 
        cart.items.splice(itemIndex, 1);
       
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);
       
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


const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; 

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: "Invalid productId or quantity" });
        }
 
        let cart = await cartModel.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const item = cart.items.find(item => item.productId._id.toString() === productId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

       
        if (!item.productId.price || isNaN(item.productId.price)) {
            return res.status(400).json({ success: false, message: "Invalid product price" });
        }

        
        item.quantity = quantity;
        item.price = item.productId.price * quantity;

        
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);

        
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

const checkout = async (req, res) => {
    try {
        const userId = req.user.id; 

        
        const cart = await cartModel.findOne({ userId }).populate("items.productId", "name price images");
        console.log(cart)
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty." });
        }

        // Create a new order
        const order = new orderModel({
            userId,
            cartId: cart._id,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity,
                image: item.productId.images?.[0] || null,
            })),
            totalAmount: cart.totalAmount,
            status: "pending", 
        });

        
        await order.save();
        console.log(order)

       
        await cartModel.findOneAndDelete({ userId });

        logger.info(`User ${userId} checked out successfully. Order ID: ${order._id}`);

        res.status(200).json({
            success: true,
            message: "Checkout successful! Your order has been placed.",
            order,
        });
    } catch (error) {
        logger.error(`Error during checkout: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}
 

module.exports = { addToCart, getCart, removeFromCart, updateCart, checkout };
