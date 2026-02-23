const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: [true, 'Banner image is required']
  },
  link: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: 'Shop Now'
  },
  position: {
    type: String,
    enum: ['home', 'category', 'product', 'promo'],
    default: 'home'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
