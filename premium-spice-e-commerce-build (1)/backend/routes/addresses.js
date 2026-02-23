const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { protect } = require('../middleware/auth');

// @route   GET /api/addresses
// @desc    Get user's addresses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id })
      .sort('-isDefault');
    
    res.json({
      success: true,
      addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/addresses
// @desc    Add new address
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      pincode,
      phone,
      alternatePhone,
      addressType,
      isDefault
    } = req.body;

    // If this is default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    const addressData = {
      user: req.user.id,
      name,
      address,
      city,
      state,
      pincode,
      phone,
      alternatePhone: alternatePhone || '',
      addressType: addressType || 'home',
      isDefault: isDefault || false
    };

    // If first address, make it default
    const existingAddresses = await Address.countDocuments({ user: req.user.id });
    if (existingAddresses === 0) {
      addressData.isDefault = true;
    }

    const newAddress = await Address.create(addressData);

    res.status(201).json({
      success: true,
      address: newAddress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/addresses/:id
// @desc    Update address
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const {
      name,
      address: addressLine,
      city,
      state,
      pincode,
      phone,
      alternatePhone,
      addressType,
      isDefault
    } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: address._id } },
        { isDefault: false }
      );
    }

    if (name) address.name = name;
    if (addressLine) address.address = addressLine;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (phone) address.phone = phone;
    if (alternatePhone !== undefined) address.alternatePhone = alternatePhone;
    if (addressType) address.addressType = addressType;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.json({
      success: true,
      address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    await address.deleteOne();

    // If deleted address was default, make another one default
    if (address.isDefault) {
      const nextAddress = await Address.findOne({ user: req.user.id });
      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
