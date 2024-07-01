
const mongoose = require('mongoose');

const whatsappSchema = new mongoose.Schema({
  country_code: {
    type: String,
    trim: true
  },
  mobile_number: {
    type: String,
  },
  position: {
    type: String,
    trim: true
  },
  prefield_message: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  popup_message: {
    type: String,
    trim: true
  },
  shopName: {
    type: String,
    trim: true
  },
  status: {
    type: Boolean,
    default: true,
    enum: [true, false]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

// Remove any existing index on mobile_number
whatsappSchema.index({ mobile_number: 1 }, { unique: false });

const WhatsApp = mongoose.model('WhatsApp', whatsappSchema);

module.exports = WhatsApp;
