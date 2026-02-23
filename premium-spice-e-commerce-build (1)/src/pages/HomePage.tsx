import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Award, RefreshCw, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useProductStore, useBannerStore } from '@/store';
import { categories } from '@/data/products';
import { useState, useEffect } from 'react';

export function HomePage() {
  const { products } = useProductStore();
  const { banners } = useBannerStore();
  const [currentBanner, setCurrentBanner] = useState(0);

  const activeBanners = banners.filter(b => b.isActive);
  const featuredProducts = products.filter(p => p.isActive).slice(0, 8);
  const bestSellers = products.filter(p => p.isActive && p.reviewCount > 200).slice(0, 4);
  const onSale = products.filter(p => p.isActive && p.salePrice).slice(0, 4);

  useEffect(() => {
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeBanners.length]);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fadeInUp">
                    {banner.title}
                  </h1>
                  <p className="text-xl text-white/90 mb-8 animate-fadeInUp animation-delay-200">
                    {banner.subtitle}
                  </p>
                  <Link
                    to={banner.link}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition-all hover:gap-4 animate-fadeInUp animation-delay-400"
                  >
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Banner Navigation */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentBanner ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Features */}
      <section className="py-12 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Shield, title: '100% Authentic', desc: 'Pure & natural spices' },
              { icon: Award, title: 'Premium Quality', desc: 'Hand-selected ingredients' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon className="w-7 h-7 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of authentic spices, carefully sourced from the finest farms around the world.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group relative aspect-square rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <h3 className="text-white font-semibold text-center text-lg">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Our most popular spices loved by home chefs</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-amber-700 font-semibold hover:gap-4 transition-all"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-amber-700 font-semibold"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Banner */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-300 font-medium mb-2 block">Our Best Sellers</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Taste the Difference of Authentic Spices
              </h2>
              <p className="text-amber-100 mb-8 text-lg">
                Our best-selling spices are carefully selected for their exceptional quality, 
                rich aroma, and authentic taste. Each spice is sourced directly from farmers 
                who share our commitment to purity and excellence.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-amber-200">4.9 Average Rating</span>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-800 rounded-full font-semibold hover:bg-amber-100 transition-colors"
              >
                Explore Best Sellers
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {bestSellers.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group bg-white/10 backdrop-blur rounded-2xl p-4 hover:bg-white/20 transition-colors"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-medium text-white line-clamp-1">{product.name}</h4>
                  <p className="text-amber-300 font-semibold">
                    ${(product.salePrice || product.price).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Special Offers</h2>
                <p className="text-gray-600">Limited time deals on premium spices</p>
              </div>
              <Link
                to="/products?sale=true"
                className="hidden md:flex items-center gap-2 text-amber-700 font-semibold hover:gap-4 transition-all"
              >
                View All Offers
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {onSale.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Our Spice Community
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to receive exclusive offers, recipes, and tips on using our spices. 
              Get 10% off your first order!
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real reviews from our happy customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                location: 'New York, NY',
                text: 'The quality of these spices is incredible! I can taste the difference in every dish I make. The turmeric is especially vibrant.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                location: 'San Francisco, CA',
                text: 'Finally found authentic spices that remind me of home cooking. The garam masala blend is perfect for my curries.',
                rating: 5
              },
              {
                name: 'Emily Davis',
                location: 'Austin, TX',
                text: 'Great packaging, fast shipping, and amazing quality. The saffron threads are the best I\'ve ever used.',
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
