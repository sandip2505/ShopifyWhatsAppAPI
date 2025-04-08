const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema({
    stockStatus: {
        type: Boolean,
        default: true,
    },
    locationName: {
        type: Boolean,
        default: true,
    },
    locationAddress: {
        type: Boolean,
        default: false,
    },
    availableQuantity: {
        type: Boolean,
        default: false,
    },
    shopName: {
        type: String,
        required: true,
        unique: true
    },
    headerText: {
        type: String,
        default: "Store Availability",
    },
    popupbtnText: {
        type: String,
        default: "Check Store Availability",
    },
    inStockText: {
        type: String,
        default: "In Stock",
    },
    lowStockText: {
        type: String,
        default: "Low Stock",
    },
    outOfStockText: {
        type: String,
        default: "Out of Stock",
    },
    availableText: {
        type: String,
        default: "Available",
    },
    unavailableText: {
        type: String,
        default: "Unavailable",
    },
    locationText: {
        type: String,
        default: "Location Name",
    },
    addressText: {
        type: String,
        default: "Address",
    },
    quantityText: {
        type: String,
        default: "Available Quantity",
    },
    stockStatusText: {
        type: String,
        default: "Detailed",
    },
    inStockTextColor: {
        type: String,
        default: "#000000",
    },
    inStockDotColor: {
        type: String,
        default: "#28a745",
    },
    lowStockTextColor: {
        type: String,
        default: "#000000",
    },
    lowStockDotColor: {
        type: String,
        default: "#f39c12",
    },
    outOfStockTextColor: {
        type: String,
        default: "#000000",
    },
    outOfStockDotColor: {
        type: String,
        default: "#dc3545",
    },
    availableTextColor: {
        type: String,
        default: "#000000",
    },
    availableDotColor: {
        type: String,
        default: "#28a745",
    },
    unavailableTextColor: {
        type: String,
        default: "#000000",
    },
    unavailableDotColor: {
        type: String,
        default: "#dc3545",
    },
    locationNameTextColor: {
        type: String,
        default: "#000000",
    },
    addressTextColor: {
        type: String,
        default: "#000000",
    },
    quantityTextColor: {
        type: String,
        default: "#000000",
    },
    popupbtnTextColor: {
        type: String,
        default: "#ffffff",
    },
    popupbtnBackgroundColor: {
        type: String,
        default: "#075efc",
    },
    stockStatusTextBold: {
        type: Boolean,
        default: false,
    },
    locationNameTextBold: {
        type: Boolean,
        default: false,
    },
    addressTextBold: {
        type: Boolean,
        default: false,
    },
    quantityTextBold: {
        type: Boolean,
        default: false,
    },
    stockStatusBold: {
        type: Boolean,
        default: false,
    },
    locationNameBold: {
        type: Boolean,
        default: false,
    },
    addressBold: {
        type: Boolean,
        default: false,
    },
    quantityBold: {
        type: Boolean,
        default: false,
    },

    created_at: {
        type: Date,
        default: Date.now()
    },
    deleted_at: {
        type: Date,
    }
});


const configuration = mongoose.model("configuration", configurationSchema);

module.exports = configuration;
