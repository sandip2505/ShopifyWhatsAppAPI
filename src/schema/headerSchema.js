// const mongoose = require('mongoose');

// const headerSchema = new mongoose.Schema({
//   title: { 
//     type: String,
//   },
//   header: {
//     type: String,
//   },
//   body: {
//     type: String,
//   },
//   storename: {
//     type: String,
//     default: null
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

// const Header = mongoose.model('header', headerSchema);

// module.exports = Header;

const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Title is required']
  },
  header: {
    type: String,
    trim: true,
  },
  body: {
    type: String,
    trim: true,
  },
  storename: {
    type: String,
    trim: true,
    default: null
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
headerSchema.index({ storename: 1, deletedAt: 1 });

// Example instance method
headerSchema.methods.isActive = function () {
  return !this.deletedAt;
};

// Example virtual field
headerSchema.virtual('isDeleted').get(function () {
  return this.deletedAt !== null;
});

const Header = mongoose.model('Header', headerSchema);

module.exports = Header;

