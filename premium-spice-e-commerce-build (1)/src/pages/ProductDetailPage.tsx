import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, 
  RotateCcw, ChevronRight, Check
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useProductStore, useCartStore, useWishlistStore, useReviewStore, useAuthStore } from '@/store';
import { cn } from '@/utils/cn';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { products, getProductBySlug } = useProductStore();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addReview, getProductReviews } = useReviewStore();
  const { user, isAuthenticated } = useAuthStore();

  const product = getProductBySlug(slug || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Link to="/products" className="text-amber-600 hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const productReviews = getProductReviews(product.id);
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category && p.isActive)
    .slice(0, 4);

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReview.comment.trim()) return;
    
    addReview({
      userId: user.id,
      userName: user.name,
      productId: product.id,
      rating: newReview.rating,
      comment: newReview.comment
    });
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-amber-600">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-amber-600">Products</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-gray-500 hover:text-amber-600">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                        selectedImage === index ? "border-amber-600" : "border-transparent"
                      )}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-amber-600 font-medium">{product.category}</span>
                {product.stock < 10 && product.stock > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    Only {product.stock} left
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-amber-700">
                  ${(product.salePrice || product.price).toFixed(2)}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDescription}</p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Weight</span>
                  <p className="font-medium text-gray-900">{product.weight}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Origin</span>
                  <p className="font-medium text-gray-900">{product.origin}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, i) => (
                    <span key={i} className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <Check className="w-3 h-3 text-green-600" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              {product.stock > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className={cn(
                      "flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
                      addedToCart
                        ? "bg-green-600 text-white"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                    )}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className={cn(
                      "w-12 h-12 border rounded-lg flex items-center justify-center transition-colors shrink-0",
                      inWishlist
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
                  </button>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 mb-6 text-center">
                  <p className="text-gray-500 font-medium">Out of Stock</p>
                </div>
              )}

              {/* Guarantees */}
              <div className="border-t pt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                  <p className="text-xs text-gray-600">Free Shipping over $50</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                  <p className="text-xs text-gray-600">100% Authentic</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                  <p className="text-xs text-gray-600">30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={cn(
                  "px-6 py-4 font-medium transition-colors relative",
                  activeTab === 'description'
                    ? "text-amber-700"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Description
                {activeTab === 'description' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={cn(
                  "px-6 py-4 font-medium transition-colors relative",
                  activeTab === 'reviews'
                    ? "text-amber-700"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Reviews ({productReviews.length})
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                )}
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'description' ? (
              <div className="prose prose-amber max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            ) : (
              <div>
                {/* Write Review */}
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                          >
                            <Star
                              className={cn(
                                "w-6 h-6 transition-colors",
                                star <= newReview.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 mb-2">Your Review</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Share your experience with this product..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl text-center">
                    <p className="text-gray-600 mb-4">Please login to write a review</p>
                    <Link
                      to="/login"
                      className="inline-block px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Login
                    </Link>
                  </div>
                )}

                {/* Reviews List */}
                {productReviews.length > 0 ? (
                  <div className="space-y-6">
                    {productReviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-semibold">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-3 h-3",
                                      i < review.rating
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
