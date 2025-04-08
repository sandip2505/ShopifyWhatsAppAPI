const mongoose = require('mongoose');

const customerReview = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
    },
    storeName: {
        type: String,
    },
    rating: {
        type: Number,
        default: null
    },
    reviewText: {
        type: String,
    },
    recommend: {
        type: Boolean,
    },
    productId: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    },
});


const customerReviews = mongoose.model('customerreview', customerReview);

module.exports = customerReviews;