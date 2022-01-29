const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const env         = require('dotenv').config();

// Models
const User = require("../Model/User");
const Product = require("../Model/Product");
const Order = require("../Model/Order");
// Constants

// Helpers
const UserHelper = require("../Helper/UserHelper");
const ProductHelper = require("../Helper/ProductHelper");
const ResponseHelper = require("../Helper/ResponseHelper");
const { token } = require("morgan");


// exports.login = async (req, res, next) => {
//     let request = req.body;
//     if (!(request.email && request.password)) {
//         return res.status(400).json("Missing Email or Password");
//     }
//     let admin = await UserHelper.foundUserByEmail(request.email.toLowerCase());
//     if (admin == null) {
//         return res.status(400).json("Email does not exist");
//     }
//     bcrypt.compare(request.password, admin.password, (err, result) => {
//         if (err) {
//             return res.status(400).json("Wrong Password");
//         }
//         if (result) {
//             const token = jwt.sign(
//                 {
//                     email: request.email,
//                 },
//                 process.env.JWT_SECRET,
//                 {
//                     expiresIn: "12h"
//                 });

//             let result = {
//                 email: request.email,
//                 profileImage: admin.profileImage,
//                 token:token
//             }
//             // Only For Login API
//             return res.status(200).json("Logged in as Admin",result);
//         }
//     });
//     return res.status(400).json("Something went wrong");
// }

exports.signup = async (req, res, next) => {
    //Signup function to add a new user  when the user provides required info
    let request = req.body;
    //checking required info
    if (!request.email || !request.password) {
        return res.status(400).json("Missing Email or Password");
    }
    //checking if the email entered by user already exists or not
    let modelUser = await UserHelper.foundUserByEmail(request.email.toLowerCase());
    if (!(modelUser == null)) {
        return res.status(400).json("User already exist with this email");
    }
    let token = await UserHelper.tokenCreated(request.email);
    let password = await UserHelper.bcryptPassword(request.password);
    //adding user to database
    let user = await UserHelper.createAdmin(request.email.toLowerCase(), password,'admin',token);
    return res.status(200).json("Admin successfully created");
};

exports.addProduct = async (req,res)=>{
    let request = req.body;
    const title = request.title;
    const category = request.category;
    const price = request.price;
    const imageUrl =request.imageUrl;
    // console.log(name," ",category," ",price," ",picture);
    if(!title || !category || !price || !imageUrl ){
            return res.status(400).json("Missing credentials");
    }
       let result = await ProductHelper.addProduct(title,category,price,imageUrl);
        return res.status(200).json(result);
};

exports.editProduct = async (req, res, next) =>{
    let request = req.params;
    const id = request.id;
    if(!request.id){
        return res.status(400).json("Missing Product Id")
    }
    let product = await ProductHelper.findProduct(id);
    if(!product){
        return res.status(400).json("No such product");
    }
    let result = await ProductHelper.updatingProduct(product, req, res);
    return res.status(200).json("Product Updated");
};

exports.deleteProduct = async (req, res, next) => {
    let request = req.params;
    const id = request.id;
    if(!request.id){
        return res.status(400).json("Missing Product Id")
    }
    let result = await ProductHelper.findProduct(id);
    if(!result){
        return res.status(400).json("No such product");
    }
    let deleteProduct = await ProductHelper.deleteProduct(id);
    return res.status(200).json("Product deleted successfully");
    
};
// export const deleteProduct = async (req, res, next) => {
//     try {
//         const productId = req.params.id;
//
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product don't found" });
//         }
//
//         const deletedProduct = await Product.findOneAndDelete({ _id: productId });
//
//         deleteFile(product.imageUrl);
//
//         res.status(200).json({ message: "product Deleted Successfully" });
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong deleteProduct" });
//         console.log(e);
//     }
// };
exports.getAllOrders = async (req, res, next) => {
        let orders = await Order.find().sort({"createdAt":-1});
        if(orders === null){
            return res.status(400).json("No orders")
        }
        let response = ResponseHelper.setResponse(200, "success", orders)
        return res.status(200).json(response.result);
            //  const test =   orders.map((x)=>{
            //    console.log(x.total)
            //       x.products?.map((x)=>{

            //        const id = x._id
            //       x['test'] = 'test'
            //       console.log(x)


            //       })
            //     })
            // .sort({ createdAt: -1 })
            //  .populate("productId");



            
    
};

// export const orderStatus = async (req, res, next) => {
//     try {
//         const order = await Order.findById({
//             _id: req.params.id,
//         });
//         if (!order) {
//             return res.status(200).json({ message: "Order Don't find" });
//         }
//
//         order.status = req.body.status;
//
//         await order.save();
//         res.status(200).json({ message: "order status edited successfully" });
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong Changing " });
//         console.log(e);
//     }
// };
//
// export const deleteOrder = async (req, res, next) => {
//     try {
//         const order = await Order.findById({ _id: req.params.id });
//         order.delete = 1;
//         await order.save();
//         if (!order) {
//             return res.status(200).json({ message: "no such order exist" });
//         }
//         res.status(200).json({ message: "order deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ message: "something went wrong Changing " });
//         console.log(err);
//     }
// };


exports.login = async (req, res, next) => {
    let request = req.body;
    //let response = ResponseHelper.getDefaultResponse();

    if(!request.email || !request.password)
    {
        return res.status(400).json("Missing Email or Password")
    }
    const _user = await UserHelper.foundUserByEmail(request.email.toLowerCase());
    console.log(_user);
    if(_user===null) 
    {
        return res.status(400).json("User does not exist")
    }

  // let name = await UserHelper.getUserName(user);
    bcrypt.compare(req.body.password, _user.password, (err, result) => {
        if (err) 
        {
            return res.status(400).json("Wrong Password")
        }
        if (result) 
        {

            let data = {
                email   : _user.email,
                userId  : _user._id,
                role    : _user.role,
            };
            
            // Object.assign(user, {name:name});
            let optional = {};

            if(!request.rememberMe)
                optional['expiresIn'] = "24h";

            const token = jwt.sign(data, process.env.JWT_SECRET, optional);
            
            // Object.assign(user,{_id:user._id});
            
            let user = {
                _id     : _user._id,
                role    : _user.role,
                email   : _user.email,
                profileImage : _user.profileImage,
            }
            let response = ResponseHelper.setResponse(200,"Success",user);
            response.token = token;
            response.currentUser = _user._id;
            return res.status(200).json(response);
        }
    });
};

exports.getProducts = async(req,res)=>{
    let request = req.body;
    let products = await ProductHelper.getProducts();
    if(products==null){
        return res.status(400).json("No Products");
    }
    let response = ResponseHelper.setResponse(200,"Success",products)
    return res.status(200).json(response);
};

exports.getSpecificProduct = async(req,res,next)=>{
    let request = req.params;
    if(!request.id){
        return res.status(400).json("Missing Product Id")
    }
    const id = req.params.id;
    console.log(id);
    let result = await ProductHelper.findProduct(id);
    if(!result){
        return res.status(400).json("No such product");
    }
    return res.status(200).json(result);
}