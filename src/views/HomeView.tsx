import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Blog } from '../types';
import { 
  ArrowRight, Star, Leaf, Award, ShieldCheck, Heart, ShoppingCart, 
  Eye, Zap, Flame, Users, ShieldAlert, Sparkles, X, Gift, CheckCircle,
  ChevronLeft, ChevronRight, Percent, Lock, CreditCard, Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QuickViewModal from '../components/QuickViewModal';
import { AmazonStarRating } from '../components/AmazonStarRating';

interface HomeViewProps {
  navigate: (path: string) => void;
}

const premiumPosters = [
  {
    image: "https://raw.githubusercontent.com/mdtanjidul-hasan/Frame/main/WhatsApp%20Image%202026-07-01%20at%2011.35.12%20PM.jpeg",
    title: "Chandelia Shimmer",
    subtitle: "Concentric Silver Hoops",
    tag: "ROYAL EDITION",
    desc: "Oxidised silver dangling masterpieces adorned with multicolor aurora borealis rhinestones.",
    badge: "100% Sterling Silver",
    target: "/shop"
  },
  {
    image: "https://raw.githubusercontent.com/mdtanjidul-hasan/Frame/main/WhatsApp%20Image%202026-07-01%20at%2011.35.26%20PM.jpeg",
    title: "Symphony of Blue",
    subtitle: "Sapphire Crystal Choker",
    tag: "IMPERIAL COLLECTION",
    desc: "Cubic Zirconia pave framing magnificent deep-blue sapphire crystals of intense fire.",
    badge: "Exclusive Design",
    target: "/shop"
  },
  {
    image: "https://raw.githubusercontent.com/mdtanjidul-hasan/Frame/main/WhatsApp%20Image%202026-07-01%20at%2011.35.26%20PM%20(1).jpeg",
    title: "The Carbon Epoch",
    subtitle: "EcoFit Smart Wearables",
    tag: "EXQUISITE TECH",
    desc: "Combining high-performance sensor suites with lightweight, diamond-cut watch frames.",
    badge: "Aviation Grade",
    target: "/shop"
  },
  {
    image: "https://raw.githubusercontent.com/mdtanjidul-hasan/Frame/main/WhatsApp%20Image%202026-07-01%20at%2011.35.26%20PM%20(2).jpeg",
    title: "Luxe Timepieces & Gems",
    subtitle: "Modern Aesthetic Precision",
    tag: "PREMIUM SELECTION",
    desc: "Curated accessories showcasing brilliant craft, state-of-the-art materials, and style.",
    badge: "Elite Curation",
    target: "/shop"
  }
];

export const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const { products, blogs, addToCart, addToWishlist, wishlist, lang, currency, formatPrice } = useStore();

  const convertPrice = (bdtPrice: number) => {
    return formatPrice(bdtPrice);
  };

  const getOriginalPrice = (bdtPrice: number) => {
    return formatPrice(bdtPrice * 1.45);
  };

  // State managers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [visitorCount, setVisitorCount] = useState(54);
  const [recentNotification, setRecentNotification] = useState<{ name: string; location: string; product: string; time: string } | null>(null);

  // Translations matching Arabic, French, Spanish and English standard dropship requirements
  const t = {
    EN: {
      headline: 'Premium Jewelry & Gadget Deals',
      subheadline: 'Direct artisan deals, trending smart gadgets, jewelry combos, and home essentials with free shipping worldwide.',
      shopNow: 'Shop Super Deals',
      bestSellers: 'Best Sellers',
      flashSale: 'EXCLUSIVE DEALS',
      endsIn: 'Ends in',
      categoriesHeading: 'Best Categories',
      categoriesSub: 'Curated direct-from-manufacturer selections with massive price drops.',
      trendingHeading: 'Trending Products',
      trendingSub: 'Take a glance at our highest-converting global signature items.',
      whyUs: 'Direct Sourcing Advantage',
      artisanText: 'We partner directly with over 10,000+ top-tier global manufacturers to eliminate middleman margins, passing massive discounts directly down to you.',
      blogHeading: 'EcoBazar Fashion & Tech Guides',
      blogSub: 'Follow smart consumer hacks, product guides, and modern lifestyle trends.',
      recentlyViewed: 'Recently Viewed Collection',
      spendMore: 'Free shipping on all items! 90-day free returns.',
      hours: 'h', mins: 'm', secs: 's',
      hookBadge: 'SUPER DISCOUNT CODE CLAIM',
      hookHeading: 'Blink And You\'ll Miss Them! Grab Up to 90% OFF Now.',
      hookParagraph: 'Join millions of active smart shoppers on EcoBazar. Our logistics network guarantees fast tracked delivery directly to your doorstep. Don\'t overpay on secondary retail stores.',
      hookCTA: 'Claim Extra 90% OFF'
    },
    AR: {
      headline: 'اكتشف المنتجات التي تجعل الحياة أفضل',
      subheadline: 'الأدوات العصرية، الإكسسوارات الفاخرة، أساسيات المنزل، والمنتجات المبتكرة التي تُشحن عالميًا.',
      shopNow: 'تسوق الكتالوج الفاخر',
      bestSellers: 'الأكثر مبيعاً',
      flashSale: 'تخفيضات حصرية لفترة محدودة',
      endsIn: 'ينتهي في',
      categoriesHeading: 'الفئات المتميزة',
      categoriesSub: 'تشكيلات عالمية فاخرة ومصممة خصيصاً لتناسب أسلوب حياتك.',
      trendingHeading: 'الروائع الرائجة',
      trendingSub: 'ألقِ نظرة على منتجاتنا الفاخرة الأكثر مبيعاً وشهرةً عالمياً.',
      whyUs: 'بصمة إيكو بازار الفريدة',
      artisanText: 'نحن ننتقي أرقى المنتجات الخشبية المستدامة، وأحدث وسائل التكنولوجيا، والحلي الفضية المضادة للحساسية لحماية تألقك كوكبنا.',
      blogHeading: 'قصص ومقالات الموضة والتكنولوجيا',
      blogSub: 'تابع اتجاهات الحياة وتكنولوجيا المعيشة الذكية بقلم منسقي التصميم لدينا.',
      recentlyViewed: 'المنتجات التي تم الكشف عنها مؤخراً',
      spendMore: 'شحن مجاني عالمي للطلبات التي تزيد عن ١٠٠٠ ৳!',
      hours: 'ساعة', mins: 'دقيقة', secs: 'ثانية',
      hookBadge: '🔥 انتباه للعقول الواعية',
      hookHeading: '٩٩٪ من المنتجات الحديثة مصممة للفشل. لقد صنعنا الـ ١٪ التي ترتقي بأسلوب حياتك.',
      hookParagraph: 'تغمر معظم المنصات حياتك بمنتجات رخيصة ومنخفضة الجودة ومصممة لتنتهي في القمامة. إيكو بازار هو الثورة البديلة. نحن ننتقي بعناية تكنولوجيا فائقة، ومنتجات خشبية مستدامة، وحلي فضية فاخرة مضادة للحساسية. مصممة لتدوم وتفرض احترامها.',
      hookCTA: 'احصل على قطعة العمر الفاخرة'
    },
    FR: {
      headline: 'Découvrez des produits qui embellissent la vie',
      subheadline: 'Gadgets tendance, accessoires de mode, essentiels maison et innovations livrés dans le monde entier.',
      shopNow: 'Acheter le catalogue chic',
      bestSellers: 'Meilleures Ventes',
      flashSale: 'VENTE FLASH EXCLUSIVE',
      endsIn: 'Se termine dans',
      categoriesHeading: 'Catégories Premium',
      categoriesSub: 'Sélections de classe mondiale méticuleusement affinées pour votre style de vie.',
      trendingHeading: 'Chefs-d’œuvre Tendances',
      trendingSub: 'Jetez un œil à nos articles phares à conversion élevée dans le monde.',
      whyUs: 'La Signature EcoBazar',
      artisanText: 'Nous sélectionnons des boisés durables, de la technologie carbone de pointe et des bijoux hypoallergéniques pour préserver votre élégance et notre planète.',
      blogHeading: 'Histoires de Mode & de Technologie',
      blogSub: 'Suivez les tendances lifestyle et astuces intelligentes rédigées par nos experts du design.',
      recentlyViewed: 'Collection Consultée Récemment',
      spendMore: 'Livraison gratuite dans le monde à partir de 1 000 ৳!',
      hours: 'h', mins: 'm', secs: 's',
      hookBadge: '🔥 ATTENTION ESPRITS CONSCIENTS',
      hookHeading: '99% des produits modernes sont conçus pour échouer. Nous avons créé le 1% qui élève.',
      hookParagraph: 'La plupart des plateformes inondent votre vie de produits jetables bas de gamme destinés à la décharge. EcoBazar est la contre-culture. Nous sélectionnons des technologies aérospatiales, des boiseries durables et des bijoux en argent hypoallergéniques. Conçus pour durer. Conçus pour inspirer le respect.',
      hookCTA: 'Commandez Votre Pièce d’Exception'
    },
    ES: {
      headline: 'Descubre productos que mejoran tu vida',
      subheadline: 'Dispositivos de tendencia, accesorios de diseño, el hogar y artículos innovadores enviados a todo el mundo.',
      shopNow: 'Comprar Catálogo de Lujo',
      bestSellers: 'Más Vendidos',
      flashSale: 'VENTA FLASH EXCLUSIVA',
      endsIn: 'Termina en',
      categoriesHeading: 'Categorías Premium',
      categoriesSub: 'Selecciones de clase mundial meticulosamente refinadas para tu estilo de vida.',
      trendingHeading: 'Obras Maestras Populares',
      trendingSub: 'Echa un vistazo a nuestros artículos insignia de alta conversión global.',
      whyUs: 'La Firma EcoBazar',
      artisanText: 'Curamos maderas sostenibles premium, tecnología de carbono aeroespacial y joyas de plata hipoalergénicas para proteger tu estilo y la Tierra.',
      blogHeading: 'Historias de Tendencias y Tecnología',
      blogSub: 'Sigue el estilo de vida y guías de domótica escritas por nuestros curadores de diseño.',
      recentlyViewed: 'Colección Vista Recientemente',
      spendMore: '¡Envío gratis mundial en pedidos superiores a ৳1,000!',
      hours: 'h', mins: 'm', secs: 's',
      hookBadge: '🔥 ATENCIÓN MENTES CONSCIENTES',
      hookHeading: 'El 99% de los productos modernos están diseñados para fallar. Creamos el 1% que te eleva.',
      hookParagraph: 'La mayoría de las plataformas inundan tu vida con baratijas desechables diseñadas para el vertedero. EcoBazar es la contracultura. Curamos tecnología aeroespacial, artesanías de madera sostenible y joyas de plata hipoalergénicas. Hecho para durar. Diseñado para imponer respeto.',
      hookCTA: 'Reclama Tu Pieza de Colección'
    }
  }[lang] || {
    headline: 'Premium Jewelry & Gadget Deals',
    subheadline: 'Direct artisan deals, trending smart gadgets, jewelry combos, and home essentials with free shipping worldwide.',
    shopNow: 'Shop Super Deals',
    bestSellers: 'Best Sellers',
    flashSale: 'EXCLUSIVE DEALS',
    endsIn: 'Ends in',
    categoriesHeading: 'Best Categories',
    categoriesSub: 'Curated direct-from-manufacturer selections with massive price drops.',
    trendingHeading: 'Trending Products',
    trendingSub: 'Take a glance at our highest-converting global signature items.',
    whyUs: 'Direct Sourcing Advantage',
    artisanText: 'We partner directly with over 10,000+ top-tier global manufacturers to eliminate middleman margins, passing massive discounts directly down to you.',
    blogHeading: 'EcoBazar Fashion & Tech Guides',
    blogSub: 'Follow smart consumer hacks, product guides, and modern lifestyle trends.',
    recentlyViewed: 'Recently Viewed Collection',
    spendMore: 'Free shipping on all items! 90-day free returns.',
    hours: 'h', mins: 'm', secs: 's',
    hookBadge: 'SUPER DISCOUNT CODE CLAIM',
    hookHeading: 'Blink And You\'ll Miss Them! Grab Up to 90% OFF Now.',
    hookParagraph: 'Join millions of active smart shoppers on EcoBazar. Our logistics network guarantees fast tracked delivery directly to your doorstep. Don\'t overpay on secondary retail stores.',
    hookCTA: 'Claim Extra 90% OFF'
  };

  // Selected products for hero/spotlight
  const bestSellerProducts = products.filter(p => p.rating >= 4.7).slice(0, 8);
  const latestBlogs = blogs.slice(0, 3);

  // Reference and scroll utility for Best Sellers horizontal scroll section
  const bestSellersScrollRef = useRef<HTMLDivElement>(null);
  const scrollBestSellers = (direction: 'left' | 'right') => {
    if (bestSellersScrollRef.current) {
      const { scrollLeft, clientWidth } = bestSellersScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      bestSellersScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Premium auto-scrolling poster carousel state
  const [posterIndex, setPosterIndex] = useState(0);

  // Auto-scrolling interval: slide transition every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPosterIndex(prev => (prev + 1) % premiumPosters.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [posterIndex]);

  // Touch Swipe Gesture Support for mobile devices
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    // Require minimum 50px swipe distance
    if (diff > 50) {
      // Swipe left -> Next slide
      setPosterIndex(prev => (prev + 1) % premiumPosters.length);
    } else if (diff < -50) {
      // Swipe right -> Previous slide
      setPosterIndex(prev => (prev - 1 + premiumPosters.length) % premiumPosters.length);
    }
    setTouchStartX(null);
  };

  const prevSlide = () => {
    setPosterIndex(prev => (prev - 1 + premiumPosters.length) % premiumPosters.length);
  };

  const nextSlide = () => {
    setPosterIndex(prev => (prev + 1) % premiumPosters.length);
  };

  // Exit Intent Popup Checker
  useEffect(() => {
    const handleMouseLeaveGlobal = (e: MouseEvent) => {
      if (e.clientY < 15) {
        const dismissed = localStorage.getItem('eb_dismissed_exit_coupon');
        if (!dismissed) {
          setShowExitIntent(true);
        }
      }
    };
    document.addEventListener('mouseleave', handleMouseLeaveGlobal);
    return () => document.removeEventListener('mouseleave', handleMouseLeaveGlobal);
  }, []);

  // Simulated live shopper visitors counter
  useEffect(() => {
    const visitorInterval = setInterval(() => {
      setVisitorCount(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = prev + delta;
        return next > 35 && next < 120 ? next : 55;
      });
    }, 4500);
    return () => clearInterval(visitorInterval);
  }, []);

  // Simulated live purchase popup for high trust converts
  useEffect(() => {
    const names = ['Michael', 'Sophia', 'Olivia', 'James', 'Lucas', 'Emma', 'Amira', 'Jean-Pierre', 'Alejandro', 'Gabriel'];
    const cities = ['New York, US', 'London, UK', 'Toronto, CA', 'Sydney, AU', 'Paris, FR', 'Dubai, AE', 'Madrid, ES', 'Chicago, US'];
    const items = [
      'EcoFit Carbon Premium Smart Watch',
      'EcoBuds Active Noise Cancelling Wireless Earbuds',
      'EcoGlow Jade Facial Quartz Massager',
      'Multicolor Enamel Leaf Stack Jhumka Earrings',
      'EcoFlask Double-Walled Thermal Water Bottle',
      'EcoPro Non-Slip TPE Alignment Yoga Mat'
    ];

    const generatePurchase = () => {
      const rName = names[Math.floor(Math.random() * names.length)];
      const rCity = cities[Math.floor(Math.random() * cities.length)];
      const rItem = items[Math.floor(Math.random() * items.length)];
      setRecentNotification({
        name: rName,
        location: rCity,
        product: rItem,
        time: 'Just now'
      });

      // Clear after 6 seconds
      setTimeout(() => {
        setRecentNotification(null);
      }, 6000);
    };

    // First trigger 8s after load, then every 22s
    const triggerTimeout = setTimeout(() => {
      generatePurchase();
    }, 8000);

    const purchaseInterval = setInterval(generatePurchase, 22000);

    return () => {
      clearTimeout(triggerTimeout);
      clearInterval(purchaseInterval);
    };
  }, []);

  // Categories grid to support 6 standard luxury items
  const luxeCategories = [
    { title: 'Smart Gadgets', count: products.filter(p => p.category === 'Smart Gadgets').length, desc: 'Innovative futuristic utilities & micro-fans', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=80' },
    { title: 'Fashion Accessories', count: products.filter(p => p.category === 'Fashion Accessories').length, desc: 'Luxury earrings, sets & designer jewelry', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80' },
    { title: 'Home & Kitchen', count: products.filter(p => p.category === 'Home & Kitchen').length, desc: 'Sleek wood storage decor & travel thermal flasks', image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=500&auto=format&fit=crop&q=80' },
    { title: 'Beauty & Personal Care', count: products.filter(p => p.category === 'Beauty & Personal Care').length, desc: 'LED vanity mirrors & quartz rollers', image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=500&auto=format&fit=crop&q=80' },
    { title: 'Pet Products', count: products.filter(p => p.category === 'Pet Products').length, desc: 'Memory foam beds & smart automatic feeders', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80' },
    { title: 'Fitness Products', count: products.filter(p => p.category === 'Fitness Products').length, desc: 'Recovery massage guns & alignment mats', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80' }
  ];

  // Recently Viewed Collection
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  useEffect(() => {
    try {
      const savedIds = JSON.parse(localStorage.getItem('eb_recently_viewed') || '[]') as string[];
      if (savedIds.length > 0) {
        const found = savedIds
          .map(id => products.find(p => p._id === id))
          .filter((p): p is Product => !!p)
          .slice(0, 4);
        setRecentlyViewed(found);
      }
    } catch (e) {
      console.error("Failed to load viewed products history", e);
    }
  }, [products]);

  return (
    <div className="space-y-8 md:space-y-10 pb-16 overflow-x-hidden">







      {/* Hero Section */}
      {/* Premium Full-Width Auto-Scrolling Carousel Hero */}
      <section 
        id="premium-carousel-hero"
        className="relative w-screen left-1/2 -translate-x-1/2 h-[200px] aspect-[21/9] sm:h-[300px] sm:aspect-auto lg:h-[480px] overflow-hidden bg-slate-950 group m-0 p-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Container */}
        <div 
          className="flex w-full h-full"
          style={{ transform: `translateX(-${posterIndex * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {premiumPosters.map((poster, idx) => (
            <div key={idx} className="w-full h-full shrink-0 relative">
              <img 
                src={poster.image} 
                alt={poster.title} 
                className="w-full h-full object-cover object-center select-none"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
              {/* Premium dark vignette gradient overlay for high text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 text-white text-left">
                <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl space-y-1 sm:space-y-2 md:space-y-4">
                  <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-[#1ABC9C]/90 backdrop-blur-sm border border-teal-500/30 rounded-full text-[8px] sm:text-[10px] md:text-xs font-black tracking-widest text-[#00B894] uppercase shadow-sm">
                    {poster.tag}
                  </span>
                  <h1 className="font-display text-base sm:text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                    {poster.title}
                  </h1>
                  <p className="text-gray-200 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium leading-relaxed drop-shadow-sm line-clamp-2 max-w-sm sm:max-w-md md:max-w-lg">
                    {poster.desc}
                  </p>
                  <div className="pt-1 sm:pt-2">
                    <button
                      onClick={() => navigate(poster.target)}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-[#008D7F] to-[#1ABC9C] hover:opacity-95 text-white font-extrabold text-[9px] sm:text-[11px] md:text-xs rounded-lg shadow-lg transition-transform duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 md:gap-2 uppercase tracking-wider"
                    >
                      <span>View Collection</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow Button (44x44px teal circle, visible on desktop, hidden on mobile) */}
        <button
          onClick={() => setPosterIndex(prev => (prev - 1 + premiumPosters.length) % premiumPosters.length)}
          className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1ABC9C]/20 hover:bg-[#1ABC9C] border border-[#1ABC9C]/40 text-white items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer hover:scale-105 z-20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Right Arrow Button (44x44px teal circle, visible on desktop, hidden on mobile) */}
        <button
          onClick={() => setPosterIndex(prev => (prev + 1) % premiumPosters.length)}
          className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1ABC9C]/20 hover:bg-[#1ABC9C] border border-[#1ABC9C]/40 text-white items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer hover:scale-105 z-20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Teal Dot Indicators at the bottom center */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-25">
          {premiumPosters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPosterIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                posterIndex === idx 
                  ? 'bg-[#1ABC9C] w-6' 
                  : 'bg-[#1ABC9C]/40 hover:bg-[#1ABC9C]/60 w-2'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="max-w-4xl mx-auto px-4 mt-2 mb-2">
        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-150/60 dark:border-zinc-800 rounded-lg py-1.5 px-3 flex flex-wrap justify-center sm:justify-between items-center gap-x-4 gap-y-2 text-slate-500 text-[9.5px] font-bold">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
            <span className="text-[#1E293B] dark:text-gray-200">100% Secure Checkout</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="text-[#1E293B] dark:text-gray-200">Fast Worldwide Shipping</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Award className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
            <span className="text-[#1E293B] dark:text-gray-200">Premium Quality Sourced</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="text-[#1E293B] dark:text-gray-200">30 Days Easy Returns</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Users className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
            <span className="text-[#1E293B] dark:text-gray-200">24/7 Dedicated Support</span>
          </div>
        </div>
      </section>

      {/* Categories Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="font-display text-base sm:text-lg md:text-xl font-extrabold text-[#1E293B] dark:text-gray-150 uppercase tracking-wider">
            {t.categoriesHeading}
          </h2>
          <div className="w-10 h-0.5 bg-[#00B894] mx-auto rounded-full"></div>
          <p className="text-slate-400 dark:text-gray-400 text-[10px] sm:text-xs font-semibold leading-relaxed">{t.categoriesSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {luxeCategories.map((cat, idx) => (
            <motion.div
              whileHover={{ y: -6 }}
              key={idx}
              onClick={() => {
                localStorage.setItem('eb_selected_category', cat.title);
                navigate('/shop');
              }}
              className="group bg-white rounded-[24px] overflow-hidden border border-slate-150 shadow-sm hover:shadow-md cursor-pointer relative"
            >
              <div className="h-64 overflow-hidden relative bg-slate-50">
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Elegant Glass Card Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/65 via-[#1E293B]/20 to-transparent flex flex-col justify-end p-6">
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center text-white">
                      <h3 className="font-display font-extrabold text-lg tracking-wide group-hover:text-[#00B894] transition">
                        {cat.title}
                      </h3>
                      <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                        {cat.count} curated
                      </span>
                    </div>
                    <p className="text-white/80 text-[11px] font-medium leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section id="best-sellers-section" className="max-w-7xl mx-auto px-4 sm:px-12 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
          <div className="text-left space-y-1">
            <h2 className="font-display text-base sm:text-lg md:text-xl font-extrabold text-[#1E293B] dark:text-gray-150 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span>{t.bestSellers}</span>
            </h2>
            <div className="w-10 h-0.5 bg-[#D4AF37] rounded-full"></div>
            <p className="text-slate-400 dark:text-gray-400 text-[10px] sm:text-xs font-semibold">{t.trendingSub}</p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end shrink-0">
            <button
              onClick={() => navigate('/shop')}
              className="px-3.5 py-1.5 bg-slate-50 dark:bg-zinc-900 text-[10px] sm:text-xs font-bold text-[#00B894] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-all duration-300 border border-slate-200 dark:border-zinc-800 hover:border-emerald-100 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Browse Complete Stock</span>
              <ArrowRight className="w-3 h-3 text-[#00B894]" />
            </button>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollBestSellers('left')}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-gray-300 flex items-center justify-center transition shadow-sm active:scale-95 cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollBestSellers('right')}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-gray-300 flex items-center justify-center transition shadow-sm active:scale-95 cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Smooth Horizontally Scrolling Layout */}
        <div 
          ref={bestSellersScrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 px-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        >
          {bestSellerProducts.map((p) => {
            const hasWish = wishlist.some(item => item._id === p._id);
            const originalPrice = Math.round(p.price / 0.75);
            const savedAmount = originalPrice - p.price;

            return (
              <div
                key={p._id}
                className="product-card-container snap-start w-[290px] sm:w-[325px] shrink-0 bg-white border border-slate-150 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col relative group"
              >
                {/* 1. Discount Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md z-10">
                  25% OFF
                </div>

                {/* Floating Heart (Wishlist) Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(p);
                  }}
                  className={`absolute top-4 right-4 w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md z-10 transition duration-200 transform hover:scale-110 active:scale-90 ${
                    hasWish ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-400 hover:text-rose-500 backdrop-blur-sm'
                  }`}
                >
                  <Heart className="w-5.5 h-5.5 sm:w-4.5 sm:h-4.5" fill={hasWish ? 'currentColor' : 'none'} />
                </button>

                {/* 2. Product Image Container */}
                <div 
                  onClick={() => navigate(`/product/${p._id}`)} 
                  className="h-56 overflow-hidden bg-slate-50 cursor-pointer relative"
                >
                  <img
                    src={p.gallery[0]}
                    alt={p.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Quick View Cover Trigger */}
                  <div className="absolute inset-0 bg-[#1E293B]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(p); }}
                      className="pointer-events-auto px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 hover:text-[#008D7F] text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Specifications & Content */}
                <div className="p-5 flex-1 flex flex-col text-left space-y-3.5">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-[#008D7F] uppercase tracking-widest bg-emerald-50/70 px-2.5 py-1 rounded-md border border-emerald-100/50">
                      {p.category}
                    </span>
                    {/* 3. Title */}
                    <h3 
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="font-display font-extrabold text-sm text-[#1E293B] line-clamp-2 hover:text-[#008D7F] cursor-pointer mt-1 leading-snug"
                    >
                      {p.title}
                    </h3>
                  </div>

                  {/* 4. Rating */}
                  <div className="pt-1">
                    <AmazonStarRating
                      productId={p._id}
                      rating={p.rating || 4.8}
                      price={p.price}
                      size="md"
                    />
                  </div>

                  {/* 5. Price Breakdown */}
                  <div className="pt-2.5 border-t border-slate-100 flex flex-col space-y-0.5 mt-auto">
                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-black">Price Breakdown</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-400 line-through font-extrabold">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="font-display font-black text-base text-emerald-600">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                    <div className="text-[10px] font-extrabold text-emerald-600">
                      You save {formatPrice(savedAmount)} (25% Off)
                    </div>
                  </div>

                  {/* 6. Call-To-Action (CTA) Buttons */}
                  <div className="pt-2 grid grid-cols-2 gap-2 mt-auto">
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-[9.5px] uppercase tracking-wider rounded-xl transition duration-300 flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-emerald-600/10"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-white" />
                      <span>{lang === 'EN' ? 'Add To Cart' : lang === 'AR' ? 'إضافة للسلة' : 'Ajouter'}</span>
                    </button>
                    <button
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#008D7F] border border-slate-200 font-extrabold text-[9.5px] uppercase tracking-wider rounded-xl transition cursor-pointer text-center"
                    >
                      <span>{lang === 'EN' ? 'Details' : lang === 'AR' ? 'تفاصيل' : 'Détails'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Elegant Branding Banner (High Design Aesthetic) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-12">
        <div className="bg-gradient-to-r from-slate-900 to-slate-850 rounded-[32px] overflow-hidden p-8 sm:p-16 text-left relative shadow-xl border border-slate-800">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-[85px] pointer-events-none"></div>
          
          <div className="max-w-2xl relative z-10 space-y-6">
            <span className="text-[11px] tracking-widest text-[#D4AF37] font-extrabold uppercase bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              {t.whyUs}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white font-extrabold leading-tight">
              Sustainable Luxury & Modern Smart Utilities
            </h2>
            <p className="text-slate-350 text-sm sm:text-base leading-relaxed font-medium">
              {t.artisanText}
            </p>
            <div className="pt-4 flex gap-4">
              <button
                onClick={() => navigate('/about')}
                className="px-6 py-3 bg-[#00B894] hover:bg-[#008D7F] text-white font-extrabold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
              >
                Learn Our Philosophy
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 bg-white/5 border border-white/15 hover:border-white/20 text-white font-extrabold rounded-xl transition"
              >
                Speak to Designers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Review Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-display text-3xl font-extrabold text-[#1E293B] uppercase tracking-wide">
            Loved By Shoppers Worldwide
          </h2>
          <div className="w-16 h-1 bg-[#00B894] mx-auto rounded-full"></div>
          <p className="text-slate-500 text-sm font-medium">Read true reviews from verified direct delivery customers across our dropship channels.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col text-left space-y-4">
            <div className="flex gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
            </div>
            <p className="text-slate-600 text-sm italic font-medium leading-relaxed flex-1">
              "The EcoBuds came elegantly boxed! Active noise cancellation feels exactly on par with high-end designer brands. Extremely fast transit times to Canada."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50">
              <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden font-bold flex items-center justify-center text-xs text-slate-700">
                CL
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1E293B] flex items-center gap-1.5">
                  Claire L. 
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Verified Buyer</span>
                </h4>
                <p className="text-[10px] text-slate-400">Toronto, Canada</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col text-left space-y-4">
            <div className="flex gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
            </div>
            <p className="text-slate-600 text-sm italic font-medium leading-relaxed flex-1">
              "I purchased the EcoFit Watch and the multi-color enamel drop earrings. Phenomenal craftsmanship on the enamel earrings, and the battery life on the smartwatch easily passes two full weeks!"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50">
              <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden font-bold flex items-center justify-center text-xs text-slate-700">
                AR
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1E293B] flex items-center gap-1.5">
                  Alejandro R.
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Verified Buyer</span>
                </h4>
                <p className="text-[10px] text-slate-400">Madrid, Spain</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col text-left space-y-4">
            <div className="flex gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
              <Star className="w-4 h-4 fill-amber-450" />
            </div>
            <p className="text-slate-600 text-sm italic font-medium leading-relaxed flex-1">
              "Hands down the best dropship store experience. Transparent shipping calculator, secure gateway, and excellent customer support team assisting with questions within minutes."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50">
              <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden font-bold flex items-center justify-center text-xs text-slate-700">
                MS
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1E293B] flex items-center gap-1.5">
                  Marcus S.
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Verified Buyer</span>
                </h4>
                <p className="text-[10px] text-slate-400">London, United Kingdom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Editorial Stories / Blog Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-12 space-y-12">
        <div className="flex justify-between items-end border-b border-slate-150 pb-5">
          <div className="text-left space-y-2">
            <h2 className="font-display text-3xl font-extrabold text-[#1E293B] uppercase tracking-wide">
              {t.blogHeading}
            </h2>
            <p className="text-slate-500 text-sm font-medium">{t.blogSub}</p>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="text-xs font-extrabold text-[#00B894] hover:text-[#008D7F] transition flex items-center gap-1 shrink-0"
          >
            <span>Read Editorial Journal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-slate-150 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col text-left group cursor-pointer"
              onClick={() => navigate(`/single-blog/${b._id}`)}
            >
              <div className="h-52 overflow-hidden bg-slate-100">
                <img
                  src={b.image}
                  alt={b.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-[#00B894] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase">
                    {b.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#1E293B] mt-3 group-hover:text-[#00B894] transition line-clamp-2">
                    {b.title}
                  </h3>
                </div>
                
                <p className="text-xs text-slate-400 font-medium line-clamp-3 leading-relaxed">
                  {b.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#1E293B]/70 font-bold border-t border-slate-50 pt-4 mt-auto">
                  <span>Curator {b.authorname || b.author}</span>
                  <span>{b.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal Popup */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        navigate={navigate}
      />

      {/* Exit Intent Coupon Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowExitIntent(false);
                localStorage.setItem('eb_dismissed_exit_coupon', 'true');
              }}
              className="absolute inset-0 bg-[#1E293B]/85 backdrop-blur-sm"
            ></motion.div>

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full p-8 relative z-10 shadow-2xl border border-slate-100 text-center space-y-6"
            >
              {/* Close button */}
              <button
                onClick={() => {
                  setShowExitIntent(false);
                  localStorage.setItem('eb_dismissed_exit_coupon', 'true');
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#00B894] flex items-center justify-center mx-auto text-3xl font-bold">
                <Gift className="w-8 h-8 animate-bounce text-[#00B894]" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] tracking-widest text-[#D4AF37] font-extrabold uppercase bg-[#D4AF37]/5 px-3 py-1 rounded-full">
                  Wait, don't leave empty-handed!
                </span>
                <h3 className="font-display font-extrabold text-2xl text-[#1E293B]">
                  Unlock extra 10% discount on first purchase
                </h3>
                <p className="text-xs text-slate-450 font-medium">
                  Use this exclusive one-time luxury voucher code at checkout to claim premium reduction.
                </p>
              </div>

              {/* Coupon Box */}
              <div className="border border-dashed border-[#00B894]/50 bg-emerald-50/20 p-4.5 rounded-2xl">
                <code className="text-xl font-black text-[#00B894] tracking-widest font-mono">ECOBAZAR10</code>
                <p className="text-[10px] text-[#00B894] font-bold mt-1.5 uppercase">Applies over any delivery choice</p>
              </div>

              <button
                onClick={() => {
                  setShowExitIntent(false);
                  localStorage.setItem('eb_dismissed_exit_coupon', 'true');
                  navigate('/shop');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#00B894] to-[#008D7F] hover:from-[#008D7F] hover:to-[#00B894] text-white font-extrabold rounded-xl transition shadow-lg text-xs uppercase tracking-wider"
              >
                Claim Luxury Discount
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Live Transaction Notification Popups */}
      <AnimatePresence>
        {recentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -30, y: 20 }}
            className="fixed bottom-6 left-6 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4.5 rounded-[20px] shadow-2xl border border-slate-200 text-left max-w-sm flex items-center gap-3.5"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-500 fill-emerald-100 font-bold">
              <CheckCircle className="w-6 h-6 text-[#00B894]" />
            </div>
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {recentNotification.name} from {recentNotification.location}
              </p>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Purchased <span className="font-extrabold text-[#00B894]">{recentNotification.product}</span>
              </p>
              <span className="text-[9px] text-[#D4AF37] font-extrabold uppercase tracking-wide">
                {recentNotification.time}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
