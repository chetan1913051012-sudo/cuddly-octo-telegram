require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const Coupon = require('./models/Coupon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homelike';

const categories = [
  { name: 'Whole Spices', icon: '🌶️', order: 1 },
  { name: 'Ground Spices', icon: '🧂', order: 2 },
  { name: 'Spice Blends', icon: '🫙', order: 3 },
  { name: 'Herbs', icon: '🌿', order: 4 },
  { name: 'Seasonings', icon: '🧄', order: 5 },
  { name: 'Gift Sets', icon: '🎁', order: 6 }
];

const products = [
  {
    name: 'Premium Kashmiri Red Chilli Powder',
    description: 'Our Premium Kashmiri Red Chilli Powder is sourced directly from the valleys of Kashmir, known for its vibrant red color and mild heat.',
    price: 9.99,
    originalPrice: 12.99,
    categoryIndex: 1,
    stock: 150,
    unit: '200g',
    origin: 'Kashmir, India',
    tags: ['chilli', 'kashmiri', 'powder', 'mild'],
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
    ratings: 4.8,
    numReviews: 234
  },
  {
    name: 'Organic Turmeric Powder',
    description: 'Experience the golden goodness of our Organic Turmeric Powder, sourced from certified organic farms in South India.',
    price: 14.99,
    originalPrice: 0,
    categoryIndex: 1,
    stock: 200,
    unit: '250g',
    origin: 'Kerala, India',
    tags: ['turmeric', 'organic', 'golden'],
    images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600'],
    ratings: 4.9,
    numReviews: 456
  },
  {
    name: 'Whole Black Cardamom',
    description: 'Our Whole Black Cardamom pods are hand-selected from the forests of Sikkim with their distinctive smoky aroma.',
    price: 18.99,
    originalPrice: 0,
    categoryIndex: 0,
    stock: 80,
    unit: '100g',
    origin: 'Sikkim, India',
    tags: ['cardamom', 'black', 'whole', 'aromatic'],
    images: ['https://images.unsplash.com/photo-1596040033189-d658c6e0c4b6?w=600'],
    ratings: 4.7,
    numReviews: 123
  },
  {
    name: 'Garam Masala Blend',
    description: 'Our signature Garam Masala is a perfect blend of 12 aromatic spices, roasted and ground to perfection.',
    price: 11.99,
    originalPrice: 0,
    categoryIndex: 2,
    stock: 180,
    unit: '150g',
    origin: 'Homelike Kitchen',
    tags: ['garam masala', 'blend', 'indian'],
    images: ['https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600'],
    ratings: 4.9,
    numReviews: 567
  },
  {
    name: 'Ceylon Cinnamon Sticks',
    description: 'True Ceylon Cinnamon, the "real cinnamon" from Sri Lanka with a subtle, sweet flavor.',
    price: 13.99,
    originalPrice: 15.99,
    categoryIndex: 0,
    stock: 120,
    unit: '100g',
    origin: 'Sri Lanka',
    tags: ['cinnamon', 'ceylon', 'sweet'],
    images: ['https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=600'],
    ratings: 4.8,
    numReviews: 289
  },
  {
    name: 'Premium Saffron Threads',
    description: 'The world\'s most precious spice, our Premium Saffron is sourced from the pristine fields of Kashmir.',
    price: 49.99,
    originalPrice: 0,
    categoryIndex: 0,
    stock: 30,
    unit: '2g',
    origin: 'Kashmir, India',
    tags: ['saffron', 'premium', 'luxury'],
    images: ['https://images.unsplash.com/photo-1588892943921-f23b22a5a89e?w=600'],
    ratings: 5.0,
    numReviews: 178
  },
  {
    name: 'Cumin Seeds (Whole)',
    description: 'Our premium Cumin Seeds are sourced from Rajasthan, known for producing the most aromatic cumin.',
    price: 8.99,
    originalPrice: 0,
    categoryIndex: 0,
    stock: 250,
    unit: '200g',
    origin: 'Rajasthan, India',
    tags: ['cumin', 'seeds', 'whole'],
    images: ['https://images.unsplash.com/photo-1599909533986-5f7df66040c5?w=600'],
    ratings: 4.7,
    numReviews: 345
  },
  {
    name: 'Tandoori Masala',
    description: 'Create restaurant-quality tandoori dishes at home with our authentic Tandoori Masala blend.',
    price: 10.99,
    originalPrice: 0,
    categoryIndex: 2,
    stock: 160,
    unit: '150g',
    origin: 'Homelike Kitchen',
    tags: ['tandoori', 'masala', 'bbq'],
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
    ratings: 4.8,
    numReviews: 234
  },
  {
    name: 'Dried Rosemary',
    description: 'Our premium Dried Rosemary is sourced from Mediterranean farms with a pine-like aroma.',
    price: 7.99,
    originalPrice: 0,
    categoryIndex: 3,
    stock: 140,
    unit: '50g',
    origin: 'Mediterranean',
    tags: ['rosemary', 'herb', 'mediterranean'],
    images: ['https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600'],
    ratings: 4.6,
    numReviews: 156
  },
  {
    name: 'Black Pepper (Tellicherry)',
    description: 'Tellicherry Black Pepper, the king of peppers, grown on the Malabar Coast of India.',
    price: 16.99,
    originalPrice: 0,
    categoryIndex: 0,
    stock: 100,
    unit: '150g',
    origin: 'Malabar, India',
    tags: ['pepper', 'black', 'tellicherry'],
    images: ['https://images.unsplash.com/photo-1599909533986-5f7df66040c5?w=600'],
    ratings: 4.9,
    numReviews: 412
  },
  {
    name: 'Biryani Masala',
    description: 'Our signature Biryani Masala is crafted with over 15 spices including mace, nutmeg, and rose petals.',
    price: 13.99,
    originalPrice: 0,
    categoryIndex: 2,
    stock: 140,
    unit: '150g',
    origin: 'Homelike Kitchen',
    tags: ['biryani', 'masala', 'aromatic'],
    images: ['https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600'],
    ratings: 4.9,
    numReviews: 523
  },
  {
    name: 'Spice Gift Set - Classic Collection',
    description: 'The perfect gift for food lovers! Includes 6 bestselling spices in beautiful glass jars.',
    price: 49.99,
    originalPrice: 59.99,
    categoryIndex: 5,
    stock: 50,
    unit: '600g',
    origin: 'Homelike Kitchen',
    tags: ['gift', 'set', 'collection'],
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
    ratings: 5.0,
    numReviews: 189,
    isFeatured: true
  }
];

const banners = [
  {
    title: 'Pure & Authentic Spices',
    subtitle: 'From Farm to Your Kitchen',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200',
    link: '/products',
    order: 1,
    isActive: true
  },
  {
    title: 'New Arrivals',
    subtitle: 'Discover Our Premium Saffron Collection',
    image: 'https://images.unsplash.com/photo-1588892943921-f23b22a5a89e?w=1200',
    link: '/products',
    order: 2,
    isActive: true
  },
  {
    title: 'Gift Sets Available',
    subtitle: 'Perfect for Spice Lovers',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=1200',
    link: '/products',
    order: 3,
    isActive: true
  }
];

const coupons = [
  {
    code: 'WELCOME10',
    description: 'Welcome discount for new users',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 25,
    maxDiscount: 15,
    usageLimit: 1000,
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'SPICE20',
    description: 'Special discount on spices',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 50,
    maxDiscount: 30,
    usageLimit: 500,
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'FLAT5',
    description: '$5 flat discount',
    discountType: 'fixed',
    discountValue: 5,
    minPurchase: 30,
    usageLimit: 2000,
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Coupon.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@homelike.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin'
    });
    console.log('✅ Created admin user');

    // Create test user
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1987654321',
      role: 'user'
    });
    console.log('✅ Created test user');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Created categories');

    // Create products
    const productsToCreate = products.map(p => ({
      ...p,
      category: createdCategories[p.categoryIndex]._id,
      isActive: true,
      isFeatured: p.isFeatured || false
    }));
    delete productsToCreate.forEach(p => p.categoryIndex);
    await Product.insertMany(productsToCreate);
    console.log('✅ Created products');

    // Create banners
    await Banner.insertMany(banners.map(b => ({
      ...b,
      createdBy: admin._id
    })));
    console.log('✅ Created banners');

    // Create coupons
    await Coupon.insertMany(coupons.map(c => ({
      ...c,
      createdBy: admin._id
    })));
    console.log('✅ Created coupons');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin: admin@homelike.com / admin123');
    console.log('  User:  john@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
