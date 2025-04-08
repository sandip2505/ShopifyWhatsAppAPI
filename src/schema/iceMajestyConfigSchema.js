const mongoose = require("mongoose");

const iceMajestyConfig = new mongoose.Schema(
  {
    shop: {
      type: String,
      required: true,
    },
    animationType: {
      type: String,
      default: "snow",
    },
    customImage: {
      type: String,
    },
    imageSize: {
      type: Number,
      default: 40,
    },
    animationColor: {
      type: String,
      default: "#ffffff",
    },
    animationSpeed: {
      type: Number,
      default: 10,
    },
    numberOfEffects: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

const IceMajestyConfig = mongoose.model("IceMajestyConfig", iceMajestyConfig);

module.exports = IceMajestyConfig;
