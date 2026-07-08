import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Blog } from '../types';
import { 
  ArrowRight, Star, Leaf, Award, ShieldCheck, Heart, ShoppingCart, 
  Eye, Zap, Flame, Users, ShieldAlert, Sparkles, X, Gift, CheckCircle,
  ChevronLeft, ChevronRight, Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QuickViewModal from '../components/QuickViewModal';

interface HomeViewProps {
  navigate: (path: string) => void;
}

const premiumPosters = [
  {
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    title: "Chandelia Shimmer",
    subtitle: "Concentric Silver Hoops",
    tag: "ROYAL EDITION",
    desc: "Oxidised silver dangling masterpieces adorned with multicolor aurora borealis rhinestones.",
    badge: "100% Sterling Silver",
    target: "/shop"
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    title: "Symphony of Blue",
    subtitle: "Sapphire Crystal Choker",
    tag: "IMPERIAL COLLECTION",
    desc: "Cubic Zirconia pave framing magnificent deep-blue sapphire crystals of intense fire.",
    badge: "Exclusive Design",
    target: "/shop"
  },
  {
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80",
    title: "The Carbon Epoch",
    subtitle: "EcoFit Smart Wearables",
    tag: "EXQUISITE TECH",
    desc: "Combining high-performance sensor suites with lightweight, diamond-cut watch frames.",
    badge: "Aviation Grade",
    target: "/shop"
  },
  {
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&q=80",
    title: "Botanical Serenity",
    subtitle: "Glow Jade Facial Quartz",
    tag: "NATURAL THERAPEUTICS",
    desc: "Sculpted from selected mineral jadeite to enrich skin vibrancy and holistic wellness.",
    badge: "Certified Mineral",
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
      headline: '⚡️ Shop Like a Billionaire!',
      subheadline: 'Direct factory outlet deals, trending smart gadgets, jewelry combos, and home essentials with free shipping worldwide.',
      shopNow: 'Shop Super Deals',
      bestSellers: 'Best Sellers',
      flashSale: '⚡️ TEMU LIGHTNING DEALS',
      endsIn: 'Ends in',
      categoriesHeading: 'Best Categories',
      categoriesSub: 'Curated direct-from-manufacturer selections with massive price drops.',
      trendingHeading: 'Lightning Deals Grid',
      trendingSub: 'Take a glance at our highest-converting global signature items.',
      whyUs: 'Direct Sourcing Advantage',
      artisanText: 'We partner directly with over 10,000+ top-tier global manufacturers to eliminate middleman margins, passing massive discounts directly down to you.',
      blogHeading: 'Temu Fashion & Tech Guides',
      blogSub: 'Follow smart consumer hacks, product guides, and modern lifestyle trends.',
      recentlyViewed: 'Recently Viewed Collection',
      spendMore: 'Free shipping on all items! 90-day free returns.',
      hours: 'h', mins: 'm', secs: 's',
      hookBadge: '⚡️ SUPER DISCOUNT CODE CLAIM',
      hookHeading: 'Blink And You\'ll Miss Them! Grab Up to 90% OFF Now.',
      hookParagraph: 'Join millions of active smart shoppers on Temu. Our logistics network guarantees lightning-fast tracked delivery directly to your doorstep. Don\'t overpay on secondary retail stores.',
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
    headline: '⚡️ Shop Like a Billionaire!',
    subheadline: 'Direct factory outlet deals, trending smart gadgets, jewelry combos, and home essentials with free shipping worldwide.',
    shopNow: 'Shop Super Deals',
    bestSellers: 'Best Sellers',
    flashSale: '⚡️ TEMU LIGHTNING DEALS',
    endsIn: 'Ends in',
    categoriesHeading: 'Best Categories',
    categoriesSub: 'Curated direct-from-manufacturer selections with massive price drops.',
    trendingHeading: 'Lightning Deals Grid',
    trendingSub: 'Take a glance at our highest-converting global signature items.',
    whyUs: 'Direct Sourcing Advantage',
    artisanText: 'We partner directly with over 10,000+ top-tier global manufacturers to eliminate middleman margins, passing massive discounts directly down to you.',
    blogHeading: 'Temu Fashion & Tech Guides',
    blogSub: 'Follow smart consumer hacks, product guides, and modern lifestyle trends.',
    recentlyViewed: 'Recently Viewed Collection',
    spendMore: 'Free shipping on all items! 90-day free returns.',
    hours: 'h', mins: 'm', secs: 's',
    hookBadge: '⚡️ SUPER DISCOUNT CODE CLAIM',
    hookHeading: 'Blink And You\'ll Miss Them! Grab Up to 90% OFF Now.',
    hookParagraph: 'Join millions of active smart shoppers on Temu. Our logistics network guarantees lightning-fast tracked delivery directly to your doorstep. Don\'t overpay on secondary retail stores.',
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

  // Dynamic ticking countdown banner
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scrolling featured products inside the right corner marketing section
  const [featuredIndex, setFeaturedIndex] = useState(0);
  useEffect(() => {
    if (!products || products.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % Math.min(products.length, 6));
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

  // Premium auto-scrolling poster frames
  const [posterIndex, setPosterIndex] = useState(0);
  const [isPosterAutoplay, setIsPosterAutoplay] = useState(true);
  useEffect(() => {
    if (!isPosterAutoplay) return;
    const interval = setInterval(() => {
      setPosterIndex(prev => (prev + 1) % premiumPosters.length);
    }, 4500); // 4.5 seconds per poster
    return () => clearInterval(interval);
  }, [isPosterAutoplay]);

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

      {/* Top Banner Notice - High-Impact 25% Off Discount Product Spotlight (Replaces Free Shipping Banner) */}
      {products && products.length > 0 && (() => {
        const discountProduct = products[1] || products[0];
        const originalPrice = Math.round(discountProduct.price / 0.75);
        const savedAmount = originalPrice - discountProduct.price;

        return (
          <div className="px-4 sm:px-8 mt-4 max-w-7xl mx-auto">
            <motion.div
              id="exclusive-discount-spotlight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-emerald-500/15 via-teal-500/5 to-transparent dark:from-emerald-950/25 dark:via-teal-950/10 backdrop-blur-md border border-emerald-500/35 dark:border-emerald-500/20 shadow-[0_12px_40px_rgba(16,185,129,0.08)] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              {/* Background abstract glowing shapes */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
              <div className="absolute top-1/2 right-12 -translate-y-1/2 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Left Column: Product Image & Floating Tag */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto relative z-10">
                <div 
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 border border-emerald-500/25 shadow-md flex-shrink-0 cursor-pointer group"
                  onClick={() => navigate(`/product/${discountProduct._id}`)}
                >
                  <img
                    src={discountProduct.gallery?.[0]}
                    alt={discountProduct.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-1 left-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm">
                    25% OFF
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[8.5px] font-extrabold tracking-wider uppercase">
                      <Percent className="w-2.5 h-2.5" />
                      {lang === 'EN' ? 'HOT SPOTLIGHT DEAL' : 
                       lang === 'AR' ? 'عرض مذهل' : 
                       lang === 'FR' ? 'OFFRE CHOC' : 'OFERTA DESTACADA'}
                    </span>
                    <span className="text-[8.5px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">
                      {discountProduct.category}
                    </span>
                  </div>

                  <h3 
                    className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 transition cursor-pointer leading-snug line-clamp-2 max-w-md"
                    onClick={() => navigate(`/product/${discountProduct._id}`)}
                  >
                    {discountProduct.title}
                  </h3>

                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-600">
                    <div className="flex items-center text-emerald-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < Math.floor(discountProduct.rating) 
                              ? 'fill-emerald-400 text-emerald-400' 
                              : 'text-gray-300 dark:text-gray-700'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                      ({discountProduct.rating} / 5.0)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Purchase Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end relative z-10 border-t border-dashed border-gray-200 dark:border-zinc-800 md:border-0 pt-3 md:pt-0">
                <div className="text-center sm:text-right space-y-0.5">
                  <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">
                    {lang === 'EN' ? 'LIMITED OFFER PRICE' : 
                     lang === 'AR' ? 'سعر العرض المحدود' : 
                     lang === 'FR' ? 'PRIX DE L\'OFFRE' : 'PRECIO DE OFERTA'}
                  </div>
                  <div className="flex items-baseline justify-center sm:justify-end gap-2">
                    <span className="text-xs text-gray-400 line-through font-extrabold">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-xl sm:text-2xl font-display font-black text-emerald-600">
                      {formatPrice(discountProduct.price)}
                    </span>
                  </div>
                  <div className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">
                    {lang === 'EN' ? `You save ${formatPrice(savedAmount)} (25% Off)` : 
                     lang === 'AR' ? `وفرت ${formatPrice(savedAmount)} (خصم ٢٥٪)` : 
                     lang === 'FR' ? `Économisez ${formatPrice(savedAmount)}` : `Ahorras ${formatPrice(savedAmount)} (25% Dto)`}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[140px]">
                  <button
                    onClick={() => {
                      addToCart(discountProduct, 1);
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    {lang === 'EN' ? 'Add To Cart' : 
                     lang === 'AR' ? 'أضف إلى السلة' : 
                     lang === 'FR' ? 'Ajouter au panier' : 'Añadir al Carrito'}
                  </button>
                  <button
                    onClick={() => navigate(`/product/${discountProduct._id}`)}
                    className="w-full px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-[9px] uppercase tracking-wider rounded-md transition text-center cursor-pointer"
                  >
                    {lang === 'EN' ? 'View Details' : 
                     lang === 'AR' ? 'عرض التفاصيل' : 
                     lang === 'FR' ? 'Voir les détails' : 'Ver Detalles'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* HIGH-IMPACT MARKETING HOOK SECTION: HEATS THE HUMAN BRAIN */}
      <section className="px-4 max-w-4xl mx-auto mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-[#0B2521] to-zinc-950 text-white border border-teal-500/20 shadow-[0_6px_20px_rgba(0,141,127,0.1)] p-3 md:p-3.5"
        >
          {/* Futuristic mesh gradient light circles - smaller */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#00B894]/8 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-[60px] pointer-events-none" />
          
          {/* Dotted grid decorative texture */}
          <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            
            {/* Hook Left Copywriting block */}
            <div className="lg:col-span-9 space-y-1.5 text-left">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-teal-500/15 to-emerald-500/15 border border-teal-500/30 text-teal-300/90 rounded-full text-[6.5px] md:text-[7px] font-black tracking-wider uppercase">
                <Flame className="w-1.5 h-1.5 fill-amber-400 text-amber-400 animate-bounce shrink-0" />
                {t.hookBadge}
              </span>
              
              <h2 className="font-display text-sm sm:text-base font-extrabold text-white leading-tight tracking-tight">
                {t.hookHeading.split('.').slice(0, 1).join('')}.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-[#D4AF37]">
                  {t.hookHeading.split('.').slice(1).join('')}
                </span>
              </h2>

              <p className="text-gray-400 text-[10px] leading-relaxed max-w-2xl">
                {t.hookParagraph}
              </p>

              <div className="pt-0.5 flex flex-wrap gap-1.5 items-center">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-2.5 py-1.5 bg-gradient-to-r from-teal-400 via-[#00B894] to-emerald-500 hover:opacity-95 text-slate-950 font-black text-[8px] uppercase tracking-wider rounded transition duration-300 flex items-center gap-1 shadow-md shadow-teal-500/20 hover:scale-[1.01] transform cursor-pointer"
                >
                  {t.hookCTA}
                  <ArrowRight className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-teal-300 border border-white/10 hover:border-teal-500/30 text-[8px] font-bold uppercase tracking-wider rounded transition cursor-pointer"
                >
                  {lang === 'EN' ? 'Explore Manifesto' : 
                   lang === 'AR' ? 'استكشف المانيفستو' : 
                   lang === 'FR' ? 'Explorer le Manifeste' : 'Explorar Manifiesto'}
                </button>
              </div>
            </div>

            {/* Hook Right Featured Product Showcase */}
            <div className="lg:col-span-3">
              {(() => {
                const sliderProducts = products.slice(0, 6);
                if (sliderProducts.length === 0) return null;
                const featuredProduct = sliderProducts[featuredIndex] || sliderProducts[0];
                return (
                  <div className="relative group max-w-[200px] ml-auto space-y-1">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={featuredProduct._id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        whileHover={{ y: -1, scale: 1.01 }}
                        className="backdrop-blur-md bg-white/5 dark:bg-zinc-900/25 border border-white/10 rounded-lg p-2 text-left hover:border-emerald-500/40 hover:bg-white/10 transition-all duration-300 shadow-md relative overflow-hidden cursor-pointer flex flex-col space-y-1.5"
                        onClick={() => navigate(`/product/${featuredProduct._id}`)}
                      >
                        {/* Glowing background accent */}
                        <div className="absolute -right-6 -top-6 w-10 h-10 bg-[#008D7F]/5 rounded-full blur-md pointer-events-none" />
                        
                        {/* 1. Product Image & Discount Badge */}
                        <div className="relative w-full h-20 rounded overflow-hidden bg-slate-950/40 border border-white/10 shrink-0 shadow-inner group">
                          <img 
                            src={featuredProduct.gallery?.[0]} 
                            alt={featuredProduct.title} 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-0.5 left-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[6.5px] uppercase tracking-wider px-1 py-0.5 rounded shadow-sm z-10">
                            25% OFF
                          </span>
                        </div>

                        {/* 2. Category & Title */}
                        <div className="space-y-0.5">
                          <span className="text-[6.5px] font-black uppercase text-emerald-400 tracking-wider">
                            {featuredProduct.category}
                          </span>
                          <h4 className="font-display font-extrabold text-[9.5px] leading-tight text-white group-hover:text-emerald-400 transition line-clamp-1">
                            {featuredProduct.title}
                          </h4>
                        </div>

                        {/* 3. Rating */}
                        <div className="flex items-center gap-0.5">
                          <div className="flex items-center text-emerald-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-1.5 h-1.5 ${
                                  i < Math.floor(featuredProduct.rating || 5) 
                                    ? 'fill-emerald-400 text-emerald-400' 
                                    : 'text-white/20'
                                  }`} 
                              />
                            ))}
                          </div>
                          <span className="text-[7.5px] font-extrabold text-white/60">
                            ({featuredProduct.rating || "4.8"})
                          </span>
                        </div>

                        {/* 4. Price Breakdown */}
                        {(() => {
                          const origPrice = Math.round(featuredProduct.price / 0.75);
                          return (
                            <div className="pt-0.5 border-t border-white/5 flex flex-col">
                              <div className="flex items-baseline gap-1">
                                <span className="text-[7.5px] text-white/40 line-through font-extrabold">
                                  {formatPrice(origPrice)}
                                </span>
                                <span className="font-display font-black text-[10px] text-[#008D7F]">
                                  {formatPrice(featuredProduct.price)}
                                </span>
                                <span className="text-[6.5px] font-bold text-emerald-400">
                                  -25%
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 5. Call-To-Action Buttons */}
                        <div className="pt-0.5 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(featuredProduct, 1);
                            }}
                            className="flex-1 px-1.5 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-[7.5px] uppercase tracking-wider rounded transition duration-300 flex items-center justify-center gap-0.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-2 h-2 text-white" />
                            {lang === 'EN' ? 'Add' : 
                             lang === 'AR' ? 'أضف' : 
                             lang === 'FR' ? 'Ajouter' : 'Añadir'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${featuredProduct._id}`);
                            }}
                            className="px-1.5 py-0.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-[7.5px] uppercase tracking-wider rounded transition text-center cursor-pointer"
                          >
                            {lang === 'EN' ? 'Details' : 
                             lang === 'AR' ? 'تفاصيل' : 
                             lang === 'FR' ? 'Détails' : 'Detalles'}
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Auto-scrolling Indicators & Arrows */}
                    <div className="flex items-center justify-between px-0.5">
                      <div className="flex items-center gap-0.5">
                        {sliderProducts.map((p, idx) => (
                          <button
                            key={p._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFeaturedIndex(idx);
                            }}
                            className={`w-0.5 h-0.5 rounded-full transition-all duration-300 ${
                              featuredIndex === idx 
                                ? 'bg-[#008D7F] w-1.5' 
                                : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeaturedIndex(prev => (prev - 1 + sliderProducts.length) % sliderProducts.length);
                          }}
                          className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center transition cursor-pointer"
                        >
                          <ChevronLeft className="w-2 h-2" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeaturedIndex(prev => (prev + 1) % sliderProducts.length);
                          }}
                          className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center transition cursor-pointer"
                        >
                          <ChevronRight className="w-2 h-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </motion.div>
      </section>

      {/* Hero Section */}
      <section className="premium-hero relative bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl overflow-hidden shadow-sm mx-4 sm:mx-8 mt-3 border border-slate-100">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#00B894_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-10 right-10 w-48 h-48 bg-[#00B894]/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-5 left-5 w-36 h-36 bg-[#D4AF37]/5 rounded-full blur-[50px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4 text-left"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/15 text-[#008D7F] border border-emerald-200/50 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-[#008D7F] animate-bounce text-[#008D7F]" /> {t.flashSale}
            </div>
            
            <h1 className="hero-catalog-heading font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1E293B] dark:text-white leading-tight tracking-tight">
              {t.headline.split(' ').slice(0, 3).join(' ')} <br />
              <span className="text-[#008D7F]">
                {t.headline.split(' ').slice(3).join(' ')}
              </span>
            </h1>

            <p className="text-[#1E293B]/70 dark:text-gray-300 text-xs sm:text-sm max-w-lg font-medium leading-relaxed">
              {t.subheadline}
            </p>

            {/* Shoppers Proof */}
            <div className="flex items-center gap-2 py-0.5 text-slate-600 dark:text-slate-300 font-semibold text-[10px] sm:text-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span><strong className="text-rose-600">{visitorCount} global buyers</strong> active on this terminal</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => navigate('/shop')}
                className="px-5 py-2.5 bg-gradient-to-r from-[#008D7F] to-[#00B894] hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all duration-300 flex items-center gap-1.5 transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t.shopNow}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  const targetEl = document.getElementById('best-sellers-section');
                  if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#1E293B] font-extrabold text-xs rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t.bestSellers}
              </button>
            </div>
          </motion.div>

          {/* HIGH-CLASS DYNAMIC POSTER FRAME WITH AUTO-SCROLL */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative w-full flex flex-col items-center justify-center py-2"
          >
            {/* Museum-Grade Dual Bezel Luxury Frame */}
            <div 
              className="relative w-full max-w-[310px] rounded-2xl bg-zinc-950 p-[8px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] border border-zinc-850"
              onMouseEnter={() => setIsPosterAutoplay(false)}
              onMouseLeave={() => setIsPosterAutoplay(true)}
            >
              {/* Gold Inner Gilded Bezel Bevel Accent */}
              <div className="relative rounded-xl border-[2px] border-[#D4AF37] p-[2px] bg-[#1a140a] overflow-hidden">
                
                {/* Poster Canvas */}
                <div className="relative h-[250px] rounded-lg overflow-hidden bg-zinc-900 flex flex-col justify-between">
                  
                  {/* Poster Image Background Carousel */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={posterIndex}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 z-0"
                    >
                      <img 
                        src={premiumPosters[posterIndex].image} 
                        alt={premiumPosters[posterIndex].title} 
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                      {/* Elite Matte Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25 z-10" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Header overlay for high class authenticity (museum tag & details) */}
                  <div className="relative z-20 p-3 flex justify-between items-start">
                    <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1 shadow-md">
                      <Sparkles className="w-2.5 h-2.5 text-[#D4AF37] animate-pulse" />
                      <span className="text-[8px] font-black tracking-widest text-[#D4AF37] uppercase font-mono">
                        {premiumPosters[posterIndex].tag}
                      </span>
                    </div>
                    
                    <div className="px-2 py-0.5 bg-[#D4AF37] text-zinc-950 text-[7.5px] font-black rounded shadow shadow-yellow-500/20 uppercase tracking-wider font-mono">
                      {premiumPosters[posterIndex].badge}
                    </div>
                  </div>

                  {/* Gold Foil Seal Stamp overlay - elegant branding details */}
                  <div className="absolute top-[45px] right-[15px] z-20 flex justify-center items-center pointer-events-none">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] via-[#AA7C11] to-[#D4AF37] text-white flex flex-col items-center justify-center rounded-full text-[6px] font-black text-center uppercase tracking-widest border border-yellow-200/40 shadow-lg opacity-85 rotate-12 scale-90">
                      <span className="leading-tight">ESTD</span>
                      <span className="text-[7.5px] tracking-tighter leading-none text-zinc-950 font-extrabold">2026</span>
                      <span className="text-[5.5px] leading-none opacity-80">DHAKA</span>
                    </div>
                  </div>

                  {/* Main Typographic Content and CTAs */}
                  <div className="relative z-20 p-4 pt-0 space-y-2 text-left">
                    <div className="space-y-0.5">
                      <p className="text-[8.5px] text-[#D4AF37] font-bold uppercase tracking-widest font-mono">
                        {premiumPosters[posterIndex].subtitle}
                      </p>
                      <h3 className="font-display text-lg sm:text-xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                        {premiumPosters[posterIndex].title}
                      </h3>
                      <p className="text-gray-300 text-[10px] font-medium leading-snug max-w-[240px] line-clamp-1">
                        {premiumPosters[posterIndex].desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      {/* Play/Pause Autoplay Indicator Badge */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPosterAutoplay(!isPosterAutoplay);
                        }}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-[7.5px] font-extrabold uppercase tracking-widest font-mono transition flex items-center gap-1 cursor-pointer"
                      >
                        <span className={`w-1 h-1 rounded-full ${isPosterAutoplay ? 'bg-[#00B894] animate-pulse' : 'bg-rose-400'}`}></span>
                        {isPosterAutoplay ? 'Live Scroll' : 'Paused'}
                      </button>

                      <button
                        onClick={() => navigate(premiumPosters[posterIndex].target)}
                        className="px-2.5 py-1 bg-[#008D7F] hover:bg-[#00B894] active:scale-95 text-white text-[8px] font-black uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-0.5 cursor-pointer shadow-md shadow-[#008D7F]/20"
                      >
                        <span>View Collection</span>
                        <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                      </button>
                    </div>
                  </div>

                  {/* Glare Glass Overlay Effect for Premium Physical Vibe */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.06] pointer-events-none z-15" />

                  {/* Auto-scrolling running duration timer progress bar */}
                  {isPosterAutoplay && (
                    <motion.div
                      key={posterIndex}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4.5, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] z-30 shadow-[0_0_8px_#D4AF37]"
                    />
                  )}
                </div>

              </div>

              {/* Dynamic Glassmorphism Nav Controls */}
              <div className="absolute -bottom-3.5 left-1/2 transform -translate-x-1/2 bg-zinc-900/95 dark:bg-zinc-950/95 border border-zinc-800 rounded-full px-3 py-1 flex items-center gap-3 shadow-lg z-30">
                <button
                  onClick={() => setPosterIndex(prev => (prev - 1 + premiumPosters.length) % premiumPosters.length)}
                  className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1.5">
                  {premiumPosters.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPosterIndex(idx)}
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        posterIndex === idx 
                          ? 'bg-[#D4AF37] w-2.5' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setPosterIndex(prev => (prev + 1) % premiumPosters.length)}
                  className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>

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
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
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
      <section id="best-sellers-section" className="max-w-7xl mx-auto px-6 sm:px-12 space-y-6">
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
                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-emerald-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < Math.floor(p.rating || 5) 
                              ? 'fill-emerald-400 text-emerald-400' 
                              : 'text-gray-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-500">
                      ({p.rating || "4.8"} / 5.0)
                    </span>
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
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
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
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
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
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
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
