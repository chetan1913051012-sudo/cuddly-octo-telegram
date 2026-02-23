import { Product, Banner, Coupon } from '@/types';

export const categories = [
  'Whole Spices',
  'Ground Spices',
  'Spice Blends',
  'Herbs',
  'Seasonings',
  'Gift Sets'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Kashmiri Red Chilli Powder',
    slug: 'kashmiri-red-chilli-powder',
    description: 'Our Premium Kashmiri Red Chilli Powder is sourced directly from the valleys of Kashmir, known for its vibrant red color and mild heat. This authentic spice adds a beautiful hue to your dishes without overpowering them with spiciness. Perfect for tandoori dishes, curries, and marinades. Each batch is carefully selected, sun-dried, and ground to preserve its natural oils and aroma.',
    shortDescription: 'Vibrant red color with mild heat, perfect for authentic Indian cuisine.',
    price: 12.99,
    salePrice: 9.99,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600',
      'https://images.unsplash.com/photo-1599909533986-5f7df66040c5?w=600'
    ],
    category: 'Ground Spices',
    tags: ['chilli', 'kashmiri', 'powder', 'mild'],
    stock: 150,
    isActive: true,
    rating: 4.8,
    reviewCount: 234,
    weight: '200g',
    origin: 'Kashmir, India',
    features: ['100% Natural', 'No Preservatives', 'Rich Color', 'Mild Heat'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Organic Turmeric Powder',
    slug: 'organic-turmeric-powder',
    description: 'Experience the golden goodness of our Organic Turmeric Powder, sourced from certified organic farms in South India. Known for its high curcumin content, this turmeric offers exceptional health benefits along with its earthy flavor and vibrant color. Use it in curries, golden milk, smoothies, and more.',
    shortDescription: 'High-curcumin organic turmeric for health and flavor.',
    price: 14.99,
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600',
      'https://images.unsplash.com/photo-1607672632458-9eb56c4fe673?w=600'
    ],
    category: 'Ground Spices',
    tags: ['turmeric', 'organic', 'golden', 'healthy'],
    stock: 200,
    isActive: true,
    rating: 4.9,
    reviewCount: 456,
    weight: '250g',
    origin: 'Kerala, India',
    features: ['Certified Organic', 'High Curcumin', 'Anti-inflammatory', 'Pure & Natural'],
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Whole Black Cardamom',
    slug: 'whole-black-cardamom',
    description: 'Our Whole Black Cardamom pods are hand-selected from the forests of Sikkim. With their distinctive smoky aroma and complex flavor, these pods are essential for biryanis, meat dishes, and garam masala. Each pod is carefully dried to preserve its essential oils.',
    shortDescription: 'Smoky, aromatic cardamom pods for rich, complex flavors.',
    price: 18.99,
    images: [
      'https://images.unsplash.com/photo-1596040033189-d658c6e0c4b6?w=600'
    ],
    category: 'Whole Spices',
    tags: ['cardamom', 'black', 'whole', 'aromatic'],
    stock: 80,
    isActive: true,
    rating: 4.7,
    reviewCount: 123,
    weight: '100g',
    origin: 'Sikkim, India',
    features: ['Hand-selected', 'Smoky Flavor', 'Essential Oils Preserved', 'Premium Grade'],
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'Garam Masala Blend',
    slug: 'garam-masala-blend',
    description: 'Our signature Garam Masala is a perfect blend of 12 aromatic spices, roasted and ground to perfection. This warming spice blend includes cinnamon, cardamom, cloves, cumin, coriander, and more. Add it to curries, dals, and vegetables for an authentic Indian taste.',
    shortDescription: 'Traditional 12-spice blend for authentic Indian cooking.',
    price: 11.99,
    images: [
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600'
    ],
    category: 'Spice Blends',
    tags: ['garam masala', 'blend', 'indian', 'aromatic'],
    stock: 180,
    isActive: true,
    rating: 4.9,
    reviewCount: 567,
    weight: '150g',
    origin: 'Homelike Kitchen',
    features: ['12 Spice Blend', 'Small Batch', 'No Fillers', 'Aromatic'],
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    name: 'Ceylon Cinnamon Sticks',
    slug: 'ceylon-cinnamon-sticks',
    description: 'True Ceylon Cinnamon, the "real cinnamon" from Sri Lanka. These delicate, multi-layered sticks have a subtle, sweet flavor distinct from common cassia. Perfect for desserts, chai, mulled wine, and savory dishes. Lower in coumarin, making it a healthier choice.',
    shortDescription: 'Authentic Ceylon cinnamon with subtle sweetness.',
    price: 15.99,
    salePrice: 13.99,
    images: [
      'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=600'
    ],
    category: 'Whole Spices',
    tags: ['cinnamon', 'ceylon', 'sweet', 'premium'],
    stock: 120,
    isActive: true,
    rating: 4.8,
    reviewCount: 289,
    weight: '100g',
    origin: 'Sri Lanka',
    features: ['True Ceylon', 'Low Coumarin', 'Multi-layered', 'Sweet Aroma'],
    createdAt: '2024-01-12'
  },
  {
    id: '6',
    name: 'Saffron Threads (Premium)',
    slug: 'premium-saffron-threads',
    description: 'The world\'s most precious spice, our Premium Saffron is sourced from the pristine fields of Kashmir. Each thread is hand-picked at dawn and carefully dried. Known as "red gold," these threads impart a luxurious color, flavor, and aroma to biryanis, desserts, and risottos.',
    shortDescription: 'Hand-picked Kashmiri saffron, the world\'s finest.',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1588892943921-f23b22a5a89e?w=600'
    ],
    category: 'Whole Spices',
    tags: ['saffron', 'premium', 'kashmir', 'luxury'],
    stock: 30,
    isActive: true,
    rating: 5.0,
    reviewCount: 178,
    weight: '2g',
    origin: 'Kashmir, India',
    features: ['Hand-picked', 'Highest Grade', 'Intense Aroma', 'Lab Tested'],
    createdAt: '2024-01-05'
  },
  {
    id: '7',
    name: 'Cumin Seeds (Whole)',
    slug: 'whole-cumin-seeds',
    description: 'Our premium Cumin Seeds are sourced from Rajasthan, known for producing the most aromatic cumin in the world. These seeds have a warm, earthy flavor essential to Indian, Mexican, and Middle Eastern cuisines. Perfect for tempering, roasting, or grinding fresh.',
    shortDescription: 'Aromatic Rajasthani cumin seeds for authentic flavor.',
    price: 8.99,
    images: [
      'https://images.unsplash.com/photo-1599909533986-5f7df66040c5?w=600'
    ],
    category: 'Whole Spices',
    tags: ['cumin', 'seeds', 'whole', 'essential'],
    stock: 250,
    isActive: true,
    rating: 4.7,
    reviewCount: 345,
    weight: '200g',
    origin: 'Rajasthan, India',
    features: ['High Oil Content', 'Strong Aroma', 'Versatile', 'Fresh Harvest'],
    createdAt: '2024-01-18'
  },
  {
    id: '8',
    name: 'Tandoori Masala',
    slug: 'tandoori-masala',
    description: 'Create restaurant-quality tandoori dishes at home with our authentic Tandoori Masala. This vibrant blend combines Kashmiri chillies, cumin, coriander, garlic, ginger, and other spices for that perfect smoky, tangy flavor. Ideal for marinades, grilling, and roasting.',
    shortDescription: 'Authentic blend for perfect tandoori dishes.',
    price: 10.99,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'
    ],
    category: 'Spice Blends',
    tags: ['tandoori', 'masala', 'blend', 'bbq'],
    stock: 160,
    isActive: true,
    rating: 4.8,
    reviewCount: 234,
    weight: '150g',
    origin: 'Homelike Kitchen',
    features: ['Restaurant Quality', 'Natural Color', 'Perfect Balance', 'Versatile'],
    createdAt: '2024-01-22'
  },
  {
    id: '9',
    name: 'Dried Rosemary',
    slug: 'dried-rosemary',
    description: 'Our premium Dried Rosemary is sourced from Mediterranean farms, where the herb grows wild in the sunny climate. With its pine-like aroma and slightly minty flavor, it\'s perfect for roasted meats, potatoes, bread, and Mediterranean dishes.',
    shortDescription: 'Mediterranean rosemary with pine-like aroma.',
    price: 7.99,
    images: [
      'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600'
    ],
    category: 'Herbs',
    tags: ['rosemary', 'herb', 'mediterranean', 'aromatic'],
    stock: 140,
    isActive: true,
    rating: 4.6,
    reviewCount: 156,
    weight: '50g',
    origin: 'Mediterranean',
    features: ['Sun-dried', 'Aromatic', 'Whole Leaves', 'Versatile'],
    createdAt: '2024-01-25'
  },
  {
    id: '10',
    name: 'Black Pepper (Tellicherry)',
    slug: 'tellicherry-black-pepper',
    description: 'Tellicherry Black Pepper, the king of peppers, is grown on the Malabar Coast of India. These large, fully mature peppercorns have a complex, bold flavor with citrus and pine notes. A must-have for any serious cook seeking the finest pepper available.',
    shortDescription: 'Premium Tellicherry peppercorns with bold, complex flavor.',
    price: 16.99,
    images: [
      'https://images.unsplash.com/photo-1599909533986-5f7df66040c5?w=600'
    ],
    category: 'Whole Spices',
    tags: ['pepper', 'black', 'tellicherry', 'premium'],
    stock: 100,
    isActive: true,
    rating: 4.9,
    reviewCount: 412,
    weight: '150g',
    origin: 'Malabar, India',
    features: ['Large Grade', 'Bold Flavor', 'Citrus Notes', 'Premium Quality'],
    createdAt: '2024-01-14'
  },
  {
    id: '11',
    name: 'Biryani Masala',
    slug: 'biryani-masala',
    description: 'Our signature Biryani Masala is crafted to perfection with a blend of over 15 spices including mace, nutmeg, star anise, and dried rose petals. This aromatic blend will transform your rice into a fragrant, flavorful biryani that rivals the best restaurants.',
    shortDescription: 'Aromatic 15-spice blend for perfect biryani.',
    price: 13.99,
    images: [
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600'
    ],
    category: 'Spice Blends',
    tags: ['biryani', 'masala', 'blend', 'aromatic'],
    stock: 140,
    isActive: true,
    rating: 4.9,
    reviewCount: 523,
    weight: '150g',
    origin: 'Homelike Kitchen',
    features: ['15+ Spices', 'Rose Petals', 'Authentic Recipe', 'Restaurant Quality'],
    createdAt: '2024-01-16'
  },
  {
    id: '12',
    name: 'Spice Gift Set - Classic Collection',
    slug: 'classic-spice-gift-set',
    description: 'The perfect gift for food lovers! Our Classic Collection includes 6 of our bestselling spices in beautiful glass jars: Garam Masala, Turmeric, Cumin, Coriander, Red Chilli, and our signature Biryani Masala. Elegantly packaged in a handcrafted wooden box.',
    shortDescription: '6 bestselling spices in an elegant wooden gift box.',
    price: 59.99,
    salePrice: 49.99,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'
    ],
    category: 'Gift Sets',
    tags: ['gift', 'set', 'collection', 'premium'],
    stock: 50,
    isActive: true,
    rating: 5.0,
    reviewCount: 189,
    weight: '600g',
    origin: 'Homelike Kitchen',
    features: ['6 Premium Spices', 'Glass Jars', 'Wooden Box', 'Perfect Gift'],
    createdAt: '2024-01-02'
  }
];

export const banners: Banner[] = [
  {
    id: '1',
    title: 'Pure & Authentic Spices',
    subtitle: 'From Farm to Your Kitchen',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200',
    link: '/products',
    isActive: true,
    order: 1
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Discover Our Premium Saffron Collection',
    image: 'https://images.unsplash.com/photo-1588892943921-f23b22a5a89e?w=1200',
    link: '/products/premium-saffron-threads',
    isActive: true,
    order: 2
  },
  {
    id: '3',
    title: 'Gift Sets Available',
    subtitle: 'Perfect for Spice Lovers',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=1200',
    link: '/products?category=Gift%20Sets',
    isActive: true,
    order: 3
  }
];

export const coupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 25,
    maxDiscount: 15,
    usageLimit: 1000,
    usedCount: 234,
    expiresAt: '2025-12-31',
    isActive: true
  },
  {
    id: '2',
    code: 'SPICE20',
    type: 'percentage',
    value: 20,
    minOrder: 50,
    maxDiscount: 30,
    usageLimit: 500,
    usedCount: 89,
    expiresAt: '2025-06-30',
    isActive: true
  },
  {
    id: '3',
    code: 'FLAT5',
    type: 'fixed',
    value: 5,
    minOrder: 30,
    usageLimit: 2000,
    usedCount: 456,
    expiresAt: '2025-12-31',
    isActive: true
  }
];
