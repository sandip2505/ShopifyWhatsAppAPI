const mongoose = require('mongoose');

const ratingConfigSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        unique: true
    },
    titleText: {
        type: String,
        default: 'Customer Rating'
    },
    starColor: {
        type: String,
        default: '#ff9d2d'
    },
    emptyStarColor: {
        type: String,
        default: '#d1d5db'
    },
    titleColor: {
        type: String,
        default: '#2d3748'
    },
    countColor: {
        type: String,
        default: '#4a5568'
    },
    backgroundColor: {
        type: String,
        default: '#ffffff'
    },
    alignment: {
        type: String,
        enum: ['left', 'center', 'right'],
        default: 'center'
    },
    titleFontSize: {
        type: String,
        default: '15px'
    },
    starSize: {
        type: String,
        default: '20px'
    },
    countFontSize: {
        type: String,
        default: '14px'
    },
    gap: {
        type: String,
        default: '8px'
    },
    padding: {
        type: String,
        default: '12px'
    },
    titleWeight: {
        type: String,
        default: '600'
    },
    countWeight: {
        type: String,
        default: '500'
    }
});

const RatingConfig = mongoose.model('RatingConfig', ratingConfigSchema);

module.exports = RatingConfig;
