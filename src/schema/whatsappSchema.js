// const mongoose = require('mongoose');

// const whatsappSchema = new mongoose.Schema({
//   mobile_number: {
//     type: String,
//     unique: true
//   },
//   position: {
//     type: String,
//   },
//   prefield_message: {
//     type: String,
//   },
//   icon: {
//     type: String,
//   },
//   popup_message: {
//     type: String,
//   },
//   shopName: {
//     type: String,
//   },
//   status: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   },
//   deletedAt: {
//     type: Date,
//     default: null
//   },
// });



// const WhatsApp = mongoose.model('whatsapp', whatsappSchema);

// module.exports = WhatsApp;


const mongoose = require('mongoose');

const whatsappSchema = new mongoose.Schema({
  mobile_number: {
    type: String,
    unique: true,
    required: [true, 'Mobile number is required'],
    match: [/^\+\d{1,3}\d{9,15}$/, 'Please provide a valid mobile number with country code']
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
