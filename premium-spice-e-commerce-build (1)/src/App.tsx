import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { LoginPage, RegisterPage } from '@/pages/AuthPages';
import { 
  AccountLayout, ProfilePage, OrdersPage, OrderDetailPage, 
  WishlistPage, AddressesPage, NotificationsPage, SettingsPage 
} from '@/pages/AccountPages';
import { 
  AdminLayout, AdminDashboard, AdminProductsPage, AdminOrdersPage,
  AdminUsersPage, AdminCouponsPage, AdminBannersPage, AdminReviewsPage
} from '@/pages/AdminPages';

// About Page
function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
          <p className="text-xl text-amber-200">Bringing authentic spices from farm to your kitchen</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg prose-amber mx-auto">
          <p className="text-gray-600 leading-relaxed mb-6">
            At Homelike, we believe that great food starts with great ingredients. Founded with a passion 
            for authentic flavors and traditional recipes, we source the finest spices directly from 
            farmers across India and around the world.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our journey began in a small kitchen, where we discovered that the secret to unforgettable 
            dishes lies in the quality and freshness of spices. This realization led us to build direct 
            relationships with farmers who share our commitment to purity and sustainability.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Promise</h2>
          <ul className="space-y-4 text-gray-600">
            <li><strong>100% Authentic:</strong> Every spice is sourced from its traditional origin</li>
            <li><strong>No Additives:</strong> Pure spices with no fillers or artificial colors</li>
            <li><strong>Freshly Ground:</strong> Small batch production for maximum freshness</li>
            <li><strong>Sustainably Sourced:</strong> Supporting farmers and their communities</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Quality Assurance</h2>
          <p className="text-gray-600 leading-relaxed">
            Every batch of spices undergoes rigorous quality testing to ensure they meet our high 
            standards. We test for purity, potency, and freshness before packaging. Our state-of-the-art 
            facility maintains strict hygiene standards to deliver the safest products to your kitchen.
          </p>
        </div>
      </div>
    </div>
  );
}

// Contact Page
function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-amber-200">We'd love to hear from you</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Spice Market Road<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@homelike.com</p>
                <p className="text-gray-600">sales@homelike.com</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Fri 9am-6pm EST</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<Layout><HomePage /></Layout>} path="/" />
        <Route element={<Layout><ProductsPage /></Layout>} path="/products" />
        <Route element={<Layout><ProductDetailPage /></Layout>} path="/products/:slug" />
        <Route element={<Layout><CartPage /></Layout>} path="/cart" />
        <Route element={<Layout><CheckoutPage /></Layout>} path="/checkout" />
        <Route element={<Layout><AboutPage /></Layout>} path="/about" />
        <Route element={<Layout><ContactPage /></Layout>} path="/contact" />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Account Routes */}
        <Route path="/account" element={<Layout><AccountLayout /></Layout>}>
          <Route index element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
