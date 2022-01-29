const Product = require("../Model/Product");
const ProductHelper = require("../Helper/ProductHelper");
const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const env         = require('dotenv').config();
const ResponseHelper = require("../Helper/ResponseHelper");
const Order = require("../Model/Order");
// import Cart, { addToCart } from "../Models/cart.js";
// import paypal from "paypal-rest-sdk";
// import {
//     placedOrderEmail,
//     alertAdminOnNewOrderPlaced,
// } from "../helpers/emailHelper.js";

// export const addProductToCart = async (req, res, next) => {
//     try {
//         const productId = req.body.productId;
//         const quantity = req.body.quantity;
//         const price = req.body.price;
//         const userId = req.body.userId;
//         let cart = await Cart.findOne({ user: userId });
//         const product = await Product.findById({ _id: productId });
//         console.log(product);
//         if (cart) {
//             cart = await addToCart(cart, product, quantity, price);
//             // await cart.save();
//         } else {
//             cart = new Cart({
//                 user: userId,
//                 items: [],
//             });
//             // await cart.save();
//             const cart = await addToCart(cart, product, quantity, price);
//             await cart.save();
//         }

//         const CartProduct = await Cart.findOne({ userId: userId }).populate(
//             "items.productId"
//         );
//         res.status(200).json(CartProduct);
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong in Add to Cart" });
//         console.log(e);
//     }
// };

// export const removeProductFromCart = async (req, res, next) => {
//     try {
//         const productId = req.params.productId;

//         const cart = await Cart.findById({ _id: req.body.id });

//         await cart.removeFromCart(productId);
//         //console.log(CartProduct);
//         const userCart = await Cart.findById(req.body.id).populate(
//             "items.productId"
//         );
//         res.status(200).json(userCart);
//     } catch (e) {
//         res
//             .status(500)
//             .json({ message: "something went wrong in remove product from Cart" });
//         console.log(e);
//     }
// };



// export const myOrderss = async (req, res, next) => {
//     try {
//         const order = await Order.find({ userId: req.body.userID}).sort({"createdAt":-1});
//         if (!order) {
//             return res
//                 .status(200)
//                 .json({ message: "You have not ordered anything yet" });
//         }
//         res.status(200).json(order);
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong in myOrder" });
//         console.log(e);
//     }
// };

// export const getPaypall = async (req, res, next) => {
//     try {
//         let create_payment_json = {
//             intent: "sale",
//             payer: {
//                 payment_method: "paypal",
//             },
//             redirect_urls: {
//                 return_url: "https://hamza-flaws.herokuapp.com/success",
//                 cancel_url: "https://hamza-flaws.herokuapp.com/cancel",
//             },
//             transactions: [
//                 {
//                     amount: {
//                         currency: "GBP",
//                         total: "0.1",
//                     },
//                     description: "This is the demo description.",
//                 },
//             ],
//         };

//         paypal.payment.create(create_payment_json, function (error, payment) {
//             if (error) {
//                 throw error;
//             } else {
//                 console.log("Create Payment Response");

//                 res.redirect(payment.links[1].href);
//             }
//         });
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong in getPaypall" });
//         console.log(e);
//     }
// };

// export const paypallSuccess = (req, res) => {
//     try {
//         const PayerID = req.query.PayerID;
//         const paymentId = req.query.paymentId;
//         const execute_payment_json = {
//             payer_id: PayerID,
//             // transactions: [
//             //   {
//             //     amount: {
//             //       currency: "USD",
//             //       total: "1.00",
//             //     },
//             //   },
//             // ],
//         };

//         paypal.payment.execute(
//             paymentId,
//             execute_payment_json,
//             function (error, payment) {
//                 if (error) {
//                     console.log(error.response);
//                     throw error;
//                 } else {
//                     console.log("Get Payment Response");
//                     console.log(JSON.stringify(payment));
//                     res.render("index");
//                 }
//             }
//         );
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong in getPaypall" });
//         console.log(e);
//     }
// };

exports.addProduct = async (req,res,next)=>{
    let request = req.query;
    let title = request.title;
    let category = request.category;
    let price = request.price;
    let imageUrl = request.imageUrl;
//     console.log(name," ",category," ",price," ",picture);
    // if(!((request.title && request.category) && (request.price && request.imageUrl))){
    //         return res.status(400).json("Missing credentials");
    // }
       let result = await ProductHelper.addProduct(title,category,price,imageUrl);
        return res.status(200).json("Product has been successfully added");
};

exports.getProducts = async(req,res)=>{
    let request = req.body;
    const name = request.name;
    let products = await ProductHelper.getProduct();
    if(products==null){
        return res.status(400).json("No Products");
    }
    let response = ResponseHelper.setResponse(200,"Success",products)
    return res.status(200).json(response);
};



// export const myOrders = async (req, res, next) => {
//     try {
//         const order = await Order.find({ userId: req.userId });

//         if (!order) {
//             return res
//                 .status(200)
//                 .json({ message: "You have not ordered anything yet" });
//         }
//         res.status(200).json(order);
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong in myOrder" });
//         console.log(e);
//     }
// };