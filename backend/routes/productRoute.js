const express = require("express");
const { getProducts, getProduct, addProduct } = require("../controllers/productController");
const { authUser, authAdmin } = require('../middlewares/authMiddleware'); 
const   upload  = require("../middlewares/multer.js");

const productRouter = express.Router();


productRouter.get("/get-products", getProducts);
productRouter.get("/get-product/:id", getProduct);

productRouter.post("/add-product", upload.array('images', 5), addProduct);

module.exports = productRouter;
