
const mongoose = require('mongoose');
const storeReviewSettingSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: 'customer reviews'
    },
    totalReviewsBased: {
        type: String,
        default: 'Average 0 Based on 0 Rating Verified Reviews'
    },
    showRecentReviews: {
        type: Boolean,
        default: true
    },
    buttonText: {
        type: String,
        default: 'Write a Review'
    },
    showReviewDates: {
        type: Boolean,
        default: true
    },
    showReviewImage: {
        type: Boolean,
        default: true
    },
    showReviewEmail: {
        type: Boolean,
        default: true
    },
    primaryColor: {
        type: String,
        default: '#000000'
    },
    writeButtonTextColor: {
        type: String,
        default: '#ffffff'
    },
    starColor: {
        type: String,
        default: '#f59e0b'
    },
    textColor: {
        type: String,
        default: '#1F2937'
    },
    dateColor: {
        type: String,
        default: '#1F2937'
    },
    titleColor: {
        type: String,
        default: '#1F2937'
    },
    backgroundColor: {
        type: String,
        default: '#ffffff'
    },
    titleFontSize: {
        type: String,
        default: '16px'
    },
    subTitleFontSize: {
        type: String,
        default: '15px'
    },
    reviewNameFontSize: {
        type: String,
        default: '15px'
    },
    reviewTitleFontSize: {
        type: String,
        default: '15px'
    },
    reviewMessageFontSize: {
        type: String,
        default: '12px'
    },
    starSize: {
        type: String,
        default: '20px'
    },
    starSpacing: {
        type: String,
        default: '2px'
    }
}, { timestamps: true });

const StoreReviewSetting = mongoose.model('StoreReviewSetting', storeReviewSettingSchema);
module.exports = StoreReviewSetting;