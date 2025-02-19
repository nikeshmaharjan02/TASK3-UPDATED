const express = require("express");
const { getProducts, addProduct } = require("../controllers/productController");
const { authUser, authAdmin } = require('../middlewares/authMiddleware'); 
const   upload  = require("../middlewares/multer.js");

const productRouter = express.Router();


productRouter.get("/get-products", getProducts);


productRouter.post("/add-product", upload.single('image'),authUser, authAdmin, addProduct);

module.exports = productRouter;
