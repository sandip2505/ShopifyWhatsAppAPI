const mongoose = require("mongoose");

const upsellSchema = mongoose.Schema({
  shop_name: {
    type: String,
    required: true,
    unique: true,
  },
  upsellLocation: {
    type: String,
  },
  customSelector: {
    type: String,
  },
  products: {
    type: [String],
    required: true
  },
  upsellLimit: {
    type: Number,
    default: 5,
  },
  autoRecommendUpsell: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "Recommend Products",
  },
  buttonLabel: {
    type: String,
  },
});

const upsell = mongoose.model("upsell", upsellSchema);
module.exports = upsell;
