const express = require("express");
const { addToCart, getCart, removeFromCart, updateCart } = require("../controllers/cartController");
const { authUser } = require("../middlewares/authMiddleware");

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", authUser, addToCart);


cartRouter.get("/", authUser, getCart);

cartRouter.delete("/remove-from-cart", authUser, removeFromCart);

cartRouter.put("/update-cart", authUser, updateCart);

module.exports = cartRouter;
