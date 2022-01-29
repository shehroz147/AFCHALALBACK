const moment = require("moment");
// Mongoose
const Product = require("../Model/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const env         = require('dotenv').config();

exports.addProduct = async(name,category,price,picture)=>{
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        title: name,
        price: price,
        category: category,
        imageUrl:picture
    });
    result = await product.save();
    return result;
}

exports.updatingProduct = async (product_, req, res) => {
    let result = "";

    const updateProduct = {
        title: req.body.title || product_.title,
        category: req.body.category || product_.category,
        image: req.body.Url || product_.imageUrl,
        price: req.body.price || product_.price,
        };

    await Product.updateOne({ _id: product_._id }, { $set: updateProduct })
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

exports.getProducts = async()=>{
        let result =[];
       result =  await Product.find();
            return result;
    }

    exports.getProductsCategory = async(filter)=>{
        let result =[];
       result =  await Product.find({category:filter});
            return result;
    }


exports.findProduct = async(product)=>{
   let data = [];
   data = await Product.findOne({_id:product},{
            title:1,
            category:1,
            imageUrl:1,
            price:1

   });
   return data;
}

exports.getProductName = async(_id)=>{
    let product="";
    product = await db.collection('user').find({_id:_id});
    return product.title;
}

exports.deleteProduct = async (id) => {
    // let updateInfo = {
    //     isDeleted: true,
    //     deletedAt: moment()
    // }
    await Product.deleteOne({ _id: id }).exec();
}