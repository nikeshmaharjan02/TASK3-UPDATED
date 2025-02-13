const express = require("express");
const { getProducts, addProduct } = require("../controllers/productController");
const { authUser, authAdmin } = require('../middlewares/authMiddleware'); 
const   upload  = require("../middlewares/multer.js");

const productRouter = express.Router();

// Route to fetch all products with filtering, sorting, and pagination
productRouter.get("/get-products", getProducts);

// Route to add a new product (if needed)
productRouter.post("/add-product", upload.single('image'),authUser, authAdmin, addProduct);

module.exports = productRouter;
