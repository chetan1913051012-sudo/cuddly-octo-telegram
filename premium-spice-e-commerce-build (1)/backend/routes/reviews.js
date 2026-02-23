const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// @route   GET /api/reviews/product/:productId
// @desc    Get product reviews
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const product = await Product.findById(req.params.productId)
      .select('reviews');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviews = product.reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      reviews,
      total: product.reviews.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/reviews
// @desc    Add review to product
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if user purchased the product
    const order = await Order.findOne({
      user: req.user.id,
      'orderItems.product': productId,
      orderStatus: { $in: ['delivered', 'shipped', 'out_for_delivery'] }
    });

    // For demo purposes, allow review without purchase
    // In production, uncomment the following:
    // if (!order) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'You can only review products you have purchased'
    //   });
    // }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Add review
    product.reviews.push({
      user: req.user.id,
      name: req.user.name,
      rating,
      comment
    });

    // Calculate new average rating
    const totalRatings = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.ratings = Math.round((totalRatings / product.reviews.length) * 10) / 10;
    product.numReviews = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/reviews/:productId/:reviewId
// @desc    Delete review
// @access  Private
router.delete('/:productId/:reviewId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviewIndex = product.reviews.findIndex(
      review => review._id.toString() === req.params.reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (product.reviews[reviewIndex].user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    product.reviews.splice(reviewIndex, 1);

    // Recalculate rating
    if (product.reviews.length > 0) {
      const totalRatings = product.reviews.reduce((acc, review) => acc + review.rating, 0);
      product.ratings = Math.round((totalRatings / product.reviews.length) * 10) / 10;
    } else {
      product.ratings = 0;
    }
    product.numReviews = product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
