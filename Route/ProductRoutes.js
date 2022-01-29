// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const ProductController = require('../Controller/ProductController');



// Routes

router.post("/addProduct",ProductController.addProduct);
router.get("/productList",ProductController.getProducts);
router.get("/getProducts",ProductController.getProducts);

0
module.exports = router;