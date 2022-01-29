

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");

// Models
const User = require("../Model/User");
const Cart = require("../Model/Cart");
const Product = require("../Model/Product");
const Order = require("../Model/Order");
// Constants

// Helpers
const EmailHelper = require("../Helper/EmailHelper");
const UserHelper = require("../Helper/UserHelper");
const ProductHelper = require("../Helper/ProductHelper");
const ResponseHelper = require("../Helper/ResponseHelper");
exports.login = async (req, res, next) => {
    let request = req.body;
    if (!(request.email && request.password)) {
        return res.status(400).json("Missing Email or Password");
    }
    let admin = await UserHelper.foundUserByEmail(request.email.toLowerCase());
    if (admin == null) {
        return res.status(400).json("Email does not exist");
    }
    console.log(admin);
    bcrypt.compare(request.password, admin.password, (err, result) => {
        if (err) {
            return res.status(400).json("Wrong Password");
        }
        if (result) {
            const token = jwt.sign(
                {
                    email: request.email,
                    _id:admin._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "12h"
                });

            let result = {
                email: request.email,
                profileImage: admin.profileImage,
                token:token
            }
            // Only For Login API
            return res.status(200).json("Logged in as Admin",result);
        }
    });
    return res.status(400).json("Something went wrong");
}

exports.signup = async (req, res, next) => {
    //Signup function to add a new user  when the user provides required info
    let request = req.body;
    //checking required info
    if (!req.body.email || !req.body.password) {
        return res.status(400).json("Missing Email or Password");
    }
    //checking if the email entered by user already exists or not
    let modelUser = await UserHelper.foundUserByEmail(request.email.toLowerCase());
    if (!(modelUser === null)) {
        return res.status(400).json("User already exist with this email");
    }
    let password = await UserHelper.bcryptPassword(request.password);
    //adding user to database
    let user = await UserHelper.createUser(request.email.toLowerCase(), password,'user');
    let email = await EmailHelper.sendSignUpEmail(request.email);
    return res.status(200).json(user);
};
exports.getProducts = async(req,res)=>{
    let request = req.body;
    const cat = request.name;
    let findProducts = await ProductHelper.getProducts(cat);
    console.log(findProducts);

    if(findProducts.length === 0){
        return res.status(400).json("No Products of this category");
    }
    
    return res.status(200).json(findProducts);
}

exports.getProduct = async(req,res)=>{
    let request = req.body;
    // const cat = request.name;
    let findProducts = await ProductHelper.getProducts();
    // console.log(findProducts);
    if(findProducts.length === 0){
        return res.status(400).json("No Products of this category");
    }
    let response = ResponseHelper.setResponse(200,"Success",findProducts)
    // console.log(response);
    return res.status(200).json(response);
}


exports.getProductsByCategory = async(req,res)=>{
    let request = req.body;
    const name = request.name;
    let findProducts = await ProductHelper.getProductsCategory(name);
    // console.log(findProducts);
    if(findProducts.length === 0){
        return res.status(400).json("No Products of this category");
    }
    let response = ResponseHelper.setResponse(200,"Success",findProducts)
    return res.status(200).json(response.result);
}

// exports.addProductToCart =async (req, res, next) => {
//     let request = req.body;
//     const product = await Product.find(request.name);
//
//     exports.addFriend = async (user, friend, res) => {
//         return User.updateOne(user, { $push: { friends: { friend } } });
//     }
//
// };
// export const forgetPassword = async (req, res, next) => {
//     try {
//         const token = randomstring.generate({ length: 5, charset: "numeric" });
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(400).json({ message: "no user with this email found" });
//         }
//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 3600000;
//         await user.save();
//         forgetPasswordEamil({ token, to: req.body.email });
//         res
//             .status(200)
//             .json({ token,message: "An email has been sent to your email account" });
//     } catch (e) {
//         res
//             .status(500)
//             .json({ message: "something went wrong in forget password" });
//         console.log(e);
//     }
// };
//
// export const setPasswordAfterforget = async (req, res, next) => {
//     try {
//         const password = req.body.password;
//         // const userId = req.userId;
//         const passwordToken = req.body.passwordToken;
//         let resetUser;
//
//         const user = await User.findOne({
//             email: req.body.email,
//             resetToken: passwordToken,
//             resetTokenExpiration: { $gt: Date.now() },
//         });
//
//         if (!user) {
//             return res.status(400).json({ message: "You are seems to be spam" });
//         }
//         resetUser = user;
//         const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//
//         resetUser.password = hashedPassword;
//         resetUser.resetToken = undefined;
//         resetUser.resetTokenExpiration = undefined;
//         await resetUser.save();
//
//         res.status(200).json({ message: "your password is successfully changed" });
//     } catch (e) {
//         res
//             .status(500)
//             .json({ message: "something went wrong in setPasswordAfterforget" });
//         console.log(e);
//     }
// };

exports.forgot = async (req, res, next) => {
    const request = req.body;
    const foundUser = await UserHelper.foundUserByEmail(request.email);
    if (foundUser == null) {
        let response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.EMAIL_NOT_EXIST);
        return res.status(response.code).json(response);
    }
    const forgotToken = await UserHelper.tokenCreated(request.email);
    const FRONT_APP_URL = UserHelper.getFrontAppResetUrl();
    const link = `${FRONT_APP_URL}?userId=${foundUser._id}&token=${forgotToken}`;
    const BACK_APP_URL = UserHelper.getBackAppUrl();
    console.log(BACK_APP_URL);
    await UserHelper.updateUser({email: request.email}, {resetPasswordToken: forgotToken});
    const replacements = {
        link: `${FRONT_APP_URL}?userId=${foundUser._id}&token=${forgotToken}`,
        appName: process.env.APP_NAME,
        mailFrom: process.env.MAIL_FROM,
        assetsPath: `${BACK_APP_URL}/Assets`
    };
    await EmailHelper.sendForgotPasswordEmail(request.email, replacements);
    let response = ResponseHelper.setResponse(200, "email sent");
    return res.status(response.code).json(response);
};


//STRIPE FOR CREDIT CARD
exports.createCustomerForStripe = async (req, res) => {
    let request = req.body;
    let response;
    const user = await UserHelper.createCustomer(request);
    let creditCard = await UserHelper.addCreditCard(user, {
        number: '4242424242424242',
        exp_month: '11',
        exp_year: '22',
        cvc: '123',
    });
    const result = await UserHelper.processPayment(user, creditCard);
    // response = await ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status('200').json("Success");
}

exports.createOrder = async (req, res, next) => {
    const user = await User.findById({ _id: req.body._id });
    // let total = 0;
    // const userCart = null;
    // console.log('userrrrrrrrr',user)
    // user.firstName = req.body.firstName;
    // user.lastName = req.body.lastName;
    // user.shippingAddress = req.body.shippingAddress;
    // user.contactDetails = req.body.contactDetails;
    // user.city = req.body.city;
    // user.province = req.body.province;
    // await user.save();

    const order = new Order({
        _id:new mongoose.Types.ObjectId(),
        userId: user._id,
        status: "pending",
        orderDate:Date.now(),
        orderType:'Home Delivery',
        amount:'120'
        // total: req.body.total,
    });

    // console.log('orderrrrrrrrr',order)
    await order.save();

    // await user.clearCart();

    // // send email to user

    res.status(200).json({ message: "Your order has been placed",data:order });
};

exports.getOrders = async(req,res)=>{
    // const cat = request.name;
    let findOrders = await UserHelper.getOrder(req.body._id);
    if(findOrders===null){
        return res.status(400).json("No such user Order")
    }
    // console.log(findProducts);
    let response = ResponseHelper.setResponse(200,"Success",findOrders)
    // console.log(response);
    console.log(response.result);
    return res.status(200).json(response.result);
}