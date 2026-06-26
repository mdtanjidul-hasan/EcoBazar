import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Blog } from '../types';
import { 
  ArrowRight, Star, Leaf, Award, ShieldCheck, Heart, ShoppingCart, 
  Eye, Zap, Flame, Users, ShieldAlert, Sparkles, X, Gift, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeViewProps {
  navigate: (path: string) => void;
}

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
      headline: 'Discover Products That Make Life Better',
      subheadline: 'Trending gadgets, fashion accessories, home essentials, and innovative products delivered worldwide.',
      shopNow: 'Shop Luxury Catalog',
      bestSellers: 'Best Sellers',
      flashSale: 'EXCLUSIVE FLASH SALE',
      endsIn: 'Ends in',
      categoriesHeading: 'Premium Categories',
      categoriesSub: 'Curated world-class selections meticulously refined for your lifestyle.',
      trendingHeading: 'Trending Masterpieces',
      trendingSub: 'Take a glance at our highest-converting global signature items.',
      whyUs: 'The EcoBazar Signature',
      artisanText: 'We curate premium sustainable woodcrafts, aerospace-grade carbon tech, and hypoallergenic luxury silver ornaments to protect your flair and our shared Earth.',
      blogHeading: 'Editorial Fashion & Tech Stories',
      blogSub: 'Follow lifestyle trends and innovative smart living logs by our design curators.',
      recentlyViewed: 'Recently Viewed Collection',
      spendMore: 'Free shipping worldwide on orders above ৳1,000!',
      hours: 'h', mins: 'm', secs: 's',
      hookBadge: '🔥 ATTENTION CONSCIOUS BEINGS',
      hookHeading: '99% of Modern Products Are Engineered To Fail. We Built the 1% That Elevates.',
      hookParagraph: 'Most platforms flood your life with cheap, mass-produced disposable slop designed for the landfill. EcoBazar is the counter-culture. We curate aerospace-grade tech, masterfully carved sustainable woodcrafts, and hypoallergenic heirloom silver ornaments. Built to outlast trends. Engineered to command respect.',
      hookCTA: 'Claim Your Heirloom Piece'
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
    headline: 'Discover Products That Make Life Better',
    subheadline: 'Trending gadgets, fashion accessories, home essentials, and innovative products delivered worldwide.',
    shopNow: 'Shop Luxury Catalog',
    bestSellers: 'Best Sellers',
    flashSale: 'EXCLUSIVE FLASH SALE',
    endsIn: 'Ends in',
    categoriesHeading: 'Premium Categories',
    categoriesSub: 'Curated world-class selections meticulously refined for your lifestyle.',
    trendingHeading: 'Trending Masterpieces',
    trendingSub: 'Take a glance at our highest-converting global signature items.',
    whyUs: 'The EcoBazar Signature',
    artisanText: 'We curate premium sustainable woodcrafts, aerospace-grade carbon tech, and hypoallergenic luxury silver ornaments to protect your flair and our shared Earth.',
    blogHeading: 'Editorial Fashion & Tech Stories',
    blogSub: 'Follow lifestyle trends and innovative smart living logs by our design curators.',
    recentlyViewed: 'Recently Viewed Collection',
    spendMore: 'Free shipping worldwide on orders above ৳1,000!',
    hours: 'h', mins: 'm', secs: 's',
    hookBadge: '🔥 ATTENTION CONSCIOUS BEINGS',
    hookHeading: '99% of Modern Products Are Engineered To Fail. We Built the 1% That Elevates.',
    hookParagraph: 'Most platforms flood your life with cheap, mass-produced disposable slop designed for the landfill. EcoBazar is the counter-culture. We curate aerospace-grade tech, masterfully carved sustainable woodcrafts, and hypoallergenic heirloom silver ornaments. Built to outlast trends. Engineered to command respect.',
    hookCTA: 'Claim Your Heirloom Piece'
  };

  // Selected products for hero/spotlight
  const bestSellerProducts = products.filter(p => p.rating >= 4.7).slice(0, 8);
  const latestBlogs = blogs.slice(0, 3);

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

      {/* Top Banner Notice - Floating Water-Transparent Spend Indicator with custom waves */}
      <div className="px-4 sm:px-8 mt-4 max-w-7xl mx-auto">
        <motion.div
          id="floating-oceanic-banner"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          className="relative overflow-hidden rounded-[24px] bg-teal-500/10 dark:bg-teal-900/15 backdrop-blur-md border border-teal-500/25 dark:border-teal-400/15 shadow-[0_12px_40px_rgba(0,184,148,0.12)] p-4 sm:p-5 text-center select-none flex flex-col items-center justify-center gap-2"
        >
          {/* Water wave decoration vectors */}
          <div className="absolute -bottom-2 -left-4 w-24 h-24 bg-gradient-to-tr from-[#00B894]/10 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

          {/* Line 1: Directive Tag */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#008D7F] dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0 fill-[#00B894]/10" />
            <span>
              {lang === 'EN' ? '⚡ PREMIUM SHIPMENT DIRECTIVE ⚡' : 
               lang === 'AR' ? '⚡ توجيه شحن حصري ⚡' : 
               lang === 'FR' ? '⚡ CONSIGNES D\'EXPÉDITION ULTRA ⚡' : 
               lang === 'ES' ? '⚡ DIRECTIVA DE ENVÍO PREMIUM ⚡' : '⚡ PREMIUM SHIPMENT DIRECTIVE ⚡'}
            </span>
          </div>

          {/* Line 2: The actual shipping benefit */}
          <div className="text-xs sm:text-sm font-black text-teal-950 dark:text-teal-200 tracking-wide max-w-2xl leading-relaxed">
            {t.spendMore}
          </div>
        </motion.div>
      </div>

      {/* HIGH-IMPACT MARKETING HOOK SECTION: HEATS THE HUMAN BRAIN */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-[#0B2521] to-zinc-950 text-white border border-teal-500/30 shadow-[0_20px_50px_rgba(0,141,127,0.25)] p-8 md:p-12"
        >
          {/* Futuristic mesh gradient light circles */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#00B894]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Dotted grid decorative texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hook Left Copywriting block */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/40 text-teal-300 rounded-full text-[10px] md:text-xs font-black tracking-wider uppercase">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce shrink-0" />
                {t.hookBadge}
              </span>
              
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {t.hookHeading.split('.').slice(0, 1).join('')}.
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-[#D4AF37]">
                  {t.hookHeading.split('.').slice(1).join('')}
                </span>
              </h2>

              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl">
                {t.hookParagraph}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-3 bg-gradient-to-r from-teal-400 via-[#00B894] to-emerald-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition duration-300 flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:scale-[1.02] transform cursor-pointer"
                >
                  {t.hookCTA}
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-teal-300 border border-white/10 hover:border-teal-500/30 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  {lang === 'EN' ? 'Explore Manifesto' : 
                   lang === 'AR' ? 'استكشف المانيفستو' : 
                   lang === 'FR' ? 'Explorer le Manifeste' : 'Explorar Manifiesto'}
                </button>
              </div>
            </div>

            {/* Hook Right Proof/Metric widgets block */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-4">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 p-5 rounded-2xl space-y-1.5 text-left hover:border-teal-500/20 transition">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <p className="text-[10px] font-black uppercase text-teal-400 tracking-wider">Zero Slop Certified</p>
                </div>
                <h4 className="font-display font-extrabold text-xl text-white">99.8%</h4>
                <p className="text-[11px] text-gray-400 leading-normal">Of our catalog items outlast average department store alternatives by 5x minimum.</p>
              </div>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 p-5 rounded-2xl space-y-1.5 text-left hover:border-teal-500/20 transition">
                <p className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Global Aligned Minds</p>
                <h4 className="font-display font-extrabold text-xl text-white">10,000+</h4>
                <p className="text-[11px] text-gray-400 leading-normal">Discerning collectors worldwide have rejected disposable mass production for our premium catalog.</p>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-[32px] overflow-hidden shadow-sm mx-4 sm:mx-8 mt-4 border border-slate-100">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#00B894_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#00B894]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-[#00B894] border border-emerald-100 rounded-full text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-[#00B894] animate-bounce" /> {t.flashSale}
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E293B] leading-tight tracking-tight">
              {t.headline.split(' ').slice(0, 3).join(' ')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B894] to-[#008D7F]">
                {t.headline.split(' ').slice(3).join(' ')}
              </span>
            </h1>

            <p className="text-[#1E293B]/70 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              {t.subheadline}
            </p>

            {/* Shoppers Proof */}
            <div className="flex items-center gap-3 py-1 text-slate-600 font-semibold text-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span><strong className="text-rose-600">{visitorCount} clients</strong> currently styling their baskets!</span>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/shop')}
                className="px-8 py-4 bg-gradient-to-r from-[#00B894] to-[#008D7F] hover:from-[#008D7F] hover:to-[#00B894] text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-700/10 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1"
              >
                {t.shopNow}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const targetEl = document.getElementById('best-sellers-section');
                  if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white hover:bg-slate-50 text-[#1E293B] font-extrabold rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-300 transform hover:-translate-y-1"
              >
                {t.bestSellers}
              </button>
            </div>
          </motion.div>

          {/* Luxury Floating Lifestyle Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-[40px] overflow-hidden shadow-2xl border-[10px] border-white bg-slate-100 rotate-1 transform hover:rotate-0 transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85"
                alt="Luxury Lifestyle EcoBazar Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
            </div>

            {/* Countdown Flash Sale overlay with glassmorphism */}
            <div className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-200 -rotate-2 hidden sm:flex z-20">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-500 font-bold text-xl animate-pulse">
                <Flame className="w-6 h-6 fill-orange-500" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-[#00B894] font-extrabold uppercase tracking-widest">{t.flashSale}</p>
                <div className="text-xs font-bold text-[#1E293B]">
                  {t.endsIn}: <span className="font-mono font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded ml-1">
                    {String(timeLeft.hours).padStart(2, '0')}{t.hours} : {String(timeLeft.minutes).padStart(2, '0')}{t.mins} : {String(timeLeft.seconds).padStart(2, '0')}{t.secs}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-slate-50 border border-slate-150 rounded-[24px] py-10 px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#00B894] mx-auto" />
            <h4 className="font-bold text-sm text-[#1E293B]">100% Secure Checkout</h4>
            <p className="text-[11px] text-slate-400">Industry-grade SSL encryption protocol</p>
          </div>
          <div className="text-center space-y-2">
            <Zap className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h4 className="font-bold text-sm text-[#1E293B]">Fast Worldwide Shipping</h4>
            <p className="text-[11px] text-slate-400">Direct courier delivery in 3-7 days</p>
          </div>
          <div className="text-center space-y-2">
            <Award className="w-8 h-8 text-[#00B894] mx-auto" />
            <h4 className="font-bold text-sm text-[#1E293B]">Premium Quality Sourced</h4>
            <p className="text-[11px] text-slate-400">Rigorous supplier inspection & testing</p>
          </div>
          <div className="text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h4 className="font-bold text-sm text-[#1E293B]">30 Days Easy Returns</h4>
            <p className="text-[11px] text-slate-400">Zero charges multi-channel returns</p>
          </div>
          <div className="text-center space-y-2 col-span-2 md:col-span-1">
            <Users className="w-8 h-8 text-[#00B894] mx-auto" />
            <h4 className="font-bold text-sm text-[#1E293B]">24/7 Dedicated Support</h4>
            <p className="text-[11px] text-slate-400">Omnipresent customer assistants</p>
          </div>
        </div>
      </section>

      {/* Categories Showcase Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-display text-4xl font-extrabold text-[#1E293B] uppercase tracking-wide">
            {t.categoriesHeading}
          </h2>
          <div className="w-16 h-1 bg-[#00B894] mx-auto rounded-full"></div>
          <p className="text-slate-500 text-sm font-medium">{t.categoriesSub}</p>
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
      <section id="best-sellers-section" className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-slate-100 pb-6">
          <div className="text-left space-y-2">
            <h2 className="font-display text-4xl font-extrabold text-[#1E293B] uppercase tracking-wide">
              {t.trendingHeading}
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] rounded-full"></div>
            <p className="text-slate-500 text-sm font-medium">{t.trendingSub}</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="px-5 py-2.5 bg-slate-50 text-xs font-extrabold text-[#00B894] hover:bg-emerald-50 rounded-xl transition-all duration-300 border border-slate-200 hover:border-emerald-100 flex items-center gap-1.5 shrink-0"
          >
            <span>Browse Complete Stock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Luxury Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellerProducts.map((p) => {
            const hasWish = wishlist.some(item => item._id === p._id);
            return (
              <div
                key={p._id}
                className="group bg-white border border-slate-150 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
              >
                {/* Floating Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(p);
                  }}
                  className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md z-10 transition duration-200 transform hover:scale-110 active:scale-90 ${
                    hasWish ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-400 hover:text-rose-500 backdrop-blur-sm'
                  }`}
                >
                  <Heart className="w-4.5 h-4.5" fill={hasWish ? 'currentColor' : 'none'} />
                </button>

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm z-10 flex items-center gap-1 border border-slate-100">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">{p.rating}</span>
                </div>

                {/* Cover Image Container */}
                <div 
                  onClick={() => navigate(`/product/${p._id}`)} 
                  className="h-60 overflow-hidden bg-slate-50 cursor-pointer relative"
                >
                  <img
                    src={p.gallery[0]}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Quick View Cover Trigger */}
                  <div className="absolute inset-0 bg-[#1E293B]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(p);
                      }}
                      className="pointer-events-auto px-4.5 py-2.5 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 hover:text-[#00B894] text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Inner specifications */}
                <div className="p-6 flex-1 flex flex-col text-left space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#00B894] uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/50">
                      {p.category}
                    </span>
                    <h3 
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="font-display font-bold text-sm text-[#1E293B] line-clamp-2 hover:text-[#00B894] cursor-pointer"
                    >
                      {p.title}
                    </h3>
                  </div>

                  {/* Stock Level Indicator */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] font-extrabold tracking-wide text-red-650 uppercase">Only 4 left in stock</span>
                  </div>

                  {/* Dynamic Pricing structure & cart */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-300 line-through block leading-none">
                        {getOriginalPrice(p.price)}
                      </span>
                      <span className="font-display font-extrabold text-base text-[#00B894] block leading-none">
                        {convertPrice(p.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      className="p-3 bg-slate-50 hover:bg-[#00B894] text-[#00B894] hover:text-white rounded-xl transition duration-300 transform active:scale-95"
                      title="Add to Shopping Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
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
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-[#1E293B]/70 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[24px] overflow-hidden max-w-3xl w-full p-6 sm:p-8 relative z-10 shadow-2xl border border-slate-150 text-left grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-[#1E293B] transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column Image */}
              <div className="space-y-4">
                <div className="h-72 overflow-hidden rounded-2xl bg-slate-150">
                  <img
                    src={quickViewProduct.gallery[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                    alt={quickViewProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  {quickViewProduct.gallery.slice(0, 3).map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                      <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column Details */}
              <div className="flex flex-col space-y-4 justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#00B894] uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                    {quickViewProduct.category}
                  </span>
                  <h2 className="font-display font-extrabold text-xl text-[#1E293B]">
                    {quickViewProduct.title}
                  </h2>
                  
                  {/* Stars Info */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      <Star className="w-4.5 h-4.5 fill-current" />
                      <Star className="w-4.5 h-4.5 fill-current" />
                      <Star className="w-4.5 h-4.5 fill-current" />
                      <Star className="w-4.5 h-4.5 fill-current" />
                      <Star className="w-4.5 h-4.5 fill-current" />
                    </div>
                    <span className="text-xs font-black text-[#1E293B]">({quickViewProduct.rating} / 5.0)</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {quickViewProduct.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-slate-400 line-through">
                      {getOriginalPrice(quickViewProduct.price)}
                    </span>
                    <span className="text-2xl font-black font-display text-[#00B894]">
                      {convertPrice(quickViewProduct.price)}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct, 1);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 py-3 bg-[#00B894] hover:bg-[#008D7F] text-white font-extrabold rounded-xl transition shadow-md shadow-emerald-700/5 uppercase tracking-wide text-xs flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-4.5 h-4.5" />
                      Add to basket
                    </button>
                    <button
                      onClick={() => {
                        addToWishlist(quickViewProduct);
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded-xl transition border border-slate-250"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
