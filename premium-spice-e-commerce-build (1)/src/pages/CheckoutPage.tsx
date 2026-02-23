import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, CreditCard, Banknote, Check, MapPin, Plus, Loader2 } from 'lucide-react';
import { useCartStore, useProductStore, useOrderStore, useAuthStore, useCouponStore, useNotificationStore } from '@/store';
import { Address } from '@/types';
import { cn } from '@/utils/cn';

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart, getTotal } = useCartStore();
  const { products } = useProductStore();
  const { createOrder } = useOrderStore();
  const { user, isAuthenticated, addAddress } = useAuthStore();
  const { useCoupon } = useCouponStore();
  const { addNotification } = useNotificationStore();

  const appliedCoupon = location.state?.coupon as { code: string; discount: number } | null;
  
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    user?.addresses.find(a => a.isDefault) || user?.addresses[0] || null
  );
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to continue</h2>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const cartProducts = items.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).filter(item => item.product);

  const subtotal = getTotal(products);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + shipping - discount;

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({ ...newAddress, isDefault: user.addresses.length === 0 });
    setShowAddAddress(false);
    setNewAddress({
      label: '',
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderItems = cartProducts.map(({ product, quantity }) => ({
      productId: product!.id,
      productName: product!.name,
      productImage: product!.images[0],
      price: product!.salePrice || product!.price,
      quantity
    }));

    const order = createOrder({
      userId: user.id,
      items: orderItems,
      subtotal,
      discount,
      shipping,
      total,
      status: 'confirmed',
      paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery',
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      shippingAddress: selectedAddress,
      couponCode: appliedCoupon?.code,
      trackingNumber: `TRK${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    if (appliedCoupon) {
      useCoupon(appliedCoupon.code);
    }

    addNotification({
      userId: user.id,
      title: 'Order Confirmed',
      message: `Your order ${order.id} has been confirmed and is being processed.`,
      type: 'order'
    });

    clearCart();
    setIsProcessing(false);
    navigate(`/account/orders/${order.id}`, { state: { newOrder: true } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/cart" className="text-gray-500 hover:text-amber-600">Cart</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          {['Address', 'Payment', 'Review'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "flex items-center gap-2",
                step > i + 1 ? "text-green-600" : step === i + 1 ? "text-amber-700" : "text-gray-400"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-medium",
                  step > i + 1 ? "bg-green-100" : step === i + 1 ? "bg-amber-100" : "bg-gray-100"
                )}>
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:block font-medium">{s}</span>
              </div>
              {i < 2 && (
                <div className={cn(
                  "w-12 sm:w-24 h-0.5 mx-2",
                  step > i + 1 ? "bg-green-300" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>

                {user.addresses.length === 0 && !showAddAddress ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No saved addresses</p>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Address
                    </button>
                  </div>
                ) : showAddAddress ? (
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          placeholder="Home, Office, etc."
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
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
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {user.addresses.map((address) => (
                      <label
                        key={address.id}
                        className={cn(
                          "flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors",
                          selectedAddress?.id === address.id
                            ? "border-amber-600 bg-amber-50"
                            : "border-gray-200 hover:border-amber-300"
                        )}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?.id === address.id}
                          onChange={() => setSelectedAddress(address)}
                          className="mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{address.label}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.fullName}</p>
                          <p className="text-sm text-gray-600">{address.street}</p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                        </div>
                      </label>
                    ))}
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center gap-2 text-amber-700 hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </button>
                  </div>
                )}

                {selectedAddress && !showAddAddress && (
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
                  >
                    Continue to Payment
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <label
                    className={cn(
                      "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors",
                      paymentMethod === 'card'
                        ? "border-amber-600 bg-amber-50"
                        : "border-gray-200 hover:border-amber-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Pay securely with your card</p>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors",
                      paymentMethod === 'cod'
                        ? "border-amber-600 bg-amber-50"
                        : "border-gray-200 hover:border-amber-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <Banknote className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 text-center">
                      In production, this would integrate with Stripe or another payment processor.
                      For demo purposes, click "Continue" to proceed.
                    </p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-amber-700 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-gray-600">{selectedAddress?.fullName}</p>
                  <p className="text-gray-600">{selectedAddress?.street}</p>
                  <p className="text-gray-600">
                    {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zipCode}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Payment Method</h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm text-amber-700 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-gray-600">
                    {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                  </p>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {cartProducts.map(({ product, quantity }) => product && (
                      <div key={product.id} className="flex gap-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          ${((product.salePrice || product.price) * quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Place Order - $${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                {cartProducts.slice(0, 3).map(({ product, quantity }) => product && (
                  <div key={product.id} className="flex gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${((product.salePrice || product.price) * quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                {cartProducts.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{cartProducts.length - 3} more items
                  </p>
                )}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
