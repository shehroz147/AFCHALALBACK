const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String},
    category: {type: String},
    imageUrl: {type: String},
    price:{type:Number},
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);
