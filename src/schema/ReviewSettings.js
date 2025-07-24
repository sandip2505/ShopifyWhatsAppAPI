const mongoose = require("mongoose");

const reviewSettingsSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "Customer Reviews"
    },
    subtitle: {
        type: String,
        default: "See what our customers are saying about us"
    },
    mainTitle: {
        type: String,
        default: "What Our Customers Say"
    },
    mainSubtitle: {
        type: String,
        default: "Discover why our customers love our products and services"
    },
    primaryColor: {
        type: String,
        default: "#f59e0b"
    },
    textColor: {
        type: String,
        default: "#000000"
    },
    writeButtonText: {
        type: String,
        default: "#ffffff"
    },
    buttonBackground: {
        type: String,
        default: "#000000"
    },
    buttonText: {
        type: String,
        default: "Write a Review"
    },
    showOverallReviews: {
        type: Boolean,
        default: true
    },
    titleFontSize: {
        type: String,
        default: "18px"
    },
    subTitleFontSize: {
        type: String,
        default: "15px"
    },
    starSize: {
        type: String,
        default: "20px"
    },
    starSpacing: {
        type: String,
        default: "2px"
    },
    borderRadius: {
        type: Number,
        default: 8
    }
});

module.exports = mongoose.model("ReviewSettings", reviewSettingsSchema);
