
const mongoose = require('mongoose');

const whatsappSchema = new mongoose.Schema({
  country_code: {
    type: String,
    trim: true
  },
  mobile_number: {
    type: String,
    required: true,
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
  deletedAt: {
    type: Date,
    default: null
  }
});



const WhatsApp = mongoose.model('WhatsApp', whatsappSchema);

module.exports = WhatsApp;
