// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const UserController = require("../Controller/UserController");
const AdminController = require("../Controller/AdminController");
const User = require("../Model/User");


// Routes
router.post("/login",AdminController.login);
router.post("/signup",UserController.signup);
router.get("/getProduct",UserController.getProduct);
router.post("/getProductByCategory",UserController.getProductsByCategory);
router.post("/forgotPassword",UserController.forgot);
router.post("/checkout",UserController.createCustomerForStripe);
router.post("/createOrder",UserController.createOrder);
router.post("/orders",UserController.getOrders);
module.exports = router;