const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      notes
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Calculate prices
    let itemsPrice = 0;
    const orderItemsData = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product not available: ${product.name}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      itemsPrice += itemTotal;

      orderItemsData.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Apply coupon discount
    let discount = 0;
    let couponUsed = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true
      });

      if (coupon && coupon.isValid()) {
        // Check per-user usage
        const userUsage = await Order.countDocuments({
          user: req.user.id,
          couponUsed: coupon._id
        });

        if (userUsage < coupon.perUserLimit) {
          if (itemsPrice >= coupon.minPurchase) {
            if (coupon.discountType === 'percentage') {
              discount = (itemsPrice * coupon.discountValue) / 100;
              if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
              }
            } else {
              discount = coupon.discountValue;
            }
            couponUsed = coupon._id;
            coupon.usageCount += 1;
            await coupon.save();
          }
        }
      }
    }

    // Calculate totals
    const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping above 500
    const taxPrice = Math.round(itemsPrice * 0.05); // 5% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice - discount;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems: orderItemsData,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discount,
      totalPrice,
      couponUsed,
      notes
    });

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Order Placed Successfully',
      message: `Your order #${order.invoiceNumber} has been placed successfully.`,
      type: 'order',
      link: `/account/orders/${order._id}`
    });

    // Send notification to admins
    const admins = await require('../models/User').find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: 'New Order Received',
        message: `New order #${order.invoiceNumber} from ${req.user.name}`,
        type: 'order',
        link: `/admin/orders/${order._id}`,
        isAdmin: true
      });
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id,
      user: req.user.id
    }).populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['processing', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      date: Date.now(),
      note: 'Order cancelled by customer'
    });

    await order.save();

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Order Cancelled',
      message: `Your order #${order.invoiceNumber} has been cancelled.`,
      type: 'order'
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
