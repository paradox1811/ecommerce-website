import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

import { Product, ProductColor, CartItem } from './types';
import { 
  PRODUCTS,
  HERO_PINK_CLOSET,
  BLACK_MEMBER_BANNER,
  NEW_ARRIVALS_BANNER,
  CLEARANCE_SALE_BANNER,
  TILE_1_ACC,
  TILE_2_TOPS,
  TILE_3_UNDER690,
  TILE_4_JACKETS,
  TRENDING_1_SPARKLES,
  TRENDING_2_ELEGANCE,
  TRENDING_3_FORMAL,
  TRENDING_4_BURGUNDY,
} from './data/products';

import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AccountModal } from './components/AccountModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  const currencySymbol = '₹';
  const currencyRate = 1.0;

  // Active Category & Gender Filtering
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeGender, setActiveGender] = useState<'all' | 'unisex' | 'women' | 'men'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist States
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'default-cart-1',
      product: PRODUCTS[0],
      selectedColor: PRODUCTS[0].colors[0],
      selectedSize: 'M',
      quantity: 1,
    }
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[0], PRODUCTS[1], PRODUCTS[4]]);

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; discountFixed: number } | null>(null);

  // Modals & Drawers States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; date: string; status: string; total: number }>>([
    { id: 'NC-984210', date: 'Yesterday', status: 'Dispatched via Express Courier', total: 4990 }
  ]);

  const showToast = (type: 'cart' | 'wishlist' | 'info', title: string, subtitle?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, subtitle }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Operations
  const handleAddToCart = (product: Product, color: ProductColor, size: string, quantity = 1) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === product.id && item.selectedColor.name === color.name && item.selectedSize === size
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        product,
        selectedColor: color,
        selectedSize: size,
        quantity,
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    showToast('cart', 'Added to Shopping Bag', `${product.name} (${color.name}, ${size})`);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('info', 'Item Removed from Bag');
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast('info', 'Removed from Wishlist', product.name);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('wishlist', 'Saved to Wishlist', product.name);
    }
  };

  // Promo Code Handler
  const handleApplyPromo = (code: string): boolean => {
    if (code === 'FRESH20' || code === 'NILES20' || code === 'NILESCART20') {
      setAppliedPromo({ code, discountPercent: 20, discountFixed: 0 });
      showToast('info', '20% Off Coupon Applied!', `${code} activated`);
      return true;
    } else if (code === 'NILESCART' || code === 'NILES10') {
      setAppliedPromo({ code, discountPercent: 15, discountFixed: 0 });
      showToast('info', '15% Off VIP Code Applied!', `${code} activated`);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast('info', 'Promo Code Removed');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToForYou = () => {
    const el = document.getElementById('for-you-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4 Price Point Tiles Data matching Screenshot 1 & 2
  const priceTiles = [
    {
      id: 'tile-1',
      image: TILE_1_ACC,
      caption: 'Accessories & Jewellery',
      onClick: () => {
        setActiveCategory('accessories');
        scrollToForYou();
      }
    },
    {
      id: 'tile-2',
      image: TILE_2_TOPS,
      caption: 'Autumn Tops & Knits',
      onClick: () => {
        setActiveCategory('tops');
        scrollToForYou();
      }
    },
    {
      id: 'tile-3',
      image: TILE_3_UNDER690,
      caption: 'Pick Anything',
      onClick: () => {
        setActiveCategory('all');
        scrollToForYou();
      }
    },
    {
      id: 'tile-4',
      image: TILE_4_JACKETS,
      caption: 'Jackets & Outerwear',
      onClick: () => {
        setActiveCategory('outerwear');
        scrollToForYou();
      }
    },
  ];

  // 4 Trending Now Cards Data matching Screenshot 3
  const trendingCards = [
    {
      id: 'trend-1',
      title: 'Holiday Sparkles',
      image: TRENDING_1_SPARKLES,
      prod: PRODUCTS[0],
    },
    {
      id: 'trend-2',
      title: 'Elegance Defined',
      image: TRENDING_2_ELEGANCE,
      prod: PRODUCTS[1],
    },
    {
      id: 'trend-3',
      title: 'Formal Co-ords',
      image: TRENDING_3_FORMAL,
      prod: PRODUCTS[3],
    },
    {
      id: 'trend-4',
      title: 'Back to Burgundy',
      image: TRENDING_4_BURGUNDY,
      prod: PRODUCTS[4],
    },
  ];

  // Filtered Products for the "FOR YOU" section (Unisex, Men, Women, All)
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeGender === 'unisex') {
      result = result.filter((p) => p.gender === 'unisex');
    } else if (activeGender === 'men') {
      result = result.filter((p) => p.gender === 'men' || p.gender === 'unisex');
    } else if (activeGender === 'women') {
      result = result.filter((p) => p.gender === 'women' || p.gender === 'unisex');
    }

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.gender && p.gender.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeGender, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white flex flex-col text-neutral-900 selection:bg-black selection:text-white font-sans antialiased">
      {/* 1. Header (Black Top Ticker + Main Nav + Categories) - Exact Savana UI */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToForYou();
        }}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Campaign Showcase (Pink 3D Display Box) matching Screenshot 1 & 5 */}
        <section className="relative w-full overflow-hidden bg-white">
          <div className="relative w-full max-w-[1440px] mx-auto">
            {/* The Main Hero Compartment Image */}
            <div className="relative w-full overflow-hidden cursor-pointer" onClick={scrollToForYou}>
              <img
                src={HERO_PINK_CLOSET}
                alt="NILESCART Warm Up Your Wardrobe Campaign"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover block select-none"
              />

              {/* Interactive Left & Right Navigation Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showToast('info', 'Browsing Campaign Slide 1 of 3');
                }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 bg-white/70 hover:bg-white text-neutral-800 rounded-sm flex items-center justify-center transition-all shadow-md"
                aria-label="Previous campaign slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showToast('info', 'Browsing Campaign Slide 2 of 3');
                }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 bg-white/70 hover:bg-white text-neutral-800 rounded-sm flex items-center justify-center transition-all shadow-md"
                aria-label="Next campaign slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Clickable Overlay for Central SHOP NOW */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-[11%] md:bottom-[13%] w-40 md:w-56 h-9 md:h-12 rounded-full cursor-pointer opacity-0 hover:opacity-20 bg-white transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToForYou();
                }}
                title="Shop Now Up To 50% Off"
              />
            </div>

            {/* Black Day Sale Member Banner Strip matching Screenshot 5 */}
            <div className="w-full cursor-pointer" onClick={scrollToForYou}>
              <img
                src={BLACK_MEMBER_BANNER}
                alt="Day Sale Member Prices Up to 50% Off + 3X Points"
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none"
              />
            </div>
          </div>
        </section>

        {/* 3. Section: 4 Price Point Tiles matching Screenshot 1 & 2 */}
        <section className="w-full bg-white py-6 md:py-10">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {priceTiles.map((tile) => (
                <div
                  key={tile.id}
                  onClick={tile.onClick}
                  className="group flex flex-col items-center cursor-pointer"
                >
                  <div className="w-full aspect-[3/4] overflow-hidden rounded-xs bg-[#f4a6b8] shadow-xs transition-transform duration-300 group-hover:scale-[1.015]">
                    <img
                      src={tile.image}
                      alt={tile.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-3 text-sm md:text-base font-bold text-neutral-900 group-hover:text-black transition-colors text-center">
                    {tile.caption}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Section: TRENDING NOW matching Screenshot 3 */}
        <section className="w-full bg-white py-8 md:py-12 border-t border-neutral-100">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">
                TRENDING NOW
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {trendingCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedProduct(card.prod)}
                  className="group flex flex-col items-center cursor-pointer"
                >
                  <div className="w-full aspect-[3/4] overflow-hidden rounded-xs bg-neutral-100 shadow-xs transition-transform duration-300 group-hover:scale-[1.015]">
                    <img
                      src={card.image}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-3 text-sm md:text-base font-bold text-neutral-900 group-hover:text-black transition-colors text-center">
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Section: NEW ARRIVALS Cinematic Campaign Banner matching Screenshot 4 */}
        <section className="w-full bg-white py-4 md:py-8">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
            <div
              className="relative w-full overflow-hidden rounded-xs cursor-pointer shadow-xs group"
              onClick={scrollToForYou}
            >
              <img
                src={NEW_ARRIVALS_BANNER}
                alt="New Arrivals From ₹390"
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none transition-transform duration-500 group-hover:scale-[1.008]"
                loading="lazy"
              />
              <div 
                className="absolute right-[10%] md:right-[15%] bottom-[12%] md:bottom-[15%] w-32 md:w-48 h-8 md:h-12 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                title="Shop New Arrivals"
              />
            </div>
          </div>
        </section>

        {/* 6. Section: Clearance Sale Pink Banner matching Screenshot 2 */}
        <section className="w-full bg-white py-4 md:py-6">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
            <div
              className="relative w-full overflow-hidden rounded-xs cursor-pointer shadow-xs group"
              onClick={scrollToForYou}
            >
              <img
                src={CLEARANCE_SALE_BANNER}
                alt="Clearance Sale Up to 60% Off"
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none transition-transform duration-500 group-hover:scale-[1.008]"
                loading="lazy"
              />
              <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-[14%] md:bottom-[16%] w-32 md:w-44 h-7 md:h-10 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                title="Shop Clearance Sale"
              />
            </div>
          </div>
        </section>

        {/* 7. Section: FOR YOU Curated Product Grid (Unisex, Men, Women) matching Screenshot 2 & 5 */}
        <section id="for-you-section" className="w-full bg-white py-6 md:py-10">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
            {/* Title & Gender Switcher Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                FOR YOU
              </h2>

              {/* Gender Filter Tabs (All, Unisex, Women, Men) */}
              <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-full text-xs font-bold tracking-wider uppercase">
                {(['all', 'unisex', 'women', 'men'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveGender(g)}
                    className={`px-3.5 py-1 rounded-full transition-all ${
                      activeGender === g
                        ? 'bg-black text-white shadow-xs'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {g === 'all' ? 'All Pieces' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filter Pill */}
            {(activeGender !== 'all' || activeCategory !== 'all') && (
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-neutral-600">
                <span>Filtering by:</span>
                {activeGender !== 'all' && (
                  <span className="bg-neutral-200 px-2 py-0.5 rounded text-black uppercase">
                    {activeGender}
                  </span>
                )}
                {activeCategory !== 'all' && (
                  <span className="bg-neutral-200 px-2 py-0.5 rounded text-black uppercase">
                    {activeCategory}
                  </span>
                )}
                <button
                  onClick={() => {
                    setActiveGender('all');
                    setActiveCategory('all');
                  }}
                  className="underline text-black font-bold ml-2 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Show All</span>
                </button>
              </div>
            )}

            {/* Product Cards Grid (Matching Screenshot 5) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currencySymbol={currencySymbol}
                  currencyRate={currencyRate}
                  isWishlisted={wishlist.some((w) => w.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={setSelectedProduct}
                  onQuickAdd={(prod, color, size) => handleAddToCart(prod, color, size, 1)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer (Exact Savana Footer with NILESCART Branding) */}
      <footer className="bg-white border-t border-neutral-200 py-10 text-xs text-neutral-600">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-100">
            <div>
              <h4 className="text-black font-bold uppercase tracking-wider mb-3">Customer Care</h4>
              <ul className="space-y-2 text-neutral-500">
                <li><button onClick={() => setAccountOpen(true)} className="hover:text-black">Track Order</button></li>
                <li><button onClick={() => setSizeGuideOpen(true)} className="hover:text-black">Size Guide</button></li>
                <li><button onClick={() => showToast('info', 'Free Returns Portal', 'Doorstep pickup available')} className="hover:text-black">Easy Returns</button></li>
                <li><button onClick={() => showToast('info', 'Shipping Policy', 'Free express pickup and delivery')} className="hover:text-black">Shipping Info</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-bold uppercase tracking-wider mb-3">Shop Categories</h4>
              <ul className="space-y-2 text-neutral-500">
                <li><button onClick={() => { setActiveCategory('tops'); scrollToForYou(); }} className="hover:text-black">Tops & Knits</button></li>
                <li><button onClick={() => { setActiveCategory('dresses'); scrollToForYou(); }} className="hover:text-black">Dresses</button></li>
                <li><button onClick={() => { setActiveCategory('co-ords'); scrollToForYou(); }} className="hover:text-black">Co-Ords & Sets</button></li>
                <li><button onClick={() => { setActiveCategory('outerwear'); scrollToForYou(); }} className="hover:text-black">Jackets & Outerwear</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-bold uppercase tracking-wider mb-3">Brand & Trust</h4>
              <ul className="space-y-2 text-neutral-500">
                <li><span className="hover:text-black cursor-pointer">About NILESCART</span></li>
                <li><span className="hover:text-black cursor-pointer">Sustainability</span></li>
                <li><span className="hover:text-black cursor-pointer">Authentic Quality</span></li>
                <li><span className="hover:text-black cursor-pointer">Terms & Privacy</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-bold uppercase tracking-wider mb-3">Special Offer</h4>
              <p className="text-neutral-500 leading-relaxed mb-3">
                Use coupon <strong>FRESH20</strong> or <strong>NILES20</strong> at checkout for 20% off your purchase.
              </p>
              <button
                onClick={() => handleApplyPromo('FRESH20')}
                className="px-4 py-2 bg-black text-white rounded text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Apply 20% Off Code
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
            <p>© 2026 NILESCART. All rights reserved.</p>
            <div className="flex gap-4">
              <span>UPI</span>
              <span>Credit & Debit Cards</span>
              <span>Net Banking</span>
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. Floating Buttons Matching Screenshot */}
      {/* Scroll to Top Up Arrow */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-2.5">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-800 hover:bg-neutral-50 transition-transform hover:-translate-y-0.5"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Floating AI / Styling Assistant Pill Matching Screenshot Bottom-Right */}
        <button
          onClick={() => showToast('info', 'NILESCART Style Advisor', 'Ask our AI stylist for size & outfit recommendations!')}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
          aria-label="Style Assistant"
          title="NILESCART Styling Assistant"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* 10. Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
        isWishlisted={selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <CartDrawer
        isOpen={cartOpen}
        cartItems={cartItems}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        wishlist={wishlist}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
        onClose={() => setWishlistOpen(false)}
        onRemove={handleToggleWishlist}
        onMoveToCart={(prod) => {
          handleAddToCart(prod, prod.colors[0], prod.sizes[0], 1);
        }}
      />

      <SearchModal
        isOpen={searchOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={PRODUCTS}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onSelectTag={(tag) => {
          setSearchQuery(tag);
          scrollToForYou();
        }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        cartItems={cartItems}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
        appliedPromo={appliedPromo}
        onClose={() => setCheckoutOpen(false)}
        onOrderSuccess={(orderId) => {
          const totalRaw = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
          setRecentOrders([
            { id: orderId, date: 'Just now', status: 'Processing', total: totalRaw },
            ...recentOrders,
          ]);
          setCartItems([]);
          showToast('info', 'Order Placed Successfully!', `Order ref: ${orderId}`);
        }}
      />

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        recentOrders={recentOrders}
        currencySymbol={currencySymbol}
      />

      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
