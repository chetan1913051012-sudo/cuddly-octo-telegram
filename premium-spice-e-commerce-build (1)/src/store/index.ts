import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, WishlistItem, Order, Notification, Review, Product, Coupon, Banner, Address } from '@/types';
import { products as initialProducts, coupons as initialCoupons, banners as initialBanners } from '@/data/products';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Auth Store
interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; message: string; isAdmin?: boolean };
  register: (name: string, email: string, password: string, phone: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updatePassword: (oldPassword: string, newPassword: string) => { success: boolean; message: string };
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [
        {
          id: 'admin-1',
          email: 'admin@homelike.com',
          password: 'admin123',
          name: 'Admin User',
          phone: '+1234567890',
          role: 'admin',
          isBlocked: false,
          createdAt: '2024-01-01',
          addresses: []
        },
        {
          id: 'user-1',
          email: 'john@example.com',
          password: 'password123',
          name: 'John Doe',
          phone: '+1987654321',
          role: 'user',
          isBlocked: false,
          createdAt: '2024-02-15',
          addresses: [
            {
              id: 'addr-1',
              label: 'Home',
              fullName: 'John Doe',
              phone: '+1987654321',
              street: '123 Spice Lane',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'USA',
              isDefault: true
            }
          ]
        }
      ],
      isAuthenticated: false,
      login: (email, password) => {
        const users = get().users;
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          if (user.isBlocked) {
            return { success: false, message: 'Your account has been blocked. Please contact support.' };
          }
          set({ user, isAuthenticated: true });
          return { success: true, message: 'Login successful!', isAdmin: user.role === 'admin' };
        }
        return { success: false, message: 'Invalid email or password' };
      },
      register: (name, email, password, phone) => {
        const users = get().users;
        if (users.find(u => u.email === email)) {
          return { success: false, message: 'Email already registered' };
        }
        const newUser: User = {
          id: generateId(),
          email,
          password,
          name,
          phone,
          role: 'user',
          isBlocked: false,
          createdAt: new Date().toISOString(),
          addresses: []
        };
        set({ users: [...users, newUser], user: newUser, isAuthenticated: true });
        return { success: true, message: 'Registration successful!' };
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => {
        const user = get().user;
        if (user) {
          const updatedUser = { ...user, ...data };
          const users = get().users.map(u => u.id === user.id ? updatedUser : u);
          set({ user: updatedUser, users });
        }
      },
      updatePassword: (oldPassword, newPassword) => {
        const user = get().user;
        if (user && user.password === oldPassword) {
          const updatedUser = { ...user, password: newPassword };
          const users = get().users.map(u => u.id === user.id ? updatedUser : u);
          set({ user: updatedUser, users });
          return { success: true, message: 'Password updated successfully!' };
        }
        return { success: false, message: 'Current password is incorrect' };
      },
      addAddress: (address) => {
        const user = get().user;
        if (user) {
          const newAddress = { ...address, id: generateId() };
          if (user.addresses.length === 0) {
            newAddress.isDefault = true;
          }
          const updatedUser = { ...user, addresses: [...user.addresses, newAddress] };
          const users = get().users.map(u => u.id === user.id ? updatedUser : u);
          set({ user: updatedUser, users });
        }
      },
      updateAddress: (id, address) => {
        const user = get().user;
        if (user) {
          const updatedUser = {
            ...user,
            addresses: user.addresses.map(a => a.id === id ? { ...a, ...address } : a)
          };
          const users = get().users.map(u => u.id === user.id ? updatedUser : u);
          set({ user: updatedUser, users });
        }
      },
      deleteAddress: (id) => {
        const user = get().user;
        if (user) {
          const updatedUser = {
            ...user,
            addresses: user.addresses.filter(a => a.id !== id)
          };
          const users = get().users.map(u => u.id === user.id ? updatedUser : u);
          set({ user: updatedUser, users });
        }
      },
      setDefaultAddress: (id) => {
        const user = get().user;
        if (user) {
          const updatedUser = {
            ...user,
            addresses: user.addresses.map(a => ({ ...a, isDefault: a.id === id }))
          };
          const users = get().users.map(u => u.id === user.id ? updatedUser : u);
          set({ user: updatedUser, users });
        }
      },
      blockUser: (userId) => {
        const users = get().users.map(u => u.id === userId ? { ...u, isBlocked: true } : u);
        set({ users });
      },
      unblockUser: (userId) => {
        const users = get().users.map(u => u.id === userId ? { ...u, isBlocked: false } : u);
        set({ users });
      },
      deleteUser: (userId) => {
        const users = get().users.filter(u => u.id !== userId);
        set({ users });
      }
    }),
    { name: 'homelike-auth' }
  )
);

// Cart Store
interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: (products: Product[]) => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.productId === productId);
        if (existingItem) {
          set({
            items: items.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ items: [...items, { productId, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map(item =>
              item.productId === productId ? { ...item, quantity } : item
            )
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: (products) => {
        return get().items.reduce((total, item) => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const price = product.salePrice || product.price;
            return total + price * item.quantity;
          }
          return total;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    { name: 'homelike-cart' }
  )
);

// Wishlist Store
interface WishlistState {
  items: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        if (!get().isInWishlist(productId)) {
          set({ items: [...get().items, { productId, addedAt: new Date().toISOString() }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      }
    }),
    { name: 'homelike-wishlist' }
  )
);

// Order Store
interface OrderState {
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
  getOrdersByUser: (userId: string) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: 'ORD-001',
          userId: 'user-1',
          items: [
            { productId: '1', productName: 'Premium Kashmiri Red Chilli Powder', productImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600', price: 9.99, quantity: 2 },
            { productId: '2', productName: 'Organic Turmeric Powder', productImage: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600', price: 14.99, quantity: 1 }
          ],
          subtotal: 34.97,
          discount: 3.50,
          shipping: 5.99,
          total: 37.46,
          status: 'delivered',
          paymentMethod: 'card',
          paymentStatus: 'paid',
          shippingAddress: {
            id: 'addr-1',
            label: 'Home',
            fullName: 'John Doe',
            phone: '+1987654321',
            street: '123 Spice Lane',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            isDefault: true
          },
          couponCode: 'WELCOME10',
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-25T14:00:00Z',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-25'
        }
      ],
      createOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set({ orders: [...get().orders, order] });
        return order;
      },
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          )
        });
      },
      cancelOrder: (orderId) => {
        set({
          orders: get().orders.map(order =>
            order.id === orderId
              ? { ...order, status: 'cancelled', updatedAt: new Date().toISOString() }
              : order
          )
        });
      },
      getOrdersByUser: (userId) => {
        return get().orders.filter(order => order.userId === userId);
      }
    }),
    { name: 'homelike-orders' }
  )
);

// Product Store
interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
  getProduct: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      addProduct: (productData) => {
        const product: Product = {
          ...productData,
          id: generateId(),
          createdAt: new Date().toISOString()
        };
        set({ products: [...get().products, product] });
      },
      updateProduct: (id, data) => {
        set({
          products: get().products.map(p => p.id === id ? { ...p, ...data } : p)
        });
      },
      deleteProduct: (id) => {
        set({ products: get().products.filter(p => p.id !== id) });
      },
      toggleProductStatus: (id) => {
        set({
          products: get().products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p)
        });
      },
      updateStock: (id, stock) => {
        set({
          products: get().products.map(p => p.id === id ? { ...p, stock } : p)
        });
      },
      getProduct: (id) => get().products.find(p => p.id === id),
      getProductBySlug: (slug) => get().products.find(p => p.slug === slug)
    }),
    { name: 'homelike-products' }
  )
);

// Notification Store
interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: '1',
          userId: 'user-1',
          title: 'Order Delivered',
          message: 'Your order ORD-001 has been delivered successfully!',
          type: 'order',
          isRead: false,
          createdAt: '2024-01-25T14:00:00Z'
        },
        {
          id: '2',
          userId: 'user-1',
          title: 'Welcome to Homelike!',
          message: 'Thank you for joining us. Use code WELCOME10 for 10% off your first order.',
          type: 'promo',
          isRead: true,
          createdAt: '2024-02-15T10:00:00Z'
        }
      ],
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(),
          isRead: false,
          createdAt: new Date().toISOString()
        };
        set({ notifications: [newNotification, ...get().notifications] });
      },
      markAsRead: (id) => {
        set({
          notifications: get().notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
        });
      },
      markAllAsRead: (userId) => {
        set({
          notifications: get().notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n)
        });
      },
      getUnreadCount: (userId) => {
        return get().notifications.filter(n => n.userId === userId && !n.isRead).length;
      }
    }),
    { name: 'homelike-notifications' }
  )
);

// Review Store
interface ReviewState {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  getProductReviews: (productId: string) => Review[];
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [
        {
          id: '1',
          userId: 'user-1',
          userName: 'John Doe',
          productId: '1',
          rating: 5,
          comment: 'Amazing quality! The color is so vibrant and the flavor is authentic. Will definitely order again.',
          isApproved: true,
          createdAt: '2024-01-26T10:00:00Z'
        },
        {
          id: '2',
          userId: 'user-2',
          userName: 'Sarah Smith',
          productId: '2',
          rating: 5,
          comment: 'Best turmeric I have ever used. You can really taste the difference.',
          isApproved: true,
          createdAt: '2024-01-27T15:30:00Z'
        },
        {
          id: '3',
          userId: 'user-3',
          userName: 'Mike Johnson',
          productId: '4',
          rating: 4,
          comment: 'Great garam masala blend. Makes my curries taste restaurant-quality.',
          isApproved: true,
          createdAt: '2024-01-28T09:15:00Z'
        }
      ],
      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: generateId(),
          isApproved: false,
          createdAt: new Date().toISOString()
        };
        set({ reviews: [...get().reviews, newReview] });
      },
      approveReview: (id) => {
        set({
          reviews: get().reviews.map(r => r.id === id ? { ...r, isApproved: true } : r)
        });
      },
      deleteReview: (id) => {
        set({ reviews: get().reviews.filter(r => r.id !== id) });
      },
      getProductReviews: (productId) => {
        return get().reviews.filter(r => r.productId === productId && r.isApproved);
      }
    }),
    { name: 'homelike-reviews' }
  )
);

// Coupon Store
interface CouponState {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; message: string; discount?: number };
  useCoupon: (code: string) => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: initialCoupons,
      addCoupon: (couponData) => {
        const coupon: Coupon = {
          ...couponData,
          id: generateId(),
          usedCount: 0
        };
        set({ coupons: [...get().coupons, coupon] });
      },
      updateCoupon: (id, data) => {
        set({
          coupons: get().coupons.map(c => c.id === id ? { ...c, ...data } : c)
        });
      },
      deleteCoupon: (id) => {
        set({ coupons: get().coupons.filter(c => c.id !== id) });
      },
      validateCoupon: (code, orderTotal) => {
        const coupon = get().coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (!coupon) {
          return { valid: false, message: 'Invalid coupon code' };
        }
        if (!coupon.isActive) {
          return { valid: false, message: 'This coupon is no longer active' };
        }
        if (new Date(coupon.expiresAt) < new Date()) {
          return { valid: false, message: 'This coupon has expired' };
        }
        if (coupon.usedCount >= coupon.usageLimit) {
          return { valid: false, message: 'This coupon has reached its usage limit' };
        }
        if (orderTotal < coupon.minOrder) {
          return { valid: false, message: `Minimum order amount is $${coupon.minOrder}` };
        }
        let discount = coupon.type === 'percentage' ? (orderTotal * coupon.value) / 100 : coupon.value;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
        return { valid: true, message: 'Coupon applied successfully!', discount };
      },
      useCoupon: (code) => {
        set({
          coupons: get().coupons.map(c => 
            c.code.toUpperCase() === code.toUpperCase() 
              ? { ...c, usedCount: c.usedCount + 1 } 
              : c
          )
        });
      }
    }),
    { name: 'homelike-coupons' }
  )
);

// Banner Store
interface BannerState {
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, data: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;
}

export const useBannerStore = create<BannerState>()(
  persist(
    (set, get) => ({
      banners: initialBanners,
      addBanner: (bannerData) => {
        const banner: Banner = {
          ...bannerData,
          id: generateId()
        };
        set({ banners: [...get().banners, banner] });
      },
      updateBanner: (id, data) => {
        set({
          banners: get().banners.map(b => b.id === id ? { ...b, ...data } : b)
        });
      },
      deleteBanner: (id) => {
        set({ banners: get().banners.filter(b => b.id !== id) });
      },
      toggleBannerStatus: (id) => {
        set({
          banners: get().banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b)
        });
      }
    }),
    { name: 'homelike-banners' }
  )
);
