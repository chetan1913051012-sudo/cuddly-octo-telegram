const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `banner-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// @route   GET /api/banners
// @desc    Get active banners
// @access  Public
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).sort('order');

    res.json({
      success: true,
      banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/banners/admin
// @desc    Get all banners for admin
// @access  Private/Admin
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const banners = await Banner.find()
      .sort('-createdAt')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/banners
// @desc    Create banner
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      subtitle,
      link,
      linkText,
      position,
      order,
      isActive,
      startDate,
      endDate
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required'
      });
    }

    const banner = await Banner.create({
      title,
      subtitle: subtitle || '',
      image: `/uploads/${req.file.filename}`,
      link: link || '',
      linkText: linkText || 'Shop Now',
      position: position || 'home',
      order: order || 0,
      isActive: isActive !== 'false',
      startDate: startDate || new Date(),
      endDate: endDate || null,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/banners/:id
// @desc    Update banner
// @access  Private/Admin
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    const {
      title,
      subtitle,
      link,
      linkText,
      position,
      order,
      isActive,
      startDate,
      endDate
    } = req.body;

    if (title) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (link !== undefined) banner.link = link;
    if (linkText) banner.linkText = linkText;
    if (position) banner.position = position;
    if (order !== undefined) banner.order = order;
    if (isActive !== undefined) banner.isActive = isActive === 'true';
    if (startDate) banner.startDate = startDate;
    if (endDate !== undefined) banner.endDate = endDate;
    if (req.file) banner.image = `/uploads/${req.file.filename}`;

    await banner.save();

    res.json({
      success: true,
      banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/banners/:id
// @desc    Delete banner
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    await banner.deleteOne();

    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
