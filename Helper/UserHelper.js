const moment = require("moment");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env  = require('dotenv').config();
const stripe = require('stripe')('sk_test_51KMEQEBX7khOp9gyHm1ddGwHHCrgw6t3ipaTGPsEMirqESa7rF8ZD971vqspGBFXSik34tpRkEHhrjrJWyTOZEIN00OaRaMpn7');
// Mongoose
const mongoose = require("mongoose");

const User = require("../Model/User");
const Order= require("../Model/Order");

exports.foundUserByEmail = async (email) => {
    return User.findOne({ email: email, isDeleted: false });
};
exports.bcryptPassword = async(password)=> {
    return bcrypt.hash(password, 10);
}
exports.findUserByUserName = async (userName) => {
    return await User.findOne({ userName: userName });
}
exports.updateUserCoins = async (findObj, setObj) => {
    return User.updateOne(findObj, { $set: { credits: setObj } });
}
exports.foundUserById = async (_id) => {
    return await User.findOne({ _id: _id });
}

exports.foundUserByToken = async (token) => {
    return await User.findOne({ forgotToken: token });
}

exports.updateToken = async (id, forgotToken) => {
    return User.updateOne({ _id: id }, { resetPasswordToken: forgotToken });
}

exports.updateTime = async (id, expiryTime) => {
    return User.updateOne({ _id: id }, { resetPasswordExpires: expiryTime });
}

exports.updateUser = async (findObj, setObj) => {
    return User.updateOne(findObj, { $set: setObj });
}

exports.updateUserAndToken = async (res, id, password) => {
    let result;
    return await User.updateOne({ _id: id }, { password: password, resetPasswordToken: null }).exec()
        .then(docs => {
            result = docs;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.createUser = async (email, password,role = 'user') => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: password,
        profileImage: "default.jpg",
        role: role
    });
    await user.save();
}


exports.tokenCreated = async (email) => {
    return jwt.sign({
        iss: 'Afc',
        sub: email,
        iat: new Date().getTime(), // current time
        exp: Math.floor(Date.now() / 1000) + (60 * 60)// 60 minutes
    }, process.env.JWT_SECRET);
}


exports.decodeToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return err;
    }
}

exports.createAdmin = async (email, password,role = 'admin',token) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: password,
        profileImage: "default.jpg",
        role: role,
        token:token
    });
    await user.save();
}


exports.addUserByAdmin = async (email, userName, fullName, about) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        userName: userName,
        fullName: fullName,
        about: about,
        password: '123456789',
        profileImage: "default.jpg",
        backgroundImage: "default.jpg"
    });
    await user.save();
}

exports.deleteUser = async (id) => {
    let updateInfo = {
        isDeleted: true,
        deletedAt: moment()
    }
    await User.updateOne({ _id: id }, { $set: updateInfo }).exec();
}


exports.findAllUsers = async () => {

    let listOfUsers = [];
    listOfUsers = await User.find({ isDeleted: false, role: 'user' }, {
        fullName: 1,
        userName: 1,
        email: 1,
        credits: 1,
        matches: 1,
        wins: 1,
        losses: 1,
        winPercentage: 1,
        about: 1,
        _id: 0
    });
    return listOfUsers;
}

exports.showMyProfile = async (email) => {
    let data = await User.findOne({ isDeleted: false, role: 'user' }, {
        userName: 1,
        credits: 1,
        matches: 1,
        wins: 1,
        losses: 1,
        winPercentage: 1,
        _id: 0,
    })
    return data;
}

exports.profile = async (id) => {
    let data = await User.findOne({ _id: id }, {
        _id: 1,
        userName: 1,
        credits: 1,
        matches: 1,
        wins: 1,
        losses: 1,
        winPercentage: 1,
    })
    return data;
}

exports.updatingUser = async (user_, request, res) => {

    let result = "";

    const updateUserInfo = {
        fullName: request.fullName || user_.fullName,
        userName: request.userName || user_.userName,
        email: request.email || user_.email,
        password: request.password || user_.password,
        profileImage: request.profileImage || user_.profileImage,
        backgroundImage: request.backgroundImage || user_.backgroundImage,
        credits: request.credits || user_.credits,
        matches: request.matches || user_.matches,
        wins: request.wins || user_.wins,
        losses: request.losses || user_.losses,
        winPercentage: request.winPercentage || user_.winPercentage,
    };

    await User.updateOne({ _id: request._id }, { $set: updateUserInfo })
        .exec()
        .then(docs => {
            result = docs;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    return result;
}

exports.addGamerTag = async (user, GamerTags, res) => {
    let result = "";
    await User.updateOne({ _id: user._id }, { $set: { gamerTag: GamerTags } })
        .exec()
        .then(docs => {
            result = docs;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

    return result;
}




exports.addFriend = async (user, friend, res) => {
    return User.updateOne(user, { $push: { friends: { friend } } });
}
exports.findFriend = async (userName, user) => {
    return await User.findOne({ _id: user._id }, { friends: { $elemMatch: { userName: userName } } });
};

exports.getFrontAppResetUrl=async() => {
    return process.env.MODE === "DEV" ? process.env.FRONT_APP_RESET_PASSWORD_URL_DEV : process.env.FRONT_APP_RESET_PASSWORD_URL_PRO;
}

exports.getBackAppUrl = async()=> {
    return process.env.MODE === "DEV" ? process.env.BACK_APP_URL_DEV : process.env.BACK_APP_URL_PRO;
}



exports.createPayment = async () => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost.4000/success",
            "cancel_url": "http://localhost.4000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Gem",
                    "sku": "001",
                    "price": "6.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "6.00"
            },
            "description": "This is the Basic credit Package"
        }]
    };

}

exports.createCustomer = async (request) => {
    const customer = await stripe.customers.create({
        // email: request.email,
        name:request.firstName
    });
    console.log(customer);
    return customer;
}

exports.addCreditCard = async (user, card) => {
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card,
    });
    console.log(paymentMethod);
    const attached = await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: user.id,
    });
    console.log(attached);
    return paymentMethod;
}
exports.processPayment = async (user, card) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1250,
        customer: user.id,
        currency: 'usd',
        payment_method: card.id,
    });
    console.log(paymentIntent);
    return paymentIntent;
};

exports.getOrder = async (id) => {
    return await Order.findOne({ id },{
        userId:1,
        status:1,
        orderDate:1,
        orderType:1,

    });
};