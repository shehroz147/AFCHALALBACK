// Express Router
const express = require("express");
const router = express.Router();
// Controllers
const AdminController = require('../Controller/AdminController');
const auth = require("../Middleware/auth");
// Routes
router.post("/login",AdminController.login);
router.post("/signup",AdminController.signup);
router.post("/addProduct",AdminController.addProduct);
router.post("/editProduct",AdminController.editProduct);
// router.post("/deleteProduct",AdminController.deleteProducts);
// router.get("/loggedInUser",auth,AdminController.getAdmin);
router.get("/shop/getProducts",AdminController.getProducts);
router.get("/shop/getProduct/:id",AdminController.getSpecificProduct);
router.delete("/deleteProduct/:id",AdminController.deleteProduct);
router.patch("/editProduct/:id",AdminController.editProduct)
router.get("/getOrders",AdminController.getAllOrders);
module.exports = router;