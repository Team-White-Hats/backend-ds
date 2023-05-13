const express = require("express");
const amqp = require("amqplib");
let channel, connection;
const {
  fetchAllProducts,
  createProduct,
  fetchProductsByCategory,
  getSingleItem,
  deleteProduct,
  updateProduct,
  getcategoryItem,
  buyproduct,
  getProduct,

} = require("../controllers/ProductController");



const router = express.Router();

router.get("/productsarray", fetchAllProducts);
router.get("/getallproduct", getProduct);
router.post("/create", createProduct);
router.get("/products/:category", fetchProductsByCategory);
router.put("/products/:pid", updateProduct);
router.delete("/products/:pid", deleteProduct);
router.get("/product/:pid", getSingleItem);
router.get("/product/:cat",getcategoryItem);
router.post("/products/buy",buyproduct);

module.exports = router;