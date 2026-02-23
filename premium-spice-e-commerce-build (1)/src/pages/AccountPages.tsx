import { useState } from 'react';
import { Link, useParams, useLocation, NavLink, Outlet, Navigate } from 'react-router-dom';
import { 
  User, Package, Heart, MapPin, Bell, Settings, LogOut,
  Eye, Download, Trash2, Plus, Edit2, Check, Loader2
} from 'lucide-react';
import { useAuthStore, useOrderStore, useWishlistStore, useProductStore, useNotificationStore } from '@/store';
import { cn } from '@/utils/cn';
import { ProductCard } from '@/components/ProductCard';
import { format } from 'date-fns';

// Account Layout
export function AccountLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const navItems = [
    { icon: User, label: 'Profile', path: '/account' },
    { icon: Package, label: 'Orders', path: '/account/orders' },
    { icon: Heart, label: 'Wishlist', path: '/account/wishlist' },
    { icon: MapPin, label: 'Addresses', path: '/account/addresses' },
    { icon: Bell, label: 'Notifications', path: '/account/notifications' },
    { icon: Settings, label: 'Settings', path: '/account/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/account'}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-amber-50 text-amber-700"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

// Profile Page
export function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateProfile(formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-amber-700 hover:underline"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-500">Full Name</span>
            <span className="font-medium text-gray-900">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium text-gray-900">{user?.phone}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-500">Member Since</span>
            <span className="font-medium text-gray-900">
              {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'N/A'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Orders Page
export function OrdersPage() {
  const { user } = useAuthStore();
  const { getOrdersByUser } = useOrderStore();
  
  const orders = user ? getOrdersByUser(user.id) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
      
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(order.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={cn("px-3 py-1 rounded-full text-sm font-medium capitalize", getStatusColor(order.status))}>
                {order.status}
              </span>
              <Link
                to={`/account/orders/${order.id}`}
                className="flex items-center gap-1 text-amber-700 hover:underline"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {order.items.slice(0, 4).map((item) => (
                <img
                  key={item.productId}
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
              ))}
              {order.items.length > 4 && (
                <span className="text-sm text-gray-500">+{order.items.length - 4} more</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-gray-500">{order.items.length} items</span>
              <span className="font-semibold text-gray-900">Total: ${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Order Detail Page
export function OrderDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { orders } = useOrderStore();
  const isNewOrder = location.state?.newOrder;
  
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h3>
        <Link to="/account/orders" className="text-amber-700 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const steps = ['confirmed', 'processing', 'shipped', 'delivered'];
  const currentStep = steps.indexOf(order.status);

  const handleDownloadInvoice = () => {
    // In production, this would generate a real PDF
    const invoiceContent = `
HOMELIKE SPICES
Invoice #${order.id}
Date: ${format(new Date(order.createdAt), 'MMMM d, yyyy')}

Items:
${order.items.map(item => `  ${item.productName} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${order.subtotal.toFixed(2)}
Shipping: $${order.shipping.toFixed(2)}
${order.discount > 0 ? `Discount: -$${order.discount.toFixed(2)}\n` : ''}
Total: $${order.total.toFixed(2)}

Shipping Address:
${order.shippingAddress.fullName}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {isNewOrder && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Order Placed Successfully!</h3>
          <p className="text-green-600">Thank you for your order. We'll send you updates via email.</p>
        </div>
      )}

      {/* Order Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{order.id}</h2>
            <p className="text-gray-500">
              Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("px-3 py-1 rounded-full text-sm font-medium capitalize", getStatusColor(order.status))}>
              {order.status}
            </span>
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Invoice
            </button>
          </div>
        </div>

        {/* Order Tracking */}
        {order.status !== 'cancelled' && (
          <div className="mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
              <div 
                className="absolute top-4 left-0 h-0.5 bg-amber-600 transition-all"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
              {steps.map((s, i) => (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    i <= currentStep ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-xs text-gray-500 mt-2 capitalize">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.trackingNumber && (
          <p className="text-sm text-gray-600">
            Tracking: <span className="font-medium">{order.trackingNumber}</span>
          </p>
        )}
        {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <p className="text-sm text-gray-600">
            Estimated Delivery: <span className="font-medium">{format(new Date(order.estimatedDelivery), 'MMMM d, yyyy')}</span>
          </p>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-4">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.productName}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
              </div>
              <p className="font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-6 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping & Payment */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
          <p className="text-gray-600">{order.shippingAddress.fullName}</p>
          <p className="text-gray-600">{order.shippingAddress.street}</p>
          <p className="text-gray-600">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p className="text-gray-600">{order.shippingAddress.phone}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
          <p className="text-gray-600">Method: {order.paymentMethod}</p>
          <p className="text-gray-600">Status: <span className="capitalize">{order.paymentStatus}</span></p>
        </div>
      </div>

      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 text-amber-700 hover:underline"
      >
        ← Back to Orders
      </Link>
    </div>
  );
}

// Wishlist Page
export function WishlistPage() {
  const { items } = useWishlistStore();
  const { products } = useProductStore();

  const wishlistProducts = items
    .map(item => products.find(p => p.id === item.productId))
    .filter(Boolean);

  if (wishlistProducts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-500 mb-6">Save items you love for later</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Wishlist ({wishlistProducts.length})</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {wishlistProducts.map((product) => product && (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Addresses Page
export function AddressesPage() {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress(editingId, formData);
      setEditingId(null);
    } else {
      addAddress({ ...formData, isDefault: (user?.addresses.length || 0) === 0 });
    }
    setFormData({
      label: '',
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    });
    setShowForm(false);
  };

  const handleEdit = (address: typeof formData & { id: string; isDefault: boolean }) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My Addresses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Home, Office, etc."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                {editingId ? 'Update' : 'Save'} Address
              </button>
            </div>
          </form>
        </div>
      )}

      {!user?.addresses.length && !showForm ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved addresses</h3>
          <p className="text-gray-500">Add an address for faster checkout</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {user?.addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{address.label}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-1 text-gray-400 hover:text-amber-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{address.fullName}</p>
              <p className="text-gray-600">{address.street}</p>
              <p className="text-gray-600">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-gray-600">{address.phone}</p>
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="mt-4 text-sm text-amber-700 hover:underline"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Notifications Page
export function NotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={() => user && markAllAsRead(user.id)}
            className="text-sm text-amber-700 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {userNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={cn(
                "bg-white rounded-xl p-4 cursor-pointer transition-colors",
                !notification.isRead && "border-l-4 border-amber-600 bg-amber-50"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="w-2 h-2 bg-amber-600 rounded-full shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Settings Page
export function SettingsPage() {
  const { updatePassword } = useAuthStore();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    const result = updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });

    if (result.success) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Settings</h2>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
        
        {message && (
          <div className={cn(
            "p-3 rounded-lg mb-4 text-sm",
            message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {message.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Email Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Order Updates</p>
              <p className="text-sm text-gray-500">Receive updates about your orders</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-600 rounded" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Promotions</p>
              <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-600 rounded" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Newsletter</p>
              <p className="text-sm text-gray-500">Weekly newsletter with recipes and tips</p>
            </div>
            <input type="checkbox" className="w-5 h-5 text-amber-600 rounded" />
          </label>
        </div>
      </div>
    </div>
  );
}
