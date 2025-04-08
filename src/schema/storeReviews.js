const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    reviewTitle: {
        type: String,
        required: true,
        trim: true
    },
    storeName:{
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewMessage: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },
    reviewImages: [{
        type: String,
        required: false
    }]
}, { timestamps: true });

const StoreReview = mongoose.model('StoreReview', reviewSchema);

module.exports = StoreReview;
