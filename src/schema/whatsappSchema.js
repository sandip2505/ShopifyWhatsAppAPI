
const mongoose = require('mongoose');

const whatsappSchema = new mongoose.Schema({
  country_code: {
    type: String,
    trim: true
  },
  mobile_number: {
    type: String,
    required: [true, 'Mobile number is required'],
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
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Adding indexes for better query performance
whatsappSchema.index({ mobile_number: 1, shopName: 1, deletedAt: 1 });

// Example instance method
whatsappSchema.methods.isActive = function () {
  return this.status && !this.deletedAt;
};

// Example virtual field
whatsappSchema.virtual('isDeleted').get(function () {
  return this.deletedAt !== null;
});

const WhatsApp = mongoose.model('WhatsApp', whatsappSchema);

module.exports = WhatsApp;
