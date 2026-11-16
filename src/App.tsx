import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

import { Product, ProductColor, CartItem } from './types';
import { PRODUCTS } from './data/products';
import {
  SECTION_COLOR_THEMES,
  DEFAULT_THEME_ID,
  SectionThemeId,
} from './data/sectionThemes';

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
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/PWAInstallButton';

export default function App() {
  const currencySymbol = '₹';
  const currencyRate = 1.0;

  // Active Editorial Colour Theme (5 Distinct Themes for All Non-Product Sections)
  const [activeThemeId, setActiveThemeId] = useState<SectionThemeId>(() => {
    try {
      const saved = localStorage.getItem('nilescart_section_theme') as SectionThemeId | null;
      if (saved && SECTION_COLOR_THEMES.some((t) => t.id === saved)) return saved;
    } catch {
      // Ignore storage access errors
    }
    return DEFAULT_THEME_ID;
  });

  const currentTheme = useMemo(
    () => SECTION_COLOR_THEMES.find((t) => t.id === activeThemeId) || SECTION_COLOR_THEMES[0],
    [activeThemeId]
  );

  const handleSelectTheme = (id: SectionThemeId) => {
    setActiveThemeId(id);
    try {
      localStorage.setItem('nilescart_section_theme', id);
    } catch {
      // Ignore storage access errors
    }
  };

  // Active Category & Gender Filtering
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeGender, setActiveGender] = useState<'all' | 'unisex' | 'women' | 'men'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[0], PRODUCTS[1], PRODUCTS[7]]);

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
    { id: 'NC-984210', date: 'Yesterday', status: 'Dispatched via Express Courier', total: 1611 }
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

  // 4 SPECIAL OFFER Tiles Data (Dynamic per Selected Editorial Colour Theme)
  const specialOffers = [
    {
      id: 'offer-1',
      image: currentTheme.images.offerAccessories,
      caption: 'Accessories & Jewellery',
      kicker: 'STARTING AT',
      price: '₹90',
      theme: 'light-top' as const,
      onClick: () => {
        setActiveCategory('accessories');
        scrollToForYou();
      }
    },
    {
      id: 'offer-2',
      image: currentTheme.images.offerKnitwear,
      caption: 'Autumn Tops & Knits',
      kicker: 'FROM',
      price: '₹590',
      theme: 'photo-center' as const,
      onClick: () => {
        setActiveCategory('tops');
        scrollToForYou();
      }
    },
    {
      id: 'offer-3',
      image: currentTheme.images.offerEssentials,
      caption: 'Pick Anything',
      kicker: 'UNDER',
      price: '₹690',
      theme: 'light-top' as const,
      onClick: () => {
        setActiveCategory('all');
        scrollToForYou();
      }
    },
    {
      id: 'offer-4',
      image: currentTheme.images.offerJackets,
      caption: 'Jackets & Outerwear',
      kicker: 'FROM',
      price: '₹890',
      theme: 'photo-center' as const,
      onClick: () => {
        setActiveCategory('outerwear');
        scrollToForYou();
      }
    },
  ];

  // 4 TRENDING NOW Cards Data (Dynamic per Selected Editorial Colour Theme)
  const trendingCards = [
    {
      id: 'trend-1',
      title: 'Dark Romance',
      image: currentTheme.images.trendingDarkRomance,
      prod: PRODUCTS[7],
    },
    {
      id: 'trend-2',
      title: 'Faux Fur',
      image: currentTheme.images.trendingFauxFur,
      prod: PRODUCTS[21],
    },
    {
      id: 'trend-3',
      title: 'Formal Co-ords',
      image: currentTheme.images.trendingFormalCoords,
      prod: PRODUCTS[4],
    },
    {
      id: 'trend-4',
      title: 'Animal Print Everything',
      image: currentTheme.images.trendingAnimalPrint,
      prod: PRODUCTS[8],
    },
  ];

  // Filtered Products for the "FOR YOU" section
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
      result = result.filter((p) => p.category === activeCategory || p.tags.includes(activeCategory));
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
    <div
      className="min-h-screen flex flex-col text-neutral-900 font-sans antialiased transition-colors duration-300"
      style={{ backgroundColor: currentTheme.palette.pageBg }}
    >
      {/* 1. Header (Dynamic Top Ticker + Main Nav + Categories) */}
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
        mobileMenuOpen={mobileMenuOpen}
        onSetMobileMenuOpen={setMobileMenuOpen}
        tickerBg={currentTheme.palette.tickerBg}
        tickerText={currentTheme.palette.tickerText}
        accentColor={currentTheme.palette.accent}
      />

      <main className="flex-1 pb-16 md:pb-0">
        {/* Editorial Colour Theme Selector Strip (5 Curated Themes — Section Imagery Only) */}
        <section
          aria-label="Storefront Editorial Colour Theme Selector"
          className="w-full border-b border-black/10 transition-colors duration-300"
          style={{ backgroundColor: currentTheme.palette.surfaceMuted }}
        >
          <div className="w-full px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-700 whitespace-nowrap shrink-0">
              Editorial Palette
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" role="tablist" aria-label="Choose editorial colour theme">
              {SECTION_COLOR_THEMES.map((theme) => {
                const isSelected = theme.id === currentTheme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-tight whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                      isSelected
                        ? 'shadow-xs border-transparent'
                        : 'bg-white/80 text-neutral-700 border-black/10 hover:bg-white hover:text-black'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: theme.palette.accent,
                            color: theme.palette.accentText,
                          }
                        : undefined
                    }
                  >
                    <span className="flex items-center -space-x-1 shrink-0" aria-hidden="true">
                      <span
                        className="w-3 h-3 rounded-full border border-white/80"
                        style={{ backgroundColor: theme.swatchPrimary }}
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-white/80"
                        style={{ backgroundColor: theme.swatchSecondary }}
                      />
                    </span>
                    <span>{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. Hero Editorial Banner (Full-Screen Edge-to-Edge, Uncropped 1376x768 Frame) + Flash Sale Bar */}
        <section className="w-full">
          <div className="w-full">
            <div
              className="relative w-full aspect-[1376/768] overflow-hidden cursor-pointer group"
              style={{ backgroundColor: currentTheme.palette.surfaceMuted }}
              onClick={scrollToForYou}
            >
              <img
                src={currentTheme.images.heroBanner}
                alt={`Winter is here Up to 50% OFF - ${currentTheme.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.006]"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: currentTheme.palette.bannerScrimGradient }}
              />

              {/* Right-Half Editorial Headline Lockup */}
              <div className="absolute inset-y-0 right-0 w-[55%] flex flex-col items-center justify-center text-center px-3 sm:px-8 pointer-events-none">
                <p
                  className="font-serif text-base sm:text-3xl md:text-5xl lg:text-6xl tracking-tight leading-none"
                  style={{ color: currentTheme.palette.bannerHeadlineColor }}
                >
                  <span>Winter </span>
                  <span className="italic" style={{ color: currentTheme.palette.bannerAccentColor }}>
                    is here
                  </span>
                </p>
                <div className="mt-1.5 sm:mt-4 flex items-baseline justify-center gap-1.5 sm:gap-3">
                  <span
                    className="font-serif italic text-xs sm:text-xl md:text-2xl lg:text-3xl"
                    style={{ color: currentTheme.palette.bannerEyebrowColor }}
                  >
                    Up to
                  </span>
                  <span
                    className="font-serif font-black text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter leading-none tabular-nums"
                    style={{ color: currentTheme.palette.bannerAccentColor }}
                  >
                    50%
                  </span>
                  <span
                    className="font-serif italic font-bold text-sm sm:text-2xl md:text-3xl lg:text-4xl"
                    style={{ color: currentTheme.palette.bannerAccentColor }}
                  >
                    OFF
                  </span>
                </div>
                <span
                  className="mt-2 sm:mt-6 inline-flex items-center justify-center px-4 sm:px-9 py-1 sm:py-2.5 rounded-full text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.14em] shadow-md transition-opacity group-hover:opacity-90"
                  style={{
                    backgroundColor: currentTheme.palette.bannerCtaBg,
                    color: currentTheme.palette.bannerCtaText,
                  }}
                >
                  SHOP NOW
                </span>
              </div>
            </div>

            {/* Crisp Full-Width Attached Flash Sale Strip */}
            <button
              type="button"
              onClick={scrollToForYou}
              className="w-full text-white px-4 sm:px-8 lg:px-10 py-2.5 sm:py-3.5 flex items-center justify-between text-left transition-opacity hover:opacity-95 cursor-pointer"
              style={{ backgroundColor: currentTheme.palette.flashBarBg }}
            >
              <div className="flex items-baseline gap-2.5 sm:gap-4 flex-wrap">
                <span className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight">
                  FLASH SALE
                </span>
                <span className="text-sm sm:text-lg md:text-2xl font-light uppercase tracking-wide text-neutral-100">
                  UP TO 70% OFF
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                SHOP NOW &gt;
              </span>
            </button>
          </div>
        </section>

        {/* 3. Section: SPECIAL OFFER (Full-Width 4 Cards) */}
        <section className="w-full py-6 md:py-10">
          <div className="w-full px-3 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-black text-center mb-5 md:mb-6">
              SPECIAL OFFER
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {specialOffers.map((tile) => (
                <div
                  key={tile.id}
                  onClick={tile.onClick}
                  className="group flex flex-col items-center cursor-pointer"
                >
                  <div
                    className="relative w-full aspect-[896/1200] overflow-hidden transition-transform duration-300 group-hover:scale-[1.015]"
                    style={{ backgroundColor: currentTheme.palette.surfaceMuted }}
                  >
                    <img
                      src={tile.image}
                      alt={tile.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />

                    {/* Contrast Gradient / Scrim + Crisp Price Point Typography */}
                    {tile.theme === 'photo-center' ? (
                      <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center text-center px-2 select-none">
                        <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-white drop-shadow">
                          {tile.kicker}
                        </span>
                        <span className="mt-1 font-sans font-black text-3xl sm:text-4xl lg:text-[44px] text-white tracking-tight leading-none drop-shadow-md tabular-nums">
                          {tile.price}
                        </span>
                        <span className="mt-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white border-b border-white pb-0.5 drop-shadow">
                          SHOP NOW &gt;
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 top-0 h-[72%] flex flex-col items-center justify-center text-center px-2 select-none">
                        <span
                          className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.16em]"
                          style={{ color: currentTheme.palette.offerLightSubText }}
                        >
                          {tile.kicker}
                        </span>
                        <span
                          className="mt-1 font-sans font-black text-3xl sm:text-4xl lg:text-[44px] tracking-tight leading-none tabular-nums"
                          style={{ color: currentTheme.palette.offerLightText }}
                        >
                          {tile.price}
                        </span>
                        <span
                          className="mt-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border-b pb-0.5"
                          style={{
                            color: currentTheme.palette.offerLightCtaText,
                            borderColor: currentTheme.palette.offerLightCtaText,
                          }}
                        >
                          SHOP NOW &gt;
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2.5 text-[13px] md:text-[14px] font-bold text-neutral-900 group-hover:text-black transition-colors text-center">
                    {tile.caption}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Section: Hot right now. Best Sellers. Full-Screen Uncropped Banner */}
        <section className="w-full py-2 md:py-3">
          <div className="w-full">
            <div
              className="relative w-full aspect-[1376/768] overflow-hidden cursor-pointer group"
              style={{ backgroundColor: currentTheme.palette.surfaceMuted }}
              onClick={scrollToForYou}
            >
              <img
                src={currentTheme.images.bestsellersBanner}
                alt={`Hot right now. Best Sellers. FROM ₹390 - ${currentTheme.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.006]"
                loading="lazy"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: currentTheme.palette.bannerScrimGradient }}
              />

              <div className="absolute inset-y-0 right-0 w-[52%] flex flex-col items-center justify-center text-center px-3 sm:px-8 pointer-events-none">
                <p
                  className="font-serif text-xs sm:text-xl md:text-2xl lg:text-3xl tracking-tight"
                  style={{ color: currentTheme.palette.bannerHeadlineColor }}
                >
                  Hot right now. Best Sellers.
                </p>
                <p
                  className="mt-1 sm:mt-2 font-serif font-black text-2xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-none tabular-nums"
                  style={{ color: currentTheme.palette.bannerAccentColor }}
                >
                  FROM ₹390
                </p>
                <span
                  className="mt-2.5 sm:mt-5 inline-flex items-center justify-center px-4 sm:px-8 py-1 sm:py-2.5 rounded-full text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.14em] shadow-sm transition-opacity group-hover:opacity-90"
                  style={{
                    backgroundColor: currentTheme.palette.bannerCtaBg,
                    color: currentTheme.palette.bannerCtaText,
                  }}
                >
                  SHOP NOW
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Section: TRENDING NOW (Full-Width 4 Cards) */}
        <section className="w-full py-6 md:py-10">
          <div className="w-full px-3 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-black text-center mb-5 md:mb-6">
              TRENDING NOW
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {trendingCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedProduct(card.prod)}
                  className="group flex flex-col items-center cursor-pointer"
                >
                  <div
                    className="w-full aspect-[896/1200] overflow-hidden transition-transform duration-300 group-hover:scale-[1.015]"
                    style={{ backgroundColor: currentTheme.palette.surfaceMuted }}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-2.5 text-[13px] md:text-[14px] font-bold text-neutral-900 group-hover:text-black transition-colors text-center">
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Section: NEW ARRIVALS FROM ₹390 Full-Screen Uncropped Banner */}
        <section className="w-full py-2 md:py-3">
          <div className="w-full">
            <div
              className="relative w-full aspect-[1376/768] overflow-hidden cursor-pointer group"
              style={{ backgroundColor: currentTheme.palette.surfaceMuted }}
              onClick={scrollToForYou}
            >
              <img
                src={currentTheme.images.newArrivalsBanner}
                alt={`NEW ARRIVALS FROM ₹390 - ${currentTheme.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.006]"
                loading="lazy"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: currentTheme.palette.bannerScrimGradient }}
              />

              <div className="absolute inset-y-0 right-0 w-[50%] flex flex-col items-start justify-center px-4 sm:px-10 lg:px-16 pointer-events-none">
                <span
                  className="text-[10px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em]"
                  style={{ color: currentTheme.palette.bannerEyebrowColor }}
                >
                  NEW ARRIVALS
                </span>
                <span
                  className="mt-0.5 sm:mt-1 font-serif text-lg sm:text-3xl md:text-4xl lg:text-5xl leading-none"
                  style={{ color: currentTheme.palette.bannerHeadlineColor }}
                >
                  FROM
                </span>
                <span
                  className="mt-0.5 font-serif font-black text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none tabular-nums"
                  style={{ color: currentTheme.palette.bannerAccentColor }}
                >
                  ₹390
                </span>
                <span
                  className="mt-2.5 sm:mt-5 inline-flex items-center justify-center px-4 sm:px-8 py-1 sm:py-2.5 rounded-full text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.14em] shadow-sm transition-opacity group-hover:opacity-90"
                  style={{
                    backgroundColor: currentTheme.palette.bannerCtaBg,
                    color: currentTheme.palette.bannerCtaText,
                  }}
                >
                  SHOP NOW
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Section: LAST CHANCES 20-60% OFF Full-Screen Sale Banner */}
        <section className="w-full py-3 md:py-4">
          <div className="w-full">
            <div
              className="relative w-full aspect-[2.6/1] sm:aspect-[4.4/1] overflow-hidden cursor-pointer group"
              style={{ backgroundColor: currentTheme.palette.surfaceMuted }}
              onClick={scrollToForYou}
            >
              <img
                src={currentTheme.images.lastChancesBanner}
                alt={`YOUR FAVORITES, FOR A LIMITED TIME! LAST CHANCES 20-60% OFF - ${currentTheme.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.006]"
                loading="lazy"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: currentTheme.palette.lastChancesScrim }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <span
                  className="text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.18em]"
                  style={{ color: currentTheme.palette.lastChancesInk }}
                >
                  YOUR FAVORITES, FOR A LIMITED TIME!
                </span>
                <div className="mt-1 sm:mt-2 flex items-center justify-center gap-2 sm:gap-4">
                  <div
                    className="hidden sm:flex flex-col items-end text-[11px] md:text-sm font-serif font-bold leading-tight uppercase"
                    style={{ color: currentTheme.palette.lastChancesInk }}
                  >
                    <span>LAST</span>
                    <span>CHANCES</span>
                  </div>
                  <span
                    className="font-serif font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none tabular-nums"
                    style={{ color: currentTheme.palette.lastChancesInk }}
                  >
                    20–60% OFF
                  </span>
                </div>
                <span
                  className="mt-2 sm:mt-3.5 inline-flex items-center justify-center px-5 sm:px-7 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.14em] shadow-sm transition-opacity group-hover:opacity-90"
                  style={{
                    backgroundColor: currentTheme.palette.lastChancesCtaBg,
                    color: currentTheme.palette.lastChancesCtaText,
                  }}
                >
                  SHOP NOW
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Section: FOR YOU Product Grid (Full-Width 4 Columns — Unchanged Product Photography) */}
        <section id="for-you-section" className="w-full pt-4 pb-8 md:pt-6 md:pb-12">
          <div className="w-full px-3 sm:px-6 lg:px-8">
            {/* Title & Gender Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black">
                FOR YOU
              </h2>

              <div
                className="flex items-center gap-1 p-1 rounded-full text-[11px] font-bold tracking-wider uppercase self-start sm:self-auto"
                style={{ backgroundColor: currentTheme.palette.surfaceMuted }}
              >
                {(['all', 'unisex', 'women', 'men'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveGender(g)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeGender === g
                        ? 'shadow-xs'
                        : 'text-neutral-700 hover:text-black'
                    }`}
                    style={
                      activeGender === g
                        ? {
                            backgroundColor: currentTheme.palette.accent,
                            color: currentTheme.palette.accentText,
                          }
                        : undefined
                    }
                  >
                    {g === 'all' ? 'All Pieces' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Strip (All 13 Ecommerce Categories) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-neutral-100">
              {(
                [
                  { label: 'All Categories', value: 'all' },
                  { label: 'Tops & Knitwear', value: 'tops' },
                  { label: 'Dresses', value: 'dresses' },
                  { label: 'Bottoms & Skirts', value: 'bottoms' },
                  { label: 'Co-Ords & Jumpsuits', value: 'co-ords' },
                  { label: 'Denim', value: 'denim' },
                  { label: 'Outerwear & Coats', value: 'outerwear' },
                  { label: 'Footwear', value: 'footwear' },
                  { label: 'Lingerie & Lounge', value: 'lingerie' },
                  { label: 'Activewear', value: 'activewear' },
                  { label: 'Bags', value: 'bags' },
                  { label: 'Jewellery & Watches', value: 'jewellery' },
                  { label: 'Accessories', value: 'accessories' },
                  { label: 'Beauty & Fragrance', value: 'beauty' },
                ] as const
              ).map((cat) => {
                const isActive = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                      isActive
                        ? 'border-transparent shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-black'
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: currentTheme.palette.accent,
                            color: currentTheme.palette.accentText,
                          }
                        : undefined
                    }
                  >
                    {cat.label}
                  </button>
                );
              })}
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

            {/* 4-Column Product Grid Matching PDF Anatomy */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-6">
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
            ) : (
              <div className="py-16 px-4 text-center bg-[#f8f6f2] rounded-xl border border-neutral-200/70">
                <p className="text-base font-bold text-neutral-900">No pieces match this filter</p>
                <p className="text-xs text-neutral-500 mt-1">Explore our full seasonal curation across unisex, women, and men edits.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveGender('all');
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-[#14362a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1d4a3a] transition-colors"
                >
                  View All Pieces
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Centered Editorial Wordmark matching Signature Footer */}
        <section className="w-full py-8 md:py-12">
          <div className="w-full px-4 text-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="text-[40px] md:text-[52px] font-black lowercase tracking-[-0.04em] hover:opacity-85 transition-opacity select-none cursor-pointer"
              style={{ color: currentTheme.palette.editorialWordmark }}
              aria-label="Back to top"
            >
              nilescart
            </button>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="bg-white border-t border-neutral-200 py-10 text-xs text-neutral-600">
        <div className="w-full px-4 sm:px-6 lg:px-10">
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
                <li><button onClick={() => { setActiveCategory('dresses'); scrollToForYou(); }} className="hover:text-black">Dresses & Co-Ords</button></li>
                <li><button onClick={() => { setActiveCategory('outerwear'); scrollToForYou(); }} className="hover:text-black">Outerwear & Denim</button></li>
                <li><button onClick={() => { setActiveCategory('footwear'); scrollToForYou(); }} className="hover:text-black">Footwear & Bags</button></li>
                <li><button onClick={() => { setActiveCategory('jewellery'); scrollToForYou(); }} className="hover:text-black">Jewellery & Beauty</button></li>
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

      {/* 9. Floating Buttons (Back to Top & Stylist - Positioned above mobile bottom bar) */}
      <div className="fixed bottom-20 md:bottom-6 right-3.5 sm:right-6 z-30 flex flex-col items-center gap-2.5">
        <button
          onClick={scrollToTop}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-800 hover:bg-neutral-50 transition-transform hover:-translate-y-0.5 active:scale-95"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>

        {/* Floating AI / Styling Assistant Pill Matching Screenshot Bottom-Right */}
        <button
          onClick={() => showToast('info', 'NILESCART Style Advisor', 'Ask our AI stylist for size & outfit recommendations!')}
          className="w-9 h-9 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform active:scale-95"
          aria-label="Style Assistant"
          title="NILESCART Styling Assistant"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* 10. Modals & Drawers */}
      <ProductDetailModal
        key={selectedProduct?.id ?? 'closed'}
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

      {/* Mobile Bottom Navigation Bar for Phones & Handhelds */}
      <MobileBottomNav
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCategories={() => setMobileMenuOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onGoHome={scrollToTop}
      />

      {/* Network Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
