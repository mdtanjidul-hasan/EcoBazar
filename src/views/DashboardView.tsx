import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Order, Product } from '../types';
import { SlidersHorizontal, ShieldCheck, Mail, Calendar, Sparkles, UserCheck, ShoppingBag, Plus, Trash2, CheckCircle, Truck, PackageCheck, Send, Edit, Heart, ShoppingCart, Clock, RefreshCw, MapPin, Activity, ChevronRight, Award, Gift, Ticket, Copy, Check, Lock, Cpu, Play, Pause, Database, TrendingUp, TrendingDown, Target, LineChart, Zap, Globe, Percent, Settings } from 'lucide-react';

interface DashboardViewProps {
  navigate: (path: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ navigate }) => {
  const {
    user, allUsers, orders, products, addProduct, deleteProduct, updateProduct, updateOrderStatus, deleteOrder, updateProfile,
    wishlist, removeFromWishlist, addToCart, lang, currency
  } = useStore();

  if (!user) {
    return (
      <div className="py-20 text-center max-w-sm mx-auto space-y-6">
        <div className="text-4xl">🔐</div>
        <div>
          <h2 className="font-display font-black text-2xl text-gray-900">Access Restricted</h2>
          <p className="text-sm text-gray-500 font-semibold mt-1">Please sign in to access your user or administrative dashboard.</p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3.5 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-xs rounded-xl transition shadow"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Active tab depends on role
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (user.role === 'admin') return 'users';
    if (user.role === 'delivery') return 'my-order';
    return 'dashboard';
  });

  // Profile forms state
  const [pName, setPName] = useState(user.name);
  const [pPhoto, setPPhoto] = useState(user.photoURL || '');

  // Add Product form states
  const [prodTitle, setProdTitle] = useState('');
  const [prodCat, setProdCat] = useState('Earrings');
  const [prodSubCat, setProdSubCat] = useState('Earrings');
  const [prodPrice, setProdPrice] = useState(100);
  const [prodQty, setProdQty] = useState(50);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300');

  // Edit states for assigning delivery man
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedDelMan, setSelectedDelMan] = useState('');
  const [delDate, setDelDate] = useState('');

  // Real-time Order Tracking States
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackingStatusMessage, setTrackingStatusMessage] = useState<string>('');

  // Dropshipping Automation & Global Social Marketing Hub States
  const [selectedDsProduct, setSelectedDsProduct] = useState<string>('');
  const [dsGeneratedPack, setDsGeneratedPack] = useState<any>(null);
  const [dsGenLoading, setDsGenLoading] = useState(false);
  const [dsGenSource, setDsGenSource] = useState<'gemini_api' | 'fallback_heuristic' | null>(null);
  const [dsPriceMultiplier, setDsPriceMultiplier] = useState<number>(2.5);
  const [dsFixedMarkup, setDsFixedMarkup] = useState<number>(20); // standard USD or BDT shipping insurance overhead
  const [dsAdTargetTab, setDsAdTargetTab] = useState<'facebook' | 'instagram' | 'tiktok' | 'google' | 'seo'>('facebook');
  const [dsCopiedFeedback, setDsCopiedFeedback] = useState<string | null>(null);
  const [dsStockSyncing, setDsStockSyncing] = useState<boolean>(false);
  const [dsProductCostMap, setDsProductCostMap] = useState<Record<string, { cost: number; shipping: number; supplier: string; syncedStatus: boolean }>>({});
  const [dsCompetitorPrices, setDsCompetitorPrices] = useState<Record<string, { comp1: number; comp2: number; sourceComp1: string; sourceComp2: string }>>({});
  const [dsTrendsList, setDsTrendsList] = useState([
    { keyword: "traditional beaded necklaces", volume: 88, category: "jewelry", trend: "up" },
    { keyword: "handmade silver gemstone rings", volume: 94, category: "jewelry", trend: "up" },
    { keyword: "waterproof smartwatch fitness track", volume: 72, category: "gadgets", trend: "neutral" },
    { keyword: "dual camera mini folding drone", volume: 96, category: "gadgets", trend: "up" },
    { keyword: "rechargeable led neck reading light", volume: 38, category: "gadgets", trend: "down" }
  ]);
  const [dsPricingAutoAdjust, setDsPricingAutoAdjust] = useState<boolean>(true);
  const [dsUndercutPercent, setDsUndercutPercent] = useState<number>(3); // undercut average competitors by 3% by default
  const [dsPricingStrategy, setDsPricingStrategy] = useState<'undercut' | 'premium' | 'seo-demand' | 'balanced'>('balanced');
  const [dsPricingLogs, setDsPricingLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] > DYNAMIC PRICING ENGINE: Real-time competitor analyzer and Google Trends listener activated.`,
    `[${new Date().toLocaleTimeString()}] > GOOGLE TRENDS OVERLAY: High search volume detected for "handmade silver gemstone rings" (Score: 94).`,
    `[${new Date().toLocaleTimeString()}] > STRATEGY: Balanced mode evaluating prices to maximize volume and defend profit margins.`
  ]);

  // SEO Health Checker States
  const [seoSelectedProductId, setSeoSelectedProductId] = useState<string>('');
  const [seoAnalysisResult, setSeoAnalysisResult] = useState<any>(null);
  const [seoLoading, setSeoLoading] = useState<boolean>(false);
  const [seoSource, setSeoSource] = useState<'gemini_api' | 'fallback_heuristic' | null>(null);
  const [seoAnalyzeError, setSeoAnalyzeError] = useState<string | null>(null);
  const [newTrendKeyword, setNewTrendKeyword] = useState<string>('');

  // Auto-initialize base dropship costs & competitor prices on load
  React.useEffect(() => {
    if (products && products.length > 0) {
      if (Object.keys(dsProductCostMap).length === 0) {
        const computed: Record<string, { cost: number; shipping: number; supplier: string; syncedStatus: boolean }> = {};
        products.forEach(p => {
          // Base cost is 30% to 45% of store price
          const costAmount = Math.max(15, Math.floor(p.price * 0.35));
          const shipAmount = Math.floor(costAmount * 0.15 + 4);
          computed[p._id] = {
            cost: costAmount,
            shipping: shipAmount,
            supplier: p.category.toLowerCase().includes("gadg") ? "CJ Dropshipping Shenzhen" : "AliExpress Premium Jewelry",
            syncedStatus: true
          };
        });
        setDsProductCostMap(computed);
      }

      if (Object.keys(dsCompetitorPrices).length === 0) {
        const comps: Record<string, { comp1: number; comp2: number; sourceComp1: string; sourceComp2: string }> = {};
        products.forEach(p => {
          // Initialize competitor prices slightly surrounding current product retail pricing
          const base = p.price;
          comps[p._id] = {
            comp1: Math.round(base * (1 + (Math.random() * 0.12 - 0.05))), // -5% to +7%
            comp2: Math.round(base * (1 + (Math.random() * 0.14 - 0.07))), // -7% to +7%
            sourceComp1: p.category.toLowerCase().includes("gadg") ? "Daraz.com.bd" : "Almas Jewelers BD",
            sourceComp2: p.category.toLowerCase().includes("gadg") ? "GadgetBD" : "Apan Jewellers BD"
          };
        });
        setDsCompetitorPrices(comps);
      }

      if (!selectedDsProduct && products.length > 0) {
        setSelectedDsProduct(products[0]._id);
      }

      if (!seoSelectedProductId && products.length > 0) {
        setSeoSelectedProductId(products[0]._id);
      }
    }
  }, [products, selectedDsProduct, seoSelectedProductId]);

  // Automated dropshipping supplier periodic sync states
  const [dsAutoSyncActive, setDsAutoSyncActive] = useState<boolean>(true);
  const [dsSyncInterval, setDsSyncInterval] = useState<number>(10); // Default simulated 10 seconds interval
  const [dsSyncCount, setDsSyncCount] = useState<number>(1);
  const [dsLastSyncTime, setDsLastSyncTime] = useState<string>(() => new Date().toLocaleTimeString());
  const [dsSyncProviders, setDsSyncProviders] = useState<Record<string, boolean>>({ cj: true, aliexpress: true, dhgate: true });
  const [dsSyncLogs, setDsSyncLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] > BACKGROUND ENGINE: Periodic Supplier Sync Active in background (Polling scheduled).`,
    `[${new Date().toLocaleTimeString()}] > AUTOMATION: Auto map verified boutique jewelries and smart-watch inventory levels.`,
    `[${new Date().toLocaleTimeString()}] > SYSTEM: Configured local store real-time state listeners on inventory and wholesales.`
  ]);

  // dropshipping.com.bd Local Bangladesh Strategy Configurations
  const [dsBdStrategyActive, setDsBdStrategyActive] = useState<boolean>(true);
  const [dsBdCourierPartner, setDsBdCourierPartner] = useState<'steadfast' | 'pathao' | 'redx' | 'paperfly'>('steadfast');
  const [dsBdZone, setDsBdZone] = useState<'inside' | 'suburbs' | 'outside'>('inside');
  const [dsBdWhiteLabelEnabled, setDsBdWhiteLabelEnabled] = useState<boolean>(true);
  const [dsBdStoreLogoText, setDsBdStoreLogoText] = useState<string>("EcoBazar BD");
  const [dsBdCodFeeEnable, setDsBdCodFeeEnable] = useState<boolean>(true);
  const [dsBdPayoutChannel, setDsBdPayoutChannel] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [dsBdPayoutPhone, setDsBdPayoutPhone] = useState<string>("01712-345678");
  const [dsBdAccountName, setDsBdAccountName] = useState<string>("Mizanur Rahman");
  const [dsBdEarnedProfitPaid, setDsBdEarnedProfitPaid] = useState<number>(23840);
  const [dsBdPendingProfit, setDsBdPendingProfit] = useState<number>(4120);
  const [dsBdPayoutHistory, setDsBdPayoutHistory] = useState([
    { id: "TXN-984210", channel: "bKash Premium", amount: 7420, date: "2026-06-18", status: "Successful", recipient: "01712-345678" },
    { id: "TXN-874121", channel: "Nagad Business", amount: 9600, date: "2026-06-12", status: "Successful", recipient: "01712-345678" },
    { id: "TXN-541290", channel: "bKash Premium", amount: 6820, date: "2026-06-05", status: "Successful", recipient: "01712-345678" }
  ]);
  const [dsBdLogs, setDsBdLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] > bdDropship Strategy Engine Active. Configured endpoints for dropshipping.com.bd wholesale inventory.`,
    `[${new Date().toLocaleTimeString()}] > 3PL LOGISTICS: Mapped automatic shipping webhook payloads with Steadfast Courier.`,
    `[${new Date().toLocaleTimeString()}] > WHITE-LABEL: Custom invoice branding initialized with merchant prefix "[EcoBazar BD]".`
  ]);

  const triggerSupplierSync = React.useCallback(() => {
    if (!products || products.length === 0) return;

    // Filter suppliers enabled
    const activeProvs = Object.keys(dsSyncProviders).filter(k => dsSyncProviders[k]);
    if (activeProvs.length === 0) {
      setDsSyncLogs(prev => [`[${new Date().toLocaleTimeString()}] WARNING > Sync aborted: No supplier channels selected.`, ...prev].slice(0, 30));
      return;
    }

    // Pick 1 random active product to update stock & cost
    const targetProduct = products[Math.floor(Math.random() * products.length)];
    if (!targetProduct) return;

    // Pick provider matching or random
    const randProvKey = activeProvs[Math.floor(Math.random() * activeProvs.length)];
    const providerName = randProvKey === 'cj' ? "CJ Dropshipping" : randProvKey === 'aliexpress' ? "AliExpress Premium" : "DHGate Direct";

    // Randomize stock level (simulate external dropshipper stock shift)
    const nextStock = Math.floor(Math.random() * 60) + 40;

    // Slightly fluctuate supplier cost
    const costData = dsProductCostMap[targetProduct._id] || { cost: Math.floor(targetProduct.price * 0.35), shipping: 6, supplier: providerName, syncedStatus: true };
    const costChange = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
    const nextCost = Math.max(10, costData.cost + costChange);

    // Save to cost mapping
    setDsProductCostMap(prev => ({
      ...prev,
      [targetProduct._id]: {
        ...costData,
        cost: nextCost,
        supplier: providerName,
        syncedStatus: true
      }
    }));

    // Update product store state
    const updated: Product = {
      ...targetProduct,
      quantity: nextStock
    };
    updateProduct(updated);

    // Formulate logs of this sync stream
    const timestamp = new Date().toLocaleTimeString();
    const l1 = `[${timestamp}] SUCCESS > Synced API endpoints of ${providerName} Node...`;
    const l2 = `[${timestamp}] STOCK UPDATED > '${targetProduct.title}' local inventory synced to ${nextStock} items.`;
    const l3 = `[${timestamp}] PRICING MARGIN > Recalculating wholesales cost to ৳${nextCost} (+ shipping ৳${costData.shipping}). Formula selling price: ৳${Math.round((nextCost + costData.shipping) * dsPriceMultiplier + dsFixedMarkup)}`;

    let l4 = "";
    if (orders && orders.length > 0) {
      const ordersCanTransition = orders.filter(o => o.status === 'pending');
      if (ordersCanTransition.length > 0) {
        const targetOrder = ordersCanTransition[Math.floor(Math.random() * ordersCanTransition.length)];
        l4 = `[${timestamp}] SHIFT OUTBOUND > Dropship item in Order ${targetOrder._id} processed at Shenzhen outbound terminal. Status: Transit.`;
      } else {
        l4 = `[${timestamp}] CARRIER STATUS > EMS Express reported 100% on-time delivery metric across all dispatched lines.`;
      }
    } else {
      l4 = `[${timestamp}] HEALTH > Global dropshipping fulfillment pipelines report healthy responses (200 OK).`;
    }

    setDsSyncLogs(prev => [l1, l2, l3, l4, ...prev].slice(0, 30));
    setDsSyncCount(c => c + 1);
    setDsLastSyncTime(timestamp);
  }, [products, dsSyncProviders, dsProductCostMap, updateProduct, orders, dsPriceMultiplier, dsFixedMarkup]);

  const triggerDynamicPricingSync = React.useCallback(() => {
    if (!products || products.length === 0) return;

    // Pick 1 random active product to analyze pricing
    const targetProduct = products[Math.floor(Math.random() * products.length)];
    if (!targetProduct) return;

    const baseCost = dsProductCostMap[targetProduct._id]?.cost || Math.max(15, Math.floor(targetProduct.price * 0.35));
    const shippingCost = dsProductCostMap[targetProduct._id]?.shipping || 6;
    const minCostThreshold = Math.round((baseCost + shippingCost) * 1.15); // cost + shipping + 15% safety margin

    // Fluctuate competitor prices for target product
    const comps = dsCompetitorPrices[targetProduct._id] || {
      comp1: Math.round(targetProduct.price * 1.02),
      comp2: Math.round(targetProduct.price * 0.98),
      sourceComp1: targetProduct.category.toLowerCase().includes("gadg") ? "Daraz.com.bd" : "Almas Jewelers BD",
      sourceComp2: targetProduct.category.toLowerCase().includes("gadg") ? "GadgetBD" : "Apan Jewellers BD"
    };

    const delta1 = Math.round(comps.comp1 * (Math.random() * 0.04 - 0.02)); // +/- 2%
    const delta2 = Math.round(comps.comp2 * (Math.random() * 0.04 - 0.02)); // +/- 2%
    const newComp1 = Math.max(minCostThreshold, comps.comp1 + delta1);
    const newComp2 = Math.max(minCostThreshold, comps.comp2 + delta2);

    setDsCompetitorPrices(prev => ({
      ...prev,
      [targetProduct._id]: {
        ...comps,
        comp1: newComp1,
        comp2: newComp2
      }
    }));

    // Randomly update 1 Google Trend keyword volume
    const trendIdx = Math.floor(Math.random() * dsTrendsList.length);
    const selectedTrend = dsTrendsList[trendIdx];
    const trendDelta = Math.floor(Math.random() * 7) - 3; // -3 to +3
    const nextVolume = Math.min(100, Math.max(10, selectedTrend.volume + trendDelta));
    const nextTrendDir = trendDelta > 0 ? "up" : trendDelta < 0 ? "down" : "neutral";

    setDsTrendsList(prev => prev.map((t, i) => i === trendIdx ? { ...t, volume: nextVolume, trend: nextTrendDir } : t));

    // Calculate new price based on strategy
    const compAvg = Math.round((newComp1 + newComp2) / 2);
    let calculatedPrice = targetProduct.price;
    let strategyAction = "";

    if (dsPricingStrategy === 'undercut') {
      calculatedPrice = Math.round(compAvg * (1 - dsUndercutPercent / 100));
      strategyAction = `Undercut Strategy: Set price ${dsUndercutPercent}% below Competitor average (Avg: ৳${compAvg.toLocaleString()})`;
    } else if (dsPricingStrategy === 'premium') {
      calculatedPrice = Math.round((baseCost + shippingCost) * dsPriceMultiplier * 1.25 + dsFixedMarkup);
      strategyAction = `Bespoke Premium strategy: Boosted pricing with markup factor (Cost x ${dsPriceMultiplier} + ৳${dsFixedMarkup})`;
    } else if (dsPricingStrategy === 'seo-demand') {
      const isJewelry = targetProduct.category.toLowerCase().includes("jewel") || targetProduct.category.toLowerCase().includes("ring") || targetProduct.category.toLowerCase().includes("bead");
      const matchedTrends = dsTrendsList.filter(t => isJewelry ? t.category === "jewelry" : t.category === "gadgets");
      const highestVolume = matchedTrends.length > 0 ? Math.max(...matchedTrends.map(t => t.volume)) : 50;

      if (highestVolume > 85) {
        calculatedPrice = Math.round(targetProduct.price * 1.15);
        strategyAction = `SEO Demand Surge: Google index volume for category trends is highly elevated (${highestVolume}). Auto-boosted markup by 15% to leverage demand.`;
      } else if (highestVolume < 50) {
        calculatedPrice = Math.round(targetProduct.price * 0.93);
        strategyAction = `SEO Demand Cooldown: Search interest is currently low (${highestVolume}). Lowered prices by -7% to enhance turnover.`;
      } else {
        calculatedPrice = Math.round((baseCost + shippingCost) * dsPriceMultiplier + dsFixedMarkup);
        strategyAction = `SEO Standard: Price matched standard indexing expectations (${highestVolume})`;
      }
    } else {
      // 'balanced'
      const lowestComp = Math.min(newComp1, newComp2);
      const isJewelry = targetProduct.category.toLowerCase().includes("jewel") || targetProduct.category.toLowerCase().includes("ring") || targetProduct.category.toLowerCase().includes("bead");
      const matchedTrends = dsTrendsList.filter(t => isJewelry ? t.category === "jewelry" : t.category === "gadgets");
      const highestVolume = matchedTrends.length > 0 ? Math.max(...matchedTrends.map(t => t.volume)) : 55;

      if (highestVolume > 80) {
        calculatedPrice = Math.round(lowestComp * 1.08);
        strategyAction = `Balanced Mode: Strong trends volume (${highestVolume}) allows capturing 8% premium above competitors.`;
      } else {
        calculatedPrice = Math.round(lowestComp * 0.98);
        strategyAction = `Balanced Mode: Slightly undercut lowest competitor price (৳${lowestComp.toLocaleString()}) by -2% to drive cart conversions.`;
      }
    }

    // Profit check
    if (calculatedPrice < minCostThreshold) {
      calculatedPrice = minCostThreshold;
      strategyAction += ` (Applied pricing floor margin safety limit to protect wholesale overheads).`;
    }

    // Check if price needs update
    if (calculatedPrice !== targetProduct.price) {
      const updated: Product = {
        ...targetProduct,
        price: calculatedPrice
      };
      updateProduct(updated);

      const logMsg = `[${new Date().toLocaleTimeString()}] ADJUSTED SUCCESS > '${targetProduct.title}' re-evaluated. ${strategyAction}. Adjusted retail rate: ৳${calculatedPrice.toLocaleString()} (was ৳${targetProduct.price.toLocaleString()})`;
      setDsPricingLogs(prev => [logMsg, ...prev].slice(0, 30));
    } else {
      const logMsg = `[${new Date().toLocaleTimeString()}] OPTIMAL > Checked '${targetProduct.title}'. Competitors average: ৳${compAvg.toLocaleString()} | Current rate: ৳${targetProduct.price.toLocaleString()} is verified optimal.`;
      setDsPricingLogs(prev => [logMsg, ...prev].slice(0, 30));
    }
  }, [products, dsProductCostMap, dsCompetitorPrices, dsTrendsList, dsPricingStrategy, dsUndercutPercent, dsPriceMultiplier, dsFixedMarkup, updateProduct]);

  const triggerBdSpecificSync = React.useCallback(() => {
    if (!products || products.length === 0) return;

    const timestamp = new Date().toLocaleTimeString();
    
    // Pick 1 random active product
    const targetProduct = products[Math.floor(Math.random() * products.length)];
    if (!targetProduct) return;

    const courierRates = { inside: 60, suburbs: 100, outside: 130 };
    const currentRate = courierRates[dsBdZone];
    const codProcessing = dsBdCodFeeEnable ? Math.round(targetProduct.price * 0.01) : 0;
    const netCourierCost = currentRate + codProcessing;

    // Simulate logs or metrics
    const bdLogLines = [
      `[${timestamp}] LOGISTICS (${dsBdCourierPartner.toUpperCase()}) > Carrier assigned to local dispatch queue. Route: ${
        dsBdZone === 'inside' ? 'Dhaka Metro Area' : dsBdZone === 'suburbs' ? 'Dhaka Suburbs (Savar/Gazipur)' : 'Outside Dhaka District (Chittagong/Sylhet)'
      }. Courier fee: ৳${currentRate} BDT.`,
      `[${timestamp}] BRAND ENGAGEMENT (WHITE-LABEL) > Prepared shipment custom label for "${dsBdStoreLogoText}" with dropship.com.bd API credentials.`,
      `[${timestamp}] ESCROW GATEWAY > Checking dropshipping.com.bd collection status. Synced collected Cash on Delivery balances.`
    ];

    // Every few intervals, let's unlock some pending profit as if order got delivered
    if (Math.random() > 0.6 && dsBdPendingProfit > 500) {
      const payoutAmount = Math.floor(Math.random() * 800) + 350;
      setDsBdPendingProfit(prev => Math.max(0, prev - payoutAmount));
      setDsBdEarnedProfitPaid(prev => prev + payoutAmount);
      bdLogLines.push(`[${timestamp}] TRANSACTION UNLOCKED > Customer accepted parcel delivery. Profit ৳${payoutAmount} BDT moved to available Bkash balance.`);
    }

    setDsBdLogs(prev => [...bdLogLines, ...prev].slice(0, 30));
  }, [products, dsBdCourierPartner, dsBdZone, dsBdStoreLogoText, dsBdCodFeeEnable, dsBdPendingProfit]);

  // Automated Periodic sync trigger
  React.useEffect(() => {
    if (!dsAutoSyncActive) return;

    const intervalId = setInterval(() => {
      triggerSupplierSync();
      if (dsPricingAutoAdjust) {
        triggerDynamicPricingSync();
      }
      if (dsBdStrategyActive) {
        triggerBdSpecificSync();
      }
    }, dsSyncInterval * 1000);

    return () => clearInterval(intervalId);
  }, [dsAutoSyncActive, dsSyncInterval, triggerSupplierSync, dsPricingAutoAdjust, triggerDynamicPricingSync, dsBdStrategyActive, triggerBdSpecificSync]);

  const deliveryMen = allUsers.filter(u => u.role === 'delivery');

  // Loyalty Rewards States
  const [redeemedCoupons, setRedeemedCoupons] = useState<{code: string; value: number; type: string; pointsCost: number; date: string; used: boolean}[]>(() => {
    try {
      if (!user) return [];
      const saved = localStorage.getItem(`ecobazar_coupons_${user.email}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [spentPoints, setSpentPoints] = useState<number>(() => {
    try {
      if (!user) return 0;
      const saved = localStorage.getItem(`ecobazar_spent_points_${user.email}`);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sync to localStorage
  React.useEffect(() => {
    if (user) {
      localStorage.setItem(`ecobazar_coupons_${user.email}`, JSON.stringify(redeemedCoupons));
    }
  }, [redeemedCoupons, user]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem(`ecobazar_spent_points_${user.email}`, String(spentPoints));
    }
  }, [spentPoints, user]);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
    } catch (e) {
      console.error(e);
    }
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 1500);
  };

  // Auto-select latest order for tracking on component mount
  React.useEffect(() => {
    const custOrders = orders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());
    if (!selectedTrackOrderId && custOrders.length > 0) {
      setSelectedTrackOrderId(custOrders[0]._id);
    }
  }, [orders, user.email, selectedTrackOrderId]);

  const handleRefreshTracking = () => {
    setIsTrackingLoading(true);
    setTrackingStatusMessage(lang === 'EN' ? 'Contacting regional distribution servers...' : 'আঞ্চলিক বণ্টন সার্ভারের সাথে যোগাযোগ করা হচ্ছে...');
    setTimeout(() => {
      setTrackingStatusMessage(lang === 'EN' ? 'Syncing active delivery boy GPS coordinates...' : 'সক্রিয় ডেলিভারি বয়ের জিপিএস কোঅর্ডিনেট সিঙ্ক করা হচ্ছে...');
      setTimeout(() => {
        setIsTrackingLoading(false);
        setTrackingStatusMessage('');
        alert(lang === 'EN' ? 'Tracking status successfully updated and verified in real-time!' : 'উইশলিস্ট এবং ট্র্যাকিং স্ট্যাটাস রিয়েল-টাইমে আপডেট এবং যাচাই করা হয়েছে!');
      }, 700);
    }, 700);
  };

  const handleDemoAdvanceStatus = (orderId: string, currentStatus: Order['status']) => {
    let nextStatus: Order['status'] = 'pending';
    if (currentStatus === 'pending') {
      nextStatus = 'onTheWay';
      const assignedMan = deliveryMen[0]?.name || 'Mishuk RJ';
      const assignedDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
      updateOrderStatus(orderId, nextStatus, assignedMan, assignedDate);
      alert(lang === 'EN' ? 'Demo Mode: Order status advanced to "On The Way" and assigned to Mishuk RJ!' : 'ডেমো মুড: অর্ডারের স্থিতি "রাস্তায় আছে" ধাপে উন্নীত করা হয়েছে এবং মিশুক আরজে-কে দায়িত্ব দেওয়া হয়েছে!');
    } else if (currentStatus === 'onTheWay') {
      nextStatus = 'completed';
      updateOrderStatus(orderId, nextStatus);
      alert(lang === 'EN' ? 'Demo Mode: Order status advanced to "Completed"!' : 'ডেমো মুড: অর্ডারের স্থিতি "সম্পন্ন" ধাপে উন্নীত করা হয়েছে!');
    } else {
      updateOrderStatus(orderId, 'pending', '', '');
      alert(lang === 'EN' ? 'Demo Mode: Order status reset to "Pending"!' : 'ডেমো মুড: অর্ডারের স্থিতি পুনরায় "পেন্ডিং" অবস্থায় রিসেট করা হয়েছে!');
    }
  };

  const convertPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return '$' + (bdtPrice / 120).toFixed(2);
    }
    return '৳' + bdtPrice.toLocaleString();
  };

  // Calculate dashboard stats for customer user
  const userOrders = orders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());
  const userCompleted = userOrders.filter(o => o.status === 'completed');
  const userOnTheWay = userOrders.filter(o => o.status === 'onTheWay');
  const userPending = userOrders.filter(o => o.status === 'pending');
  const userTotalSpent = userCompleted.reduce((sum, o) => sum + o.total, 0);

  // Loyalty Rewards Calculations
  const userOrdersCompleted = userOrders.filter(o => o.status === 'completed');
  const userOrdersPending = userOrders.filter(o => o.status === 'pending' || o.status === 'onTheWay');

  // Earned Points: 1 point per ৳50 spent across all completed orders
  const totalEarnedPoints = Math.floor(userOrdersCompleted.reduce((sum, o) => sum + o.total, 0) / 50);

  // Pending Points: 1 point per ৳50 spent on pending or in-transit orders
  const pendingPoints = Math.floor(userOrdersPending.reduce((sum, o) => sum + o.total, 0) / 50);

  // Active usable points
  const currentPoints = Math.max(0, totalEarnedPoints - spentPoints);

  // Get current active loyalty level badge configuration
  const getUserBadge = () => {
    if (totalEarnedPoints >= 1000) return { name: lang === 'EN' ? 'VIP PLATINUM' : 'ভিআইপি প্ল্যাটিনাম', color: 'bg-rose-100 dark:bg-rose-950/40 text-rose-750 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 border' };
    if (totalEarnedPoints >= 500) return { name: lang === 'EN' ? 'ROYAL GOLD' : 'রয়্যাল গোল্ড', color: 'bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-405 border-amber-200 dark:border-amber-900/50 border' };
    if (totalEarnedPoints >= 250) return { name: lang === 'EN' ? 'ELITE SILVER' : 'এলিট সিলভার', color: 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-405 border-blue-200 dark:border-blue-900/50 border' };
    return { name: lang === 'EN' ? 'BRONZE START' : 'ব্রোঞ্জ স্টার্ট', color: 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-gray-300 border-stone-200 dark:border-zinc-700 border' };
  };

  const currentBadge = getUserBadge();

  // Coupon milestone levels
  const milestones = [
    { id: 'bronze', name: lang === 'EN' ? 'Bronze Starter Coupon' : 'ব্রোঞ্জ স্টার্টার কুপন', points: 100, reward: 500 },
    { id: 'silver', name: lang === 'EN' ? 'Silver Craftsmanship Coupon' : 'সিলভার কারুশিল্প কুপন', points: 250, reward: 1500 },
    { id: 'gold', name: lang === 'EN' ? 'Gold Royal Artisan Coupon' : 'গোল্ড রয়্যাল কারিগর কুপন', points: 500, reward: 3500 },
    { id: 'platinum', name: lang === 'EN' ? 'Platinum Master VIP Coupon' : 'প্লাটিনাম মাস্টার ভিআইপি কুপন', points: 1000, reward: 8000 },
  ];

  // Find next target milestone
  const nextMilestone = milestones.find(m => currentPoints < m.points) || milestones[milestones.length - 1];
  const prevMilestonePoints = milestones.indexOf(nextMilestone) > 0 ? milestones[milestones.indexOf(nextMilestone) - 1].points : 0;

  // Progress Bar percentage
  const progressPercentage = Math.min(100, Math.round(
    currentPoints >= nextMilestone.points 
      ? 100 
      : ((currentPoints - prevMilestonePoints) / (nextMilestone.points - prevMilestonePoints)) * 100
  ));

  const handleRedeemPoints = (m: typeof milestones[number]) => {
    if (currentPoints < m.points) {
      alert(lang === 'EN' ? `Insufficient points! You need ${m.points - currentPoints} more points.` : `অপ্রতুল পয়েন্ট! আপনার আরও ${m.points - currentPoints} পয়েন্ট প্রয়োজন।`);
      return;
    }
    const confirmRedeem = window.confirm(lang === 'EN' 
      ? `Redeem ${m.points} Points for "${m.name}" discount coupon?` 
      : `${m.points} পয়েন্ট খরচ করে "${m.name}" ডিসকাউন্ট কুপনটি আনলক করবেন?`
    );
    if (!confirmRedeem) return;

    const code = `ECO-LYL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newCoupon = {
      code,
      value: m.reward,
      type: m.name,
      pointsCost: m.points,
      date: new Date().toISOString().split('T')[0],
      used: false
    };

    setSpentPoints(prev => prev + m.points);
    setRedeemedCoupons(prev => [newCoupon, ...prev]);
    alert(lang === 'EN' 
      ? `Successfully claimed & unlocked ${m.name}! Code is: ${code}` 
      : `সফলভাবে ${m.name} আনলক এবং দাবি করা হয়েছে! কোড হলো: ${code}`
    );
  };

  const handleMarkCouponUsed = (code: string) => {
    setRedeemedCoupons(prev => prev.map(c => c.code === code ? { ...c, used: !c.used } : c));
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: pName, photoURL: pPhoto });
    alert('Profile updated successfully!');
  };

  const handleGenerateDsPack = async (prodId: string) => {
    const matched = products.find(p => p._id === prodId);
    if (!matched) return;

    setDsGenLoading(true);
    setDsGeneratedPack(null);
    try {
      const res = await fetch("/api/dropship-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: matched })
      });
      const data = await res.json();
      if (data.pack) {
        setDsGeneratedPack(data.pack);
        setDsGenSource(data.source);
      } else {
        throw new Error("Ad blueprint packaging structure issue");
      }
    } catch (err: any) {
      console.error("Ad copy generation failed", err);
      alert("Failed to reach marketing generator. Retrying local formula...");
    } finally {
      setDsGenLoading(false);
    }
  };

  const handleDsSyncStock = () => {
    setDsStockSyncing(true);
    setTimeout(() => {
      setDsStockSyncing(false);
      triggerSupplierSync();
    }, 1200);
  };

  const handleRunSeoAnalysis = async (prodId: string) => {
    const matched = products.find(p => p._id === prodId);
    if (!matched) return;

    setSeoLoading(true);
    setSeoAnalysisResult(null);
    setSeoAnalyzeError(null);
    setSeoSource(null);

    try {
      const res = await fetch("/api/seo-health-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: matched, trends: dsTrendsList })
      });
      const data = await res.json();
      if (data && data.result) {
        setSeoAnalysisResult(data.result);
        setSeoSource(data.source);
      } else {
        throw new Error(data.error || "SEO health data parsing issue");
      }
    } catch (err: any) {
      console.error("SEO health analysis failed", err);
      setSeoAnalyzeError(err.message || "Failed to reach SEO backend service.");
    } finally {
      setSeoLoading(false);
    }
  };

  const handleAddTrendKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrendKeyword.trim()) return;

    const newTrend = {
      keyword: newTrendKeyword.trim().toLowerCase(),
      volume: Math.floor(Math.random() * 41) + 55, // 55 to 95
      category: "custom",
      trend: "up" as const
    };

    setDsTrendsList(prev => [...prev, newTrend]);
    setNewTrendKeyword('');
  };

  const handleRemoveTrendKeyword = (keyword: string) => {
    setDsTrendsList(prev => prev.filter(t => t.keyword !== keyword));
  };

  const handleApplySeoSuggestions = () => {
    if (!seoSelectedProductId || !seoAnalysisResult) return;
    const currentProd = products.find(p => p._id === seoSelectedProductId);
    if (!currentProd) return;

    const updatedProd: Product = {
      ...currentProd,
      title: seoAnalysisResult.suggestedTitle,
      description: seoAnalysisResult.suggestedDesc
    };

    updateProduct(updatedProd);
    alert("🎉 Metadata successfully synchronized! The product's search index was updated on the storefront.");
    
    // Refresh audit score to show perfect compliance
    setSeoAnalysisResult((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        score: 98,
        analysis: prev.analysis.map((item: any) => {
          if (item.item.includes("Title") || item.item.includes("Description") || item.item.includes("Trend") || item.item.includes("Alignment")) {
            return {
              ...item,
              grade: "A",
              status: "Optimized",
              feedback: "Perfectly optimized and fully compliant with latest organic Google Search patterns."
            };
          }
          return item;
        }),
        matchedKeywords: dsTrendsList.map(t => t.keyword).slice(0, 3)
      };
    });
  };

  const handleRequestBdPayout = () => {
    if (dsBdPendingProfit <= 0) {
      alert("No pending escrow profits available for disbursement. Complete and deliver customer CODs to accumulate escrow.");
      return;
    }
    const requestAmount = dsBdPendingProfit;
    const randomTxId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    const channelName = dsBdPayoutChannel === 'bkash' ? "bKash Core Wallet" : dsBdPayoutChannel === 'nagad' ? "Nagad Business" : dsBdPayoutChannel === 'rocket' ? "Rocket DBBL" : "BD Local Bank Transfer";
    
    setDsBdPendingProfit(0);
    setDsBdEarnedProfitPaid(prev => prev + requestAmount);
    
    const newTx = {
      id: randomTxId,
      channel: channelName,
      amount: requestAmount,
      date: new Date().toISOString().split('T')[0],
      status: "Successful",
      recipient: dsBdPayoutPhone || "01712-345678"
    };
    
    setDsBdPayoutHistory(prev => [newTx, ...prev]);
    
    const logLine = `[${new Date().toLocaleTimeString()}] DISBURSED SUCCESS > Transferred ৳${requestAmount.toLocaleString()} BDT via ${channelName} to ${newTx.recipient}. Ref: ${randomTxId}.`;
    setDsBdLogs(prev => [logLine, ...prev].slice(0, 30));
  };

  const handleProductCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodDesc) {
      alert('Please specify name and features.');
      return;
    }
    addProduct({
      title: prodTitle,
      category: prodCat,
      sub_category: prodSubCat,
      price: Number(prodPrice),
      quantity: Number(prodQty),
      description: prodDesc,
      gallery: [prodImg],
      currency: 'BDT'
    });
    alert(`Success! "${prodTitle}" added to the shop catalog!`);
    
    // reset form
    setProdTitle('');
    setProdDesc('');
    setProdPrice(100);
    setProdQty(50);
  };

  const handleAssignDelivery = (orderId: string) => {
    if (!selectedDelMan || !delDate) {
      alert('Please specify delivery personnel and date!');
      return;
    }
    updateOrderStatus(orderId, 'onTheWay', selectedDelMan, delDate);
    setAssigningId(null);
    setSelectedDelMan('');
    setDelDate('');
    alert('Order transitioned to logistics "On The Way" successfully!');
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    alert('Congratulations! Order delivered and closed successfully.');
  };

  return (
    <div className="space-y-10 pb-20 text-left">
      
      {/* Profile Welcome space */}
      <section className="bg-slate-9 border border-slate-100 p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 shadow-sm bg-stone-50">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow shrink-0 bg-slate-200">
          <img
            src={user.photoURL || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1 flex-1 text-center sm:text-left">
          <span className="text-[10px] font-extrabold text-[#008D7F] bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {user.role} workspace
          </span>
          <h1 className="font-display font-black text-2xl text-gray-900">{user.name}</h1>
          <p className="text-xs font-semibold text-gray-400 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
        </div>

        <div className="text-center sm:text-right text-[10px] text-gray-400 font-bold uppercase tracking-wider space-y-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-inner shrink-0 leading-relaxed">
          <span>Seeded Dashboard Testing Account</span>
          <p className="text-xs text-[#008D7F] font-black tracking-normal">Fully Interactive & Responsive</p>
        </div>
      </section>

      {/* Grid Menu Tabs Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Navigation Links depending/acting on active role */}
        <div className="lg:col-span-3 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-[#008D7F] mb-3">
            Menu Navigation
          </h2>

          <nav className="flex flex-col gap-1.5 text-xs font-bold text-gray-500">
            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'users' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Users List ({allUsers.length})
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'orders' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Active Orders ({orders.filter(o => o.status !== 'completed').length})
                </button>

                <button
                  onClick={() => setActiveTab('completed')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'completed' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  Order Completed ({orders.filter(o => o.status === 'completed').length})
                </button>

                <button
                  onClick={() => setActiveTab('product-create')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'product-create' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Plus className="w-4.5 h-4.5" />
                  Add Products Create
                </button>

                <button
                  onClick={() => setActiveTab('dropship-automation')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'dropship-automation' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                  Dropship AI & Social Sales Hub
                </button>

                <button
                  onClick={() => setActiveTab('seo-health-checker')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'seo-health-checker' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Globe className="w-4 h-4 text-teal-600" />
                  SEO Health Checker
                </button>
              </>
            )}

            {user.role === 'delivery' && (
              <>
                <button
                  onClick={() => setActiveTab('my-order')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'my-order' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Assignments On Way ({orders.filter(o => o.deliveryMan === user.name && o.status === 'onTheWay').length})
                </button>

                <button
                  onClick={() => setActiveTab('my-completed')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'my-completed' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  My Completed Deliveries ({orders.filter(o => o.deliveryMan === user.name && o.status === 'completed').length})
                </button>

                <button
                  onClick={() => setActiveTab('my-profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'my-profile' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  My Profile Details
                </button>
              </>
            )}

            {user.role === 'user' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'dashboard' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {lang === 'EN' ? 'Purchases Dashboard' : 'ক্রয় বিবরণী ড্যাশবোর্ড'}
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'wishlist' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  {lang === 'EN' ? 'My Wishlist' : 'আমার উইশলিস্ট'} ({wishlist.length})
                </button>

                <button
                  onClick={() => setActiveTab('loyalty')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'loyalty' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Award className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                  {lang === 'EN' ? 'Loyalty Rewards' : 'লয়্যালটি পুরস্কার'}
                </button>

                <button
                  onClick={() => setActiveTab('my-profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'my-profile' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  {lang === 'EN' ? 'Edit Profile settings' : 'প্রোফাইল সেটিং পরিবর্তন'}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Side Pane: Tab values rendered cleanly */}
        <div className="lg:col-span-9 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm min-h-[450px]">
          
          {/* USER CUSTOMER TAB: WISHLIST */}
          {activeTab === 'wishlist' && user.role === 'user' && (
            <div className="space-y-8">
              <div className="border-b border-gray-55 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-black text-lg text-gray-900 font-sans">
                    {lang === 'EN' ? 'My Saved Wishlist' : 'আমার সংরক্ষিত উইশলিস্ট'}
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    {lang === 'EN' 
                      ? 'Browse, buy directly, or manage items saved in your account preferences.' 
                      : 'আপনার অ্যাকাউন্টে সংরক্ষিত পণ্যসমূহ দেখুন, সরাসরি কিনুন অথবা পরিচালনা করুন।'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#008D7F] bg-teal-50 px-3 py-1.5 rounded-full select-none">
                  {wishlist.length} {lang === 'EN' ? 'Items Saved' : 'টি পণ্য সংরক্ষিত'}
                </span>
              </div>

              {wishlist.length === 0 ? (
                <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-400 font-semibold space-y-4">
                  <div className="text-4xl animate-bounce">❤️</div>
                  <p className="max-w-xs mx-auto text-gray-500 font-bold leading-relaxed">
                    {lang === 'EN' 
                      ? 'Your wishlist is currently empty! Add jewelry or electronic items from our category lists.' 
                      : 'আপনার উইশলিস্ট বর্তমানে খালি আছে! আমাদের ক্যাটাগরি তালিকা থেকে পছন্দসই পণ্য যোগ করুন।'}
                  </p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="px-6 py-3 bg-[#008D7F] hover:bg-[#981849] text-white font-extrabold text-xs rounded-xl transition shadow active:scale-95"
                  >
                    {lang === 'EN' ? 'Go to Shop Catalog' : 'শপ ক্যাটালগে ফিরে যান'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((p) => (
                    <div 
                      key={p._id} 
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group relative"
                    >
                      {/* Product Thumbnail image area */}
                      <div className="h-44 overflow-hidden relative bg-slate-50 select-none border-b border-gray-50 shrink-0">
                        <img 
                          src={p.gallery[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300'} 
                          alt={p.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          onClick={() => navigate('/product/' + p._id)}
                        />
                        <button
                          onClick={() => {
                            removeFromWishlist(p._id);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-550 text-rose-500 hover:bg-rose-50 shadow-sm transition active:scale-95 cursor-pointer z-10"
                          title={lang === 'EN' ? "Remove from favorite products" : "পছন্দের তালিকা থেকে মুছুন"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-3 left-3 text-[10px] font-bold text-[#008D7F] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                          {p.category}
                        </span>
                      </div>

                      {/* Info and Actions Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between text-left space-y-3 font-semibold">
                        <div className="space-y-1">
                          <h4 
                            className="font-display font-bold text-sm text-slate-850 text-slate-800 hover:text-[#008D7F] transition cursor-pointer line-clamp-2"
                            onClick={() => navigate('/product/' + p._id)}
                          >
                            {p.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                            <span className="text-amber-500 text-xs">★</span> 
                            <span className="text-gray-600">{p.rating} / 5</span>
                            <span className="mx-1 text-gray-300">•</span>
                            <span className={p.quantity > 0 ? "text-emerald-600" : "text-rose-600"}>
                              {p.quantity > 0 
                                ? (lang === 'EN' ? 'In Stock' : 'স্টকে আছে') 
                                : (lang === 'EN' ? 'Out of Stock' : 'স্টক শেষ')}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-105 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-gray-400 block leading-none uppercase tracking-wider">
                              {lang === 'EN' ? 'Price' : 'মূল্য'}
                            </span>
                            <span className="font-display font-black text-[#008D7F] text-sm">
                              {convertPrice(p.price)}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              addToCart(p, 1);
                              alert(lang === 'EN' ? `"${p.title}" successfully added to cart!` : `"${p.title}" কার্টে সফলভাবে যোগ করা হয়েছে!`);
                            }}
                            className="px-3 py-2 bg-[#008D7F] hover:bg-[#981849] text-white rounded-lg text-[11px] font-black shadow-sm flex items-center gap-1 hover:shadow active:scale-95 transition leading-snug"
                            disabled={p.quantity <= 0}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{lang === 'EN' ? 'Buy Now' : 'কিনুন'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USER CUSTOMER TAB: LOYALTY REWARDS */}
          {activeTab === 'loyalty' && user.role === 'user' && (
            <div className="space-y-8 text-left">
              <div className="border-b border-gray-100 dark:border-zinc-800 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-black text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500 animate-bounce" />
                    {lang === 'EN' ? 'Loyalty Rewards Club' : 'লয়্যালটি পুরস্কার ক্লাব'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {lang === 'EN' 
                      ? 'Earn points with every purchase and unlock high-value premium coupons.' 
                      : 'প্রতিটি ক্রয়ের মাধ্যমে পয়েন্ট অর্জন করুন এবং আকর্ষণীয় প্রিমিয়াম কুপন আনলক করুন।'}
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1.5 bg-stone-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-500 dark:text-gray-350">
                  {lang === 'EN' ? 'Accrual: 1 Pt / ৳50 Spent' : 'নিয়ম: প্রতি ৫০৳ ক্রয়ে ১ পয়েন্ট'}
                </div>
              </div>

              {/* Status & Point summary widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Point Balance Card */}
                <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-100 dark:border-teal-950/40 p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                      {lang === 'EN' ? 'Active Usable Balance' : 'ব্যবহারযোগ্য পয়েন্ট ব্যালেন্স'}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-4xl text-gray-900 dark:text-gray-50">{currentPoints}</span>
                      <span className="text-xs font-extrabold text-[#008D7F] dark:text-teal-400">PTS</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold pt-1">
                      <span>{lang === 'EN' ? 'Lifetime Accrued:' : 'সর্বমোট অর্জিত:'} <strong>{totalEarnedPoints} Pts</strong></span>
                      <span className="text-gray-300">•</span>
                      <span>{lang === 'EN' ? 'Spent:' : 'ব্যয়িত:'} <strong>{spentPoints} Pts</strong></span>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-500/10 rounded-2xl text-[#008D7F] dark:text-teal-300 relative shrink-0">
                    <Gift className="w-10 h-10 animate-pulse" />
                    {pendingPoints > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-400 border-2 border-white dark:border-zinc-900 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded-full animate-bounce" title={`${pendingPoints} pts pending tracking approval`}>
                        +{pendingPoints}
                      </span>
                    )}
                  </div>
                </div>

                {/* Membership tier Level Card */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl flex items-center justify-between relative overflow-hidden shadow-sm">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      {lang === 'EN' ? 'Your Privilege Tier' : 'আপনার সুবিধা লেভেল'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full border ${currentBadge.color}`}>
                        {currentBadge.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed pt-1.5 pr-2">
                      {totalEarnedPoints >= 1000 
                        ? (lang === 'EN' ? 'VIP Status: You qualify for free local express logistics and exclusive preview items!' : 'ভিআইপি স্ট্যাটাস: আপনি এক্সপ্রেস ফ্রি ডেলিভারি এবং বিশেষ অফারের সুবিধা পাবেন!')
                        : (lang === 'EN' ? `Unlocks remaining levels at Silver (250 pts), Gold (500 pts) and Platinum (1000 pts)` : `সিলভার (২৫০), গোল্ড (৫০০) ও প্ল্যাটিনাম (১০০০) পরবর্তী লেভেলে আপগ্রেড হবে।`)}
                    </p>
                  </div>

                  <div className="p-4 bg-amber-500/10 dark:bg-amber-950/20 rounded-2xl text-amber-500 shrink-0">
                    <Award className="w-10 h-10" />
                  </div>
                </div>
              </div>

              {/* Progress Bar with target milestones */}
              <div className="bg-stone-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800 p-6 md:p-8 rounded-2xl space-y-5 relative">
                <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                  <div>
                    <span className="font-bold text-gray-400 uppercase tracking-wider">
                      {lang === 'EN' ? 'Next Reward Progression' : 'পরবর্তী পুরস্কারের অগ্রগতি'}
                    </span>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mt-1 font-sans">
                      {currentPoints >= 1000 ? (
                        lang === 'EN' 
                          ? "🎉 Max Level Achieved! You can redeem all milestone rewards indefinitely!" 
                          : "🎉 সর্বোচ্চ লেভেল অর্জিত! আপনি যেকোনো মাইলফলক পুরস্কার বারবার নিতে পারবেন!"
                      ) : (
                        lang === 'EN' 
                          ? `Progressing toward ${nextMilestone.name} (৳${nextMilestone.reward} Reward)`
                          : `অগ্রসর হচ্ছেন ${nextMilestone.name}-এর দিকে (পুরস্কার ৳${nextMilestone.reward})`
                      )}
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#008D7F] bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-md">
                    {progressPercentage}% {lang === 'EN' ? 'Completed' : 'সম্পন্ন'}
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-gray-200/40 dark:border-zinc-750/50">
                    <div 
                      className="h-full bg-gradient-to-r from-[#008D7F] to-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  {/* Milestones nodes checklist */}
                  <div className="grid grid-cols-4 text-center text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider pt-1">
                    <div className={currentPoints >= 100 ? "text-[#008D7F] dark:text-teal-400" : ""}>
                      <span>100 PTS</span>
                      <span className="block text-[8px] font-semibold text-gray-400 dark:text-gray-500">Bronze</span>
                    </div>
                    <div className={currentPoints >= 250 ? "text-[#008D7F] dark:text-teal-400" : ""}>
                      <span>250 PTS</span>
                      <span className="block text-[8px] font-semibold text-gray-400 dark:text-gray-500">Silver</span>
                    </div>
                    <div className={currentPoints >= 500 ? "text-[#008D7F] dark:text-teal-400" : ""}>
                      <span>500 PTS</span>
                      <span className="block text-[8px] font-semibold text-gray-400 dark:text-gray-500">Gold</span>
                    </div>
                    <div className={currentPoints >= 1000 ? "text-[#008D7F] dark:text-teal-400" : ""}>
                      <span>1000 PTS</span>
                      <span className="block text-[8px] font-semibold text-gray-400 dark:text-gray-500">Platinum</span>
                    </div>
                  </div>
                </div>

                {currentPoints < nextMilestone.points && (
                  <p className="text-[11px] text-[#008D7F] dark:text-teal-400 font-bold text-center mt-2">
                    💡 {lang === 'EN'
                      ? `Purchase more luxury jewelry and crafts. Only ${nextMilestone.points - currentPoints} points needed to unlock next coupon!`
                      : `আরও ক্রয়ের মাধ্যমে পয়েন্ট বাড়ান। পরবর্তী কুপন পেতে আর মাত্র ${nextMilestone.points - currentPoints} পয়েন্ট প্রয়োজন!`}
                  </p>
                )}
              </div>

              {/* Coupon Milestone Redeem List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-[#008D7F] dark:text-gray-300">
                  {lang === 'EN' ? 'Available Milestone Discount Rewards' : 'ডিসকাউন্ট কুপন রিডিম করুন'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {milestones.map((m) => {
                    const isUnlocked = currentPoints >= m.points;
                    return (
                      <div 
                        key={m.id} 
                        className={`border rounded-2xl p-5 text-center flex flex-col justify-between space-y-4 group transition-all duration-300 ${
                          isUnlocked 
                            ? 'bg-gradient-to-br from-white to-teal-50/25 dark:from-zinc-900 dark:to-teal-950/10 border-teal-200 dark:border-teal-900/60 shadow-sm hover:shadow-md' 
                            : 'bg-gray-50/50 dark:bg-zinc-900/30 border-gray-150 dark:border-zinc-800/80 opacity-80'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                            isUnlocked ? 'bg-teal-50 dark:bg-teal-950/40 text-[#008D7F] dark:text-teal-450 animate-pulse' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-550'
                          }`}>
                            {isUnlocked ? <Gift className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                          </div>

                          <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">{m.points} PTS COST</p>
                            <h5 className="text-sm font-bold text-gray-850 dark:text-gray-200 line-clamp-1 mt-0.5">{m.name}</h5>
                            <p className="text-[11px] font-black text-[#008D7F] dark:text-teal-400 mt-1.5 bg-teal-500/10 dark:bg-teal-950/40 px-2.5 py-1 rounded inline-block">
                              {lang === 'EN' ? 'Value:' : 'মূল্য:'} {convertPrice(m.reward)} {lang === 'EN' ? 'OFF' : 'ছাড়'}
                            </p>
                          </div>
                        </div>

                        {isUnlocked ? (
                          <button
                            onClick={() => handleRedeemPoints(m)}
                            className="w-full py-2 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-[10px] rounded-xl transition duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider shadow"
                          >
                            <span>{lang === 'EN' ? 'Claim Coupon' : 'দাবি করুন'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="py-2 bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1 shadow-inner select-none cursor-not-allowed">
                            <span className="font-mono">{m.points - currentPoints} PTS TO GO</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* My Unlocked Coupons Wallet */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-[#008D7F]">
                  {lang === 'EN' ? 'My Rewards Wallet' : 'আমার কুপন ওয়ালেট'}
                </h4>

                {redeemedCoupons.length === 0 ? (
                  <div className="bg-slate-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-2xl text-center text-xs text-gray-400 font-bold space-y-1.5 shadow-inner">
                    <p className="max-w-xs mx-auto text-gray-500 leading-relaxed font-semibold">
                      {lang === 'EN' 
                        ? 'Your rewards wallet is empty! Redeem earned points at the milestones above to unlock coupons.' 
                        : 'আপনার রিওয়ার্ড ওয়ালেট খালি! কুপন আনলক করতে উপরোক্ত মাইলফলকে পয়েন্ট ব্যবহার করুন।'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {redeemedCoupons.map((c) => (
                      <div 
                        key={c.code} 
                        className={`border rounded-2xl flex relative overflow-hidden transition-all duration-300 ${
                          c.used 
                            ? 'bg-gray-100/40 dark:bg-zinc-900/30 border-dashed border-gray-200 dark:border-zinc-805/85 opacity-60' 
                            : 'bg-white dark:bg-zinc-900 border-teal-150 dark:border-teal-900/40 shadow-sm shadow-teal-500/5 hover:border-teal-300'
                        }`}
                      >
                        {/* Circle punch hole cutout on divider */}
                        <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-800 shrink-0" />
                        
                        {/* Left split badge section of ticket */}
                        <div className="w-1/3 bg-teal-500/5 dark:bg-teal-950/15 border-r border-dashed border-gray-150 dark:border-zinc-800/60 p-4 shrink-0 flex flex-col justify-center items-center text-center">
                          <Ticket className={`w-5 h-5 mb-1.5 ${c.used ? 'text-gray-400' : 'text-[#008D7F] dark:text-teal-400'}`} />
                          <h6 className="font-display font-black text-sm text-gray-800 dark:text-gray-100 leading-none">
                            {convertPrice(c.value)}
                          </h6>
                          <span className="text-[8px] text-gray-450 dark:text-gray-500 font-semibold uppercase mt-1 leading-none">
                            {lang === 'EN' ? 'OFF DISCOUNT' : 'ডিসকাউন্ট ছাড়'}
                          </span>
                        </div>

                        {/* Right details of ticket */}
                        <div className="flex-1 p-4 pl-6 text-left flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <span className="text-[8px] font-black tracking-widest text-[#008D7F] dark:text-teal-400 block uppercase leading-none">
                              {c.type}
                            </span>
                            <p className="text-[10px] text-gray-400 font-extrabold leading-none mt-1.5">
                              {lang === 'EN' ? 'Unlocked: ' : 'উন্মুক্ত: '} {c.date}
                            </p>
                            
                            <div className="flex items-center gap-1.5 pt-2">
                              <span className={`font-mono font-black text-xs px-2 py-1 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-md select-all text-gray-800 dark:text-gray-200 ${c.used ? 'line-through opacity-50' : ''}`}>
                                {c.code}
                              </span>
                              
                              <button
                                onClick={() => handleCopyCode(c.code)}
                                disabled={c.used}
                                className="p-1 px-1.5 bg-gray-50 hover:bg-slate-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-md text-gray-500 hover:text-[#008D7F] active:scale-90 transition disabled:opacity-40"
                                title="Copy promo code coupon to clickboard"
                              >
                                {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800/60 pt-2 bg-transparent">
                            <span className={`text-[9px] font-black uppercase tracking-wider ${c.used ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {c.used ? (lang === 'EN' ? 'Redeemed/Used' : 'ব্যবহৃত') : (lang === 'EN' ? 'Ready & Valid' : 'সক্রিয় ও বৈধ')}
                            </span>
                            
                            <button
                              onClick={() => handleMarkCouponUsed(c.code)}
                              className={`px-2 py-1 text-[9px] font-black rounded-md cursor-pointer transition ${
                                c.used 
                                  ? 'bg-teal-50 dark:bg-teal-950/35 text-teal-700 dark:text-teal-450 hover:bg-teal-100' 
                                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                              }`}
                              title="Simulate applying or canceling this coupon usage status"
                            >
                              {c.used ? (lang === 'EN' ? 'Re-activate' : 'পুনরায় সক্রিয়') : (lang === 'EN' ? 'Mark Used' : 'ব্যবহার সম্পূর্ণ')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase Ledger */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-[#008D7F]">
                  {lang === 'EN' ? 'Transaction Ledger & Point Generation Tracking' : 'লেনদেন বিবরণী ও রিওয়ার্ড পয়েন্ট ট্র্যাকিং'}
                </h4>

                {userOrders.length === 0 ? (
                  <div className="bg-slate-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-2xl text-center text-xs text-gray-400 font-semibold shadow-inner">
                    {lang === 'EN' ? "No purchase logs found. Make orders in shop to accumulate loyalty points." : "কোনো ক্রয়ের ইতিহাস পাওয়া যায়নি। পয়েন্ট সংগ্রহ শুরু করতে শপ থেকে অর্ডার করুন।"}
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-100 dark:border-zinc-800 rounded-2xl text-[11px]">
                    <table className="w-full text-left font-semibold select-none border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 text-gray-400 select-none">
                          <th className="p-4 uppercase tracking-wider">{lang === 'EN' ? 'Order Reference ID' : 'অর্ডার রেফারেন্স আইডি'}</th>
                          <th className="p-4 uppercase tracking-wider">{lang === 'EN' ? 'Invoice Total' : 'মোট বিল'}</th>
                          <th className="p-4 uppercase tracking-wider">{lang === 'EN' ? 'Logistic Status' : 'ডেলিভারি স্থিতি'}</th>
                          <th className="p-4 uppercase tracking-wider">{lang === 'EN' ? 'Accrued Points' : 'অর্জিত পয়েন্ট'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 text-xs text-gray-800 dark:text-gray-300">
                        {userOrders.map((o) => {
                          const orderPoints = Math.floor(o.total / 50);
                          const isComplete = o.status === 'completed';
                          return (
                            <tr key={o._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/30">
                              <td className="p-4 font-mono font-bold">
                                {o._id.substr(0, 16)}...
                                <span className="block text-[9px] text-gray-400 mt-0.5 font-sans font-medium">{o.date}</span>
                              </td>
                              <td className="p-4 font-black text-[#008D7F] dark:text-teal-450">{convertPrice(o.total)}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  o.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50' :
                                  o.status === 'onTheWay' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border border-blue-200/50' : 
                                  'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200/50'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-4 font-bold">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={isComplete ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-amber-500 dark:text-amber-400 font-extrabold"}>
                                    {isComplete ? `+${orderPoints} PTS` : `+${orderPoints} PTS`}
                                  </span>
                                  {isComplete ? (
                                    <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 p-0.5 rounded-full leading-none font-bold" title="Points added to active balance">✔</span>
                                  ) : (
                                    <span className="text-amber-500 bg-amber-50 dark:bg-amber-950/45 px-1.5 py-0.5 text-[8px] rounded uppercase animate-duration-1000 align-middle inline-block whitespace-nowrap" title="Point activates fully when courier logistics changes to Delivered">{lang === 'EN' ? 'Pending delivery' : 'বিতরণ বাকি'}</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* USER CUSTOMER TAB: DASHBOARD */}
          {activeTab === 'dashboard' && user.role === 'user' && (
            <div className="space-y-8">
              <div className="border-b border-gray-50 dark:border-zinc-800 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900 dark:text-gray-100">Purchases & History Logs</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Control, cancel, or trace active invoices securely.</p>
              </div>

              {/* Loyalty Club quick banner */}
              <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-100 dark:border-teal-900/30 p-5 rounded-2xl flex justify-between items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 dark:bg-amber-950/20 rounded-xl text-amber-500 shrink-0">
                    <Award className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      {lang === 'EN' ? 'Loyalty Rewards Balance:' : 'লয়্যালটি পুরস্কার ব্যালেন্স:'} 
                      <span className="font-display font-black text-[#008D7F] dark:text-teal-400">{currentPoints} PTS</span>
                    </h4>
                    <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-0.5">
                      {lang === 'EN' 
                        ? `You are in ${currentBadge.name} Tier! Learn how to unlock up to ৳8,000 off discount coupons.`
                        : `আপনি বর্তমানে ${currentBadge.name} স্তরে আছেন! ৳৮,০০০ পর্যন্ত মূল্যের কুপন আনলক করার সুযোগ লুফে নিন।`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('loyalty')}
                  className="px-4 py-2 bg-[#008D7F] hover:bg-[#981849] hover:shadow text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1 transition duration-150 cursor-pointer text-left uppercase tracking-wider"
                >
                  <span>{lang === 'EN' ? 'Open Loyalty Wallet' : 'লয়্যালটি ওয়ালেট দেখুন'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stats overview boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</span>
                  <p className="font-display font-black text-2xl text-[#008D7F] mt-1">{convertPrice(userTotalSpent)}</p>
                </div>
                <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">On The Way</span>
                  <p className="font-display font-black text-2xl text-blue-600 mt-1">{userOnTheWay.length} items</p>
                </div>
                <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Orders</span>
                  <p className="font-display font-black text-2xl text-amber-600 mt-1">{userPending.length} items</p>
                </div>
              </div>

              {/* Real-time Order Tracker Block */}
              {userOrders.length > 0 && (() => {
                const trackedOrder = userOrders.find(o => o._id === selectedTrackOrderId) || userOrders[0];
                const isPending = trackedOrder.status === 'pending';
                const isWay = trackedOrder.status === 'onTheWay';
                const isCompleted = trackedOrder.status === 'completed';

                const getStepStatus = (stepIndex: number) => {
                  if (stepIndex === 1) return 'completed';
                  
                  if (stepIndex === 2) {
                    if (isPending) return 'active';
                    return 'completed';
                  }
                  
                  if (stepIndex === 3) {
                    if (isPending) return 'pending';
                    if (isWay) return 'active';
                    return 'completed';
                  }
                  
                  if (stepIndex === 4) {
                    if (isPending) return 'pending';
                    if (isWay) return 'active';
                    return 'completed';
                  }
                  
                  if (stepIndex === 5) {
                    if (isCompleted) return 'completed';
                    return 'pending';
                  }
                  
                  return 'pending';
                };

                return (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 text-left select-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-[#008D7F]/10 rounded-xl text-[#008D7F]">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-sm text-gray-800 tracking-wide uppercase flex items-center gap-1.5 font-sans">
                            {lang === 'EN' ? 'Live Shipment Tracker' : 'লাইভ শিপমেন্ট ট্র্যাকার'}
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          </h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider font-sans">
                            {lang === 'EN' ? 'Real-Time Logistics Telemetry Linked' : 'রিয়েল-টাইম লজিস্টিক সার্ভার লিঙ্কড'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase font-sans">{lang === 'EN' ? 'Track Order:' : 'অর্ডার নির্বাচন:'}</label>
                        <select
                          value={selectedTrackOrderId || ''}
                          onChange={(e) => setSelectedTrackOrderId(e.target.value)}
                          className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:ring-1 focus:ring-[#008D7F] focus:outline-none shadow-sm cursor-pointer"
                        >
                          {userOrders.map((o) => (
                            <option key={o._id} value={o._id}>
                              Reference {o._id.substr(0, 10)}... ({o.date})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Live Stepper Block */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
                        <div className="hidden sm:block absolute top-[22px] left-[10%] right-[10%] h-[1px] bg-slate-200 -z-1" />
                        
                        {/* Step 1: Placed */}
                        <div className="flex flex-col items-center text-center space-y-2 group">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-transform duration-300 ${
                            getStepStatus(1) === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-800 leading-tight">
                              {lang === 'EN' ? 'Order Placed' : 'অর্ডার করা হয়েছে'}
                            </p>
                            <span className="text-[9px] text-gray-400 font-semibold">{trackedOrder.date}</span>
                          </div>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="flex flex-col items-center text-center space-y-2 group">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            getStepStatus(2) === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : getStepStatus(2) === 'active'
                              ? 'bg-amber-400 border-amber-400 text-white animate-pulse scale-105'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-800 leading-tight">
                              {lang === 'EN' ? 'Quality & Pack' : 'কোয়ালিটি ও প্যাক'}
                            </p>
                            <span className="text-[9px] text-gray-400 font-semibold">
                              {getStepStatus(2) === 'completed' ? (lang === 'EN' ? 'Done' : 'সম্পন্ন') : getStepStatus(2) === 'active' ? (lang === 'EN' ? 'In Progress' : 'চলতি কাজ') : (lang === 'EN' ? 'Waiting' : 'অপেক্ষমান')}
                            </span>
                          </div>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="flex flex-col items-center text-center space-y-2 group">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            getStepStatus(3) === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : getStepStatus(3) === 'active'
                              ? 'bg-blue-500 border-blue-500 text-white animate-bounce scale-105'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            <Send className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-800 leading-tight">
                              {lang === 'EN' ? 'Dispatched' : 'শিপড ও ডিসপ্যাচড'}
                            </p>
                            <span className="text-[9px] text-gray-400 font-semibold">
                              {trackedOrder.deliveryMan ? (lang === 'EN' ? 'Truck Out' : 'ট্রাক রওনা') : (lang === 'EN' ? 'Pending Transit' : 'অপেক্ষমান')}
                            </span>
                          </div>
                        </div>

                        {/* Step 4: Out for Delivery */}
                        <div className="flex flex-col items-center text-center space-y-2 group">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            getStepStatus(4) === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : getStepStatus(4) === 'active'
                              ? 'bg-[#008D7F] border-[#008D7F] text-white animate-pulse scale-105'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-800 leading-tight">
                              {lang === 'EN' ? 'On The Way' : 'ডেলিভারিতে আছে'}
                            </p>
                            <span className="text-[9px] text-gray-400 font-semibold">
                              {trackedOrder.deliveryMan ? trackedOrder.deliveryMan : (lang === 'EN' ? 'Not Assigned' : 'দায়িত্ব দেয়া হয়নি')}
                            </span>
                          </div>
                        </div>

                        {/* Step 5: Delivered */}
                        <div className="flex flex-col items-center text-center space-y-2 group">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-transform duration-300 ${
                            getStepStatus(5) === 'completed'
                              ? 'bg-[#008D7F] border-[#008D7F] text-white'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            <PackageCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-800 leading-tight">
                              {lang === 'EN' ? 'Delivered' : 'বিতরণ সম্পন্ন'}
                            </p>
                            <span className="text-[9px] text-gray-400 font-semibold">
                              {getStepStatus(5) === 'completed' ? (trackedOrder.deliveryDate || trackedOrder.date) : (lang === 'EN' ? 'Awaiting Drop' : 'বাকি আছে')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Detailed logistics telemetry state box */}
                      <div className="bg-white border border-gray-150/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1.5 flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-duration-1000"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008D7F]"></span>
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wide">
                              {lang === 'EN' ? 'Logistics Telemetry Feed' : 'লজিস্টিক ফিড স্ট্যাটাস'}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                            {isPending && (lang === 'EN' 
                              ? '📍 Status: Pending Administrative approval. EcoBazar artisans are compiling your selected jewelry sets.' 
                              : '📍 স্ট্যাটাস: কর্তৃপক্ষের অনুমোদনের অপেক্ষায় আছে। কারিগর দল আপনার জুয়েলারি কম্বো সংগ্রহ করছেন।')}
                            {isWay && (lang === 'EN'
                              ? `📍 Status: En route. Handover committed to logistics rider "${trackedOrder.deliveryMan || 'Mishuk RJ'}". Est arrival: ${trackedOrder.deliveryDate || 'Within 48 hours'}`
                              : `📍 স্ট্যাটাস: অন-রুট। আপনার পার্সেলটি আমাদের লজিস্টিক রাইডার "${trackedOrder.deliveryMan || 'মিশুক আরজে'}" এর মাধ্যমে পাঠানো হয়েছে। সম্ভাব্য তারিখ: ${trackedOrder.deliveryDate || '৪৮ ঘণ্টার মধ্যে'}`)}
                            {isCompleted && (lang === 'EN'
                              ? `📍 Status: Fully Delivered. Product delivered safely under COD invoice by "${trackedOrder.deliveryMan || 'Mishuk RJ'}" on ${trackedOrder.deliveryDate}. Thank you for purchasing.`
                              : `📍 স্ট্যাটাস: সম্পূর্ণ ডেলিভারি। ক্যাশ-অন-ডেলিভারি ইনভয়েস অনুসারে "${trackedOrder.deliveryMan || 'মিশুক আরজে'}" গত ${trackedOrder.deliveryDate} নিরাপদে বিতরণ সম্পন্ন করেছেন। পাশে থাকার জন্য ধন্যবাদ!`)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                          <button
                            onClick={handleRefreshTracking}
                            disabled={isTrackingLoading}
                            className="px-3.5 py-2.5 bg-gray-100 hover:bg-slate-200 disabled:opacity-50 text-gray-600 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer max-w-[155px]"
                            title={lang === 'EN' ? "Force real-time log refresh" : "লজিস্টিক সিঙ্ক করুন"}
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isTrackingLoading ? 'animate-spin' : ''}`} />
                            <span>{isTrackingLoading ? (lang === 'EN' ? 'Syncing...' : 'লিস্ট সিঙ্ক...') : (lang === 'EN' ? 'Sync Server' : 'রিয়েল-টাইম সিঙ্ক')}</span>
                          </button>

                          <button
                            onClick={() => handleDemoAdvanceStatus(trackedOrder._id, trackedOrder.status)}
                            className="px-3 py-2.5 bg-[#008D7F]/10 hover:bg-[#008D7F]/20 text-[#008D7F] rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                            title="Advance this order status for testing stepper transitions in real-time"
                          >
                            ⚡ {lang === 'EN' ? 'Simulate State Update' : 'স্ট্যাটাস পরিবর্তন করুন'}
                          </button>
                        </div>
                      </div>
                      
                      {trackingStatusMessage && (
                        <div className="p-3 bg-teal-50 border border-[#008D7F]/20 rounded-xl text-teal-800 text-[10px] font-bold uppercase tracking-wider animate-pulse text-center">
                          📡 {trackingStatusMessage}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Orders List for user */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Your transactions</h4>
                
                {userOrders.length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-400 font-semibold">
                    You haven't placed any orders yet. Head to shop to purchase jewellery combos!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((o) => (
                      <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-4 text-xs font-semibold">
                        <div className="flex flex-wrap justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 gap-2">
                          <div>
                            <p className="font-bold text-gray-700">Order Reference ID: <span className="text-[#008D7F] font-black">{o._id}</span></p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Date: {o.date}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            o.status === 'onTheWay' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                        </div>

                        {/* order items list */}
                        <div className="space-y-3 pl-1">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="w-10 h-10 rounded border border-gray-50 overflow-hidden shrink-0 bg-slate-100">
                                <img src={item.image} alt="com" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-750 line-clamp-1">{item.title}</p>
                                <p className="text-gray-400 text-[10px]">{item.quantity} units x {convertPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order info foot block */}
                        <div className="border-t border-gray-50 pt-3 flex flex-wrap justify-between items-center text-xs gap-3">
                          <p className="text-gray-400 font-bold">Invoiced cod: <span className="font-display font-black text-sm text-gray-800">{convertPrice(o.total)}</span></p>
                          {o.deliveryMan && (
                            <p className="text-gray-500 bg-gray-50 border border-gray-100/50 px-2 py-1 rounded-md text-[10px]">
                              🚚 Delivery logistics: <strong className="text-gray-700">{o.deliveryMan}</strong> ({o.deliveryDate})
                            </p>
                          )}
                          {o.status === 'pending' && (
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure? You won't be able to revert this!")) {
                                  deleteOrder(o._id);
                                  alert('Order canceled successfully.');
                                }
                              }}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-bold leading-normal border border-rose-100 active:scale-95 transition"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SHARED EDIT PROFILE TAB */}
          {activeTab === 'my-profile' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Personal Info Details</h3>
                <p className="text-xs text-[#008D7F] font-bold uppercase mt-0.5">{user.role} profile workspace</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avatar Image URL</label>
                  <input
                    type="text"
                    value={pPhoto}
                    onChange={(e) => setPPhoto(e.target.value)}
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#008D7F] hover:bg-[#981849] text-white font-extrabold text-xs rounded-xl transition shadow"
                >
                  Save Profile Updates
                </button>
              </form>
            </div>
          )}

          {/* ADMIN TABS: USER LIST */}
          {activeTab === 'users' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">User accounts Directory ({allUsers.length})</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Directory listing of customers, administrator, and active logistics boy accounts.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold select-none border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-gray-400 border-b border-gray-100 select-none">
                      <th className="p-4 uppercase tracking-wider">Member Details</th>
                      <th className="p-4 uppercase tracking-wider">Email coordinate</th>
                      <th className="p-4 uppercase tracking-wider">Registered Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allUsers.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={u.photoURL} alt="a" className="w-9 h-9 rounded-full object-cover shadow border border-white" />
                          <span className="font-bold text-gray-800">{u.name}</span>
                        </td>
                        <td className="p-4 text-gray-400 font-semibold">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-100' :
                            u.role === 'delivery' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADMIN TABS: ACTIVE ORDERS CONTROL */}
          {activeTab === 'orders' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Active Invoices Coordinator</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Admin panel to dispatch pending parcels or inspect logistics delivery dates.</p>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.status !== 'completed').length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-440">
                    No active/pending orders left. Everything is delivered!
                  </div>
                ) : (
                  orders.filter(o => o.status !== 'completed').map((o) => (
                    <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-4 text-xs">
                      
                      <div className="flex flex-wrap justify-between items-center bg-gray-50 p-3 rounded-xl gap-2 font-bold select-none border border-gray-105">
                        <div>
                          <p className="text-gray-800">Order: <span className="text-[#008D7F] font-black">{o._id}</span></p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Date: {o.date} | Cost: ৳{o.total.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                            o.status === 'onTheWay' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                          
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure? You won't be able to revert this!")) {
                                deleteOrder(o._id);
                                alert('Order record deleted.');
                              }
                            }}
                            className="p-1 text-rose-400 hover:text-rose-600 outline-none"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* address sheet */}
                      <div className="grid grid-cols-2 gap-4 text-left border-b border-gray-50 pb-3 font-semibold text-[11px] text-gray-500">
                        <div>
                          <p className="font-bold text-gray-700">Billing Coordinate</p>
                          <p className="mt-1">{o.name} ({o.phone})</p>
                          <p className="text-[10px] text-gray-400">{o.email}</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-700">Street Coordinates</p>
                          <p className="mt-1 leading-relaxed text-[10px]">{o.address}</p>
                          {o.notes && <p className="mt-1 italic text-amber-600 block text-[9px]">Notes: {o.notes}</p>}
                        </div>
                      </div>

                      {/* delivery assign drop */}
                      <div className="space-y-3">
                        <p className="font-extrabold text-[#008D7F] uppercase tracking-wider text-[10px]">Logistics Distribution</p>
                        
                        {o.deliveryMan ? (
                          <div className="flex flex-wrap items-center justify-between gap-3 bg-teal-50/50 p-3 rounded-lg border border-teal-100">
                            <div>
                              <p className="font-bold text-gray-700">Assigned Logistics: <span className="text-[#008D7F]">{o.deliveryMan}</span></p>
                              <p className="text-[10px] text-gray-400 mt-0.5">Assigned Target Date: {o.deliveryDate}</p>
                            </div>
                            
                            <button
                              onClick={() => handleMarkDelivered(o._id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 font-extrabold text-[10px] text-white rounded-lg transition active:scale-95"
                            >
                              ✓ Force Delivered
                            </button>
                          </div>
                        ) : (
                          <div>
                            {assigningId === o._id ? (
                              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">Select delivery boy</label>
                                  <select
                                    value={selectedDelMan}
                                    onChange={(e) => setSelectedDelMan(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[11px] font-bold"
                                  >
                                    <option value="">-- Choose --</option>
                                    {deliveryMen.map(d => (
                                      <option key={d.email} value={d.name}>{d.name}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">Est Delivery Date</label>
                                  <input
                                    type="date"
                                    value={delDate}
                                    onChange={(e) => setDelDate(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[11px] font-bold"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAssignDelivery(o._id)}
                                    className="flex-1 py-2 bg-[#008D7F] text-white font-bold text-[10px] rounded active:scale-95 transition"
                                  >
                                    Dispatch
                                  </button>
                                  <button
                                    onClick={() => setAssigningId(null)}
                                    className="px-2.5 py-2 bg-gray-200 text-gray-600 font-bold text-[10px] rounded"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setAssigningId(o._id);
                                  setSelectedDelMan('');
                                  setDelDate('');
                                }}
                                className="px-4 py-2 bg-[#008D7F] hover:bg-[#9c1343] text-white font-bold text-[10px] rounded-lg transition active:scale-95"
                              >
                                🚚 Assign Delivery Log boy & Date
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ADMIN TABS: ORDER COMPLETED */}
          {activeTab === 'completed' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Historic Delivered Transactions</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Logs of orders marked as completed and delivered to customer doorsteps.</p>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.status === 'completed').length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-450 font-semibold">
                    No historic orders recorded.
                  </div>
                ) : (
                  orders.filter(o => o.status === 'completed').map((o) => (
                    <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-3 text-xs font-semibold text-gray-500">
                      <div className="flex justify-between items-center bg-[#008d7f0e] px-3.5 py-2.5 rounded-xl border border-teal-50 text-[11px]">
                        <div>
                          <p className="font-bold text-gray-800">Order ID: <span className="text-[#008D7F] font-black">{o._id}</span></p>
                          <p className="text-[9px] text-gray-450 mt-0.5">Approved and Delivered: {o.deliveryDate}</p>
                        </div>
                        
                        <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ Completed
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <div>
                          <p className="text-gray-800 font-bold">{o.name}</p>
                          <p className="text-[10px] text-gray-450 mt-0.5">{o.email} | {o.phone}</p>
                        </div>
                        <p className="font-display font-black text-gray-800 text-sm">
                          ৳{o.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ADMIN TABS: ADD PRODUCTS CREATE */}
          {activeTab === 'product-create' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Create New Collection Product</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Introduce beautiful handicraft jewelry sets or cooling fans into our listings instantly.</p>
              </div>

              <form onSubmit={handleProductCreateSubmit} className="space-y-4 max-w-xl text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    placeholder="e.g. Traditional oxidised jhumka combo sets, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Select *</label>
                    <select
                      value={prodCat}
                      onChange={(e) => {
                        setProdCat(e.target.value);
                        setProdSubCat(e.target.value);
                      }}
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#008D7F] text-gray-650"
                    >
                      <option value="Earrings">Earrings</option>
                      <option value="Jewelry Set">Jewelry Set</option>
                      <option value="Kids Jewelry Sets">Kids Jewelry Sets</option>
                      <option value="Mini Fan">Mini Fan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={prodQty}
                      onChange={(e) => setProdQty(Number(e.target.value))}
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Price (BDT ৳) *</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image Banner URL *</label>
                    <input
                      type="text"
                      required
                      value={prodImg}
                      onChange={(e) => setProdImg(e.target.value)}
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detailed Description Features *</label>
                  <textarea
                    required
                    rows={4}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    placeholder="Provide features like: Hypoallergenic hooks, oxidised silver beaded fringing, rechargeable battery details, etc."
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 pr-8 mt-2"
                >
                  <Plus className="w-4.5 h-4.5" />
                  Save as active product listing
                </button>
              </form>
            </div>
          )}

          {/* ADMIN TABS: DROPSHIP AI & SALES AUTOMATION HUB */}
          {activeTab === 'dropship-automation' && user.role === 'admin' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-display font-black text-2xl text-gray-950 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-teal-600 animate-pulse" />
                    Dropship & Omnichannel AI Marketing Command Center
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    Configure automated margin rules, sync suppliers stock in real-time, generate conversion-focused social media campaigns, and track multi-channel traffic.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-100/60 text-teal-800 border border-teal-200/50 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                    Auto-Sync Engine: Active
                  </span>
                </div>
              </div>

              {/* SECTION 1: GLOBAL DROPSHIP PRICING PRICING & AUTO MARGIN ENGINE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-6 lg:col-span-1">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <SlidersHorizontal className="w-4 h-4 text-[#008D7F]" />
                      Global Markup Strategy
                    </h4>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      Establish dynamic profit-margin algorithms. Prices across the site update in real-time based on rules.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Cost Multiplier Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-black text-gray-750">
                        <span>Cost Multiplier Factor</span>
                        <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md border border-teal-100">{dsPriceMultiplier}x</span>
                      </div>
                      <input 
                        type="range"
                        min="1.5"
                        max="4.0"
                        step="0.1"
                        value={dsPriceMultiplier}
                        onChange={(e) => setDsPriceMultiplier(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008D7F]"
                      />
                      <p className="text-[9px] text-gray-400 font-semibold">
                        Multiplier applied on raw supplier wholesale cost (e.g., $10 wholesale cost * {dsPriceMultiplier} = ${(10 * dsPriceMultiplier).toFixed(2)} retail).
                      </p>
                    </div>

                    {/* Fixed Handling & Packaging Markup Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-black text-gray-750">
                        <span>Fixed Surcharge Insurance</span>
                        <span className="bg-[#008D7F]/5 text-[#008D7F] px-2 py-0.5 rounded-md border border-teal-100">৳{dsFixedMarkup} BDT</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={dsFixedMarkup}
                        onChange={(e) => setDsFixedMarkup(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008D7F]"
                      />
                      <p className="text-[9px] text-gray-400 font-semibold">
                        Fixed buffer to cover premium international dropshipping ePacket shipping charges and custom boutique box packaging.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 text-[10px] space-y-2.5">
                    <span className="font-bold text-gray-600 uppercase tracking-widest">Expected Strategy Simulation:</span>
                    <div className="space-y-1.5 select-none font-semibold text-gray-500">
                      <div className="flex justify-between">
                        <span>Avg Supplier Cost:</span>
                        <span className="text-gray-900 font-bold">$12.50 USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Calculated Selling Price:</span>
                        <span className="text-gray-900 font-bold">${(12.50 * dsPriceMultiplier + dsFixedMarkup/120).toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between text-[#008D7F] pt-1.5 border-t border-dashed border-gray-200 font-black">
                        <span>Simulated Profit Margin:</span>
                        <span>{Math.round((((12.50 * dsPriceMultiplier + dsFixedMarkup/120) - 12.50) / (12.50 * dsPriceMultiplier + dsFixedMarkup/120)) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Supplier Synchronization Grid */}
                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 lg:col-span-2 flex flex-col justify-between">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                        <Truck className="w-4.5 h-4.5 text-[#008D7F]" />
                        Automated Supplier Mapping & Status
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Active product catalog linked directly with high-efficiency overseas dropshipping fulfillment nodes.
                      </p>
                    </div>

                    <button
                      onClick={handleDsSyncStock}
                      disabled={dsStockSyncing}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
                        dsStockSyncing 
                          ? 'bg-amber-100 text-amber-800 border-amber-200' 
                          : 'bg-[#008D7F] hover:bg-[#9c1343] text-white'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${dsStockSyncing ? 'animate-spin' : ''}`} />
                      {dsStockSyncing ? 'Syncing Feeds...' : 'Sync Supplier stock'}
                    </button>
                  </div>

                  {/* Products dropship map list container */}
                  <div className="overflow-y-auto max-h-[280px] pr-2 mt-4 space-y-3">
                    {products.slice(0, 5).map(p => {
                      const costData = dsProductCostMap[p._id] || { cost: 35, shipping: 6, supplier: "AliExpress Dropshipping", syncedStatus: true };
                      const totalCost = costData.cost + costData.shipping;
                      const formulasPrice = Math.round(totalCost * dsPriceMultiplier + dsFixedMarkup);
                      
                      return (
                        <div key={p._id} className="border border-gray-100 p-3 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50 hover:bg-slate-50 transition duration-150">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-150 bg-white shrink-0">
                              <img src={p.gallery[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left space-y-0.5">
                              <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase">{p.category}</span>
                              <h5 className="font-display font-black text-xs text-gray-800 line-clamp-1">{p.title}</h5>
                              <p className="text-[9px] text-gray-400 font-semibold">Linked Supplier: <span className="font-bold text-teal-855">{costData.supplier}</span></p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 justify-between sm:justify-end shrink-0 select-none">
                            <div className="text-left sm:text-right space-y-0.5 font-semibold text-[10px]">
                              <p className="text-gray-400">Dropship Wholesale Cost:</p>
                              <p className="text-gray-800 font-black">
                                {currency === 'USD' ? `$${(totalCost / 120).toFixed(2)}` : `৳${totalCost.toLocaleString()}`}
                              </p>
                            </div>

                            <div className="text-left sm:text-right space-y-0.5 font-semibold text-[10px]">
                              <p className="text-gray-400">Auto Formula Retail Sales Price:</p>
                              <p className="text-teal-700 font-extrabold flex items-center gap-1">
                                {currency === 'USD' ? `$${(formulasPrice / 120).toFixed(2)}` : `৳${formulasPrice.toLocaleString()}`}
                                <span className="text-[8px] bg-teal-50 text-teal-800 border border-teal-100 px-1.5 py-0.2 rounded-full font-black animate-pulse">Auto</span>
                              </p>
                            </div>

                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
                              Synced
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 2: AI SOCIAL MEDIA AD & SEO METADATA CAMPAIGN BUILDER */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-50">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-4.5 h-4.5 text-teal-600 animate-pulse" />
                      Social Media Omni-Ad AI Generator (FB, IG, TikTok, Google SEO)
                    </h4>
                    <p className="text-[10px] text-gray-450 font-semibold">
                      Leverage Gemini 3.5-Flash to craft highly-engaging ad creatives, viral video scripts, hashtags, Google Search ads, and SEO metadata.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto shrink-0 flex-wrap">
                    <div className="flex-1 md:flex-initial min-w-[200px]">
                      <select
                        value={selectedDsProduct}
                        onChange={(e) => setSelectedDsProduct(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-teal-500 hover:bg-slate-100/50"
                      >
                        {products.map(p => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleGenerateDsPack(selectedDsProduct)}
                      disabled={dsGenLoading || !selectedDsProduct}
                      className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 shadow transition disabled:opacity-50 shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Cpu className={`w-3.5 h-3.5 ${dsGenLoading ? 'animate-spin' : ''}`} />
                      {dsGenLoading ? 'Composing...' : 'Write Omni-Campaign Ads'}
                    </button>
                  </div>
                </div>

                {/* If AI is generating content */}
                {dsGenLoading && (
                  <div className="py-20 text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 animate-pulse" />
                      <Cpu className="w-8 h-8 text-teal-600 animate-spin absolute top-4 left-4" style={{ animationDuration: '2.5s' }} />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                      <h4 className="font-display font-black text-xs text-gray-800 tracking-wider uppercase animate-pulse">Consulting Digital Copywriting Experts</h4>
                      <div className="bg-slate-950 font-mono text-[9px] text-teal-550 border border-zinc-850 p-4 rounded-xl text-left h-24 overflow-y-auto space-y-1">
                        <p>{`> [AIS AI Engine] Activating dropshipping marketing model...`}</p>
                        <p>{`> [AIS AI Engine] Compiling consumer hooks and FOMO parameters...`}</p>
                        <p className="animate-pulse">{`> [AIS AI] Writing copy frameworks based on conversion triggers...`}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active generated copy displays */}
                {!dsGenLoading && dsGeneratedPack ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-4 rounded-2xl">
                      <p className="text-xs text-teal-900 font-bold select-none flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 uppercase" />
                        <span>Ad copywriting assets generated successfully!</span>
                      </p>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-center">
                        {dsGenSource === 'gemini_api' ? 'Model: Gemini 3.5' : 'Model: Local Copywriter Heuristics'}
                      </span>
                    </div>

                    {/* Social ad platform tabs */}
                    <div className="flex flex-wrap border-b border-gray-100 text-xs font-bold gap-1">
                      {[
                        { id: 'facebook', label: 'Facebook Feeds ad' },
                        { id: 'instagram', label: 'Instagram Lifestyle' },
                        { id: 'tiktok', label: 'TikTok Creative Video' },
                        { id: 'google', label: 'Google Search PPC' },
                        { id: 'seo', label: 'Google SEO tags' }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setDsAdTargetTab(t.id as any)}
                          className={`px-4 py-2.5 rounded-t-xl transition duration-150 ${
                            dsAdTargetTab === t.id 
                              ? 'bg-[#008D7F]/10 text-[#008D7F] border-b-2 border-[#008D7F]' 
                              : 'text-gray-500 hover:bg-slate-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Visual Tab Rendering Panel */}
                    <div className="bg-slate-50/50 border border-gray-100 rounded-3xl p-6 relative">
                      {dsAdTargetTab === 'facebook' && (
                        <div className="space-y-4 text-left">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">Facebook Ad Copy</span>
                            <h4 className="text-xs font-black text-gray-800">{dsGeneratedPack.facebookAd?.headline || "Headline Loading"}</h4>
                          </div>

                          <div className="bg-white border border-gray-105 p-4 rounded-2xl relative">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${dsGeneratedPack.facebookAd?.headline}\n\n${dsGeneratedPack.facebookAd?.primaryText}`);
                                setDsCopiedFeedback('fb');
                                setTimeout(() => setDsCopiedFeedback(null), 1500);
                              }}
                              className="absolute top-3 right-3 p-1.5 bg-slate-50 text-gray-600 rounded-lg hover:bg-[#008D7F] hover:text-white transition cursor-pointer"
                            >
                              {dsCopiedFeedback === 'fb' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Primary Ad Body Text</p>
                            <pre className="text-xs font-semibold font-sans text-gray-800 whitespace-pre-wrap leading-relaxed pr-8">
                              {dsGeneratedPack.facebookAd?.primaryText}
                            </pre>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-teal-500/5 border border-teal-500/10 p-4 rounded-2xl">
                              <p className="text-[10px] uppercase font-black text-teal-800 tracking-wider mb-1">Conversion Hook Strategy</p>
                              <p className="text-xs font-semibold text-teal-980">{dsGeneratedPack.facebookAd?.hook}</p>
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
                              <p className="text-[10px] uppercase font-black text-emerald-800 tracking-wider mb-1">Targeting Audiences Demographics</p>
                              <p className="text-xs font-semibold text-emerald-930">{dsGeneratedPack.facebookAd?.targetAudienceSuggestion}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {dsAdTargetTab === 'instagram' && (
                        <div className="space-y-4 text-left">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">Instagram Branding feed</span>
                            <h4 className="text-xs font-black text-gray-850">Aesthetic lifestyle marketing captions</h4>
                          </div>

                          <div className="bg-white border border-gray-100 p-4 rounded-2xl relative">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${dsGeneratedPack.instagramAd?.caption}\n\n${dsGeneratedPack.instagramAd?.hashtags}`);
                                setDsCopiedFeedback('ig');
                                setTimeout(() => setDsCopiedFeedback(null), 1500);
                              }}
                              className="absolute top-3 right-3 p-1.5 bg-slate-50 text-gray-600 rounded-lg hover:bg-[#008D7F] hover:text-white transition cursor-pointer"
                            >
                              {dsCopiedFeedback === 'ig' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Insta Caption Body</p>
                            <pre className="text-xs font-semibold font-sans text-gray-800 whitespace-pre-wrap leading-relaxed pr-8">
                              {dsGeneratedPack.instagramAd?.caption}
                            </pre>
                            <p className="text-xs text-indigo-600 font-bold mt-3">{dsGeneratedPack.instagramAd?.hashtags}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-100 border border-gray-200 p-4 rounded-2xl">
                              <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider mb-1">Aesthetic Creative Vibe Direction</p>
                              <p className="text-xs font-semibold text-gray-750">{dsGeneratedPack.instagramAd?.aestheticVibeGuide}</p>
                            </div>
                            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl">
                              <p className="text-[10px] uppercase font-black text-amber-800 tracking-wider mb-1">Influencer Collaboration Seed</p>
                              <p className="text-xs font-semibold text-amber-950">{dsGeneratedPack.instagramAd?.influencerCollabIdea}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {dsAdTargetTab === 'tiktok' && (
                        <div className="space-y-4 text-left">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-900 text-white px-2.5 py-0.5 rounded-full">TikTok Viral Script</span>
                            <h4 className="text-xs font-black text-gray-850">Short-form creative blueprints</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-8 space-y-4">
                              <div className="bg-white border border-gray-100 p-4 rounded-2xl relative">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${dsGeneratedPack.tiktokAd?.videoHook3s}\n\n${dsGeneratedPack.tiktokAd?.visualScriptOutline}`);
                                    setDsCopiedFeedback('tiktok');
                                    setTimeout(() => setDsCopiedFeedback(null), 1500);
                                  }}
                                  className="absolute top-3 right-3 p-1.5 bg-slate-50 text-gray-600 rounded-lg hover:bg-[#008D7F] hover:text-white transition cursor-pointer"
                                >
                                  {dsCopiedFeedback === 'tiktok' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Filming Video Blueprint Script</p>
                                <pre className="text-xs font-semibold font-sans text-gray-800 whitespace-pre-wrap leading-relaxed pr-8">
                                  {dsGeneratedPack.tiktokAd?.visualScriptOutline}
                                </pre>
                              </div>
                            </div>

                            <div className="md:col-span-4 space-y-4">
                              <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl">
                                <p className="text-[10px] uppercase font-black text-rose-800 tracking-wider mb-1">3-Second Viral Hook</p>
                                <p className="text-xs font-extrabold text-rose-950 leading-relaxed italic">"{dsGeneratedPack.tiktokAd?.videoHook3s}"</p>
                              </div>
                              <div className="bg-zinc-100 border border-zinc-200 p-4 rounded-xl">
                                <p className="text-[10px] uppercase font-black text-zinc-650 tracking-wider mb-1">Audio/Music Recommendations</p>
                                <p className="text-xs font-semibold text-zinc-950">{dsGeneratedPack.tiktokAd?.musicVibeSuggestion}</p>
                              </div>
                              <div className="bg-teal-500/5 border border-teal-500/10 p-4 rounded-xl">
                                <p className="text-[10px] uppercase font-black text-teal-800 tracking-wider mb-1 font-sans">Viral Trend Overlay</p>
                                <p className="text-xs font-semibold text-teal-930">{dsGeneratedPack.tiktokAd?.trendingChallengeIntegration}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {dsAdTargetTab === 'google' && (
                        <div className="space-y-4 text-left">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-yellow-105 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Google Search PPC Text Ad</span>
                            <h4 className="text-xs font-black text-gray-850">Maximizing High-intent Search Click-Through-Rate</h4>
                          </div>

                          <div className="bg-white border border-gray-100 p-5 rounded-2xl max-w-xl mx-auto space-y-3 font-sans shadow-sm select-none">
                            <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                              <span className="font-extrabold text-stone-700 bg-gray-150 px-1 py-0.2 rounded text-[8px] uppercase tracking-wider border">Sponsor</span>
                              <span>https://www.ecobazar.store/premium-dropship-offers</span>
                            </p>
                            <h5 className="text-blue-800 hover:underline text-base font-medium leading-tight cursor-pointer">
                              {dsGeneratedPack.googleAd?.headline1} | {dsGeneratedPack.googleAd?.headline2}
                            </h5>
                            <p className="text-xs text-gray-605 text-gray-700 font-normal leading-normal">
                              {dsGeneratedPack.googleAd?.descriptionText}
                            </p>
                          </div>

                          <div className="bg-amber-100/30 border border-amber-200/50 p-4 rounded-2xl select-none text-left">
                            <p className="text-[10px] uppercase font-black text-amber-850 tracking-wider mb-1">Target PPC Keywords to purchase</p>
                            <p className="text-xs font-semibold text-amber-950 font-mono italic">{dsGeneratedPack.googleAd?.targetedKeywords}</p>
                          </div>
                        </div>
                      )}

                      {dsAdTargetTab === 'seo' && (
                        <div className="space-y-4 text-left">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-teal-100 text-teal-850 px-2.5 py-0.5 rounded-full">Organic Search Engine Optimization</span>
                            <h4 className="text-xs font-black text-gray-850">Secure and claim high position in organic searches</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                              <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                                <div>
                                  <span className="text-[10px] text-gray-400 font-extrabold uppercase animate-pulse">Optimized Meta Title Tag</span>
                                  <h5 className="text-sm font-black text-gray-800 mt-0.5">{dsGeneratedPack.seoMetaData?.seoTitle}</h5>
                                </div>
                                <div className="pt-2 border-t border-gray-50">
                                  <span className="text-[10px] text-gray-400 font-extrabold uppercase">Optimized Meta description tag</span>
                                  <p className="text-xs text-gray-600 font-semibold mt-0.5 leading-relaxed">{dsGeneratedPack.seoMetaData?.metaDescription}</p>
                                </div>
                                <div className="pt-2 border-t border-gray-50 flex justify-between">
                                  <div>
                                    <span className="text-[10px] text-gray-400 font-extrabold uppercase">Localized URL slug structure</span>
                                    <p className="text-xs font-mono text-gray-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-gray-100 mt-1">/collections/{dsGeneratedPack.seoMetaData?.productSlug}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">LSI Semantic keywords list</span>
                                <p className="text-xs font-semibold font-mono text-gray-700">{dsGeneratedPack.seoMetaData?.LSIKeywords}</p>
                              </div>

                              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800">SEO Backlink recommendations</span>
                                <p className="text-xs font-semibold text-emerald-950 leading-normal">{dsGeneratedPack.seoMetaData?.backlinkRecomm}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-gray-100 rounded-3xl p-12 text-center text-xs font-bold text-gray-450 select-none">
                    Select any catalog items above and click "Write Omni-Campaign Ads" to summon high-converting copywriting.
                  </div>
                )}
              </div>

              {/* SECTION 3: AUTOMATED SUPPLIER SYNC COMMAND ENGINE & TELEMETRY STREAM */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-150">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Database className="w-5 h-5 text-teal-600 animate-pulse" />
                      Automated Supplier Polling & Sync Scheduler
                    </h4>
                    <p className="text-[10px] text-gray-400 font-semibold text-left">
                      Periodically pull inventory counts, wholesale cost changes, and international shipping carrier status milestones into the store local state.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 select-none">
                    {/* Active/Inactive Status LED */}
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                      dsAutoSyncActive 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/50 animate-pulse'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${dsAutoSyncActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'} inline-block`} />
                      {dsAutoSyncActive ? 'Polling: Active' : 'Polling: Inactive'}
                    </span>

                    {/* Play/Pause Control Trigger */}
                    <button
                      onClick={() => setDsAutoSyncActive(!dsAutoSyncActive)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center gap-1.5 border hover:opacity-90 cursor-pointer ${
                        dsAutoSyncActive 
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' 
                          : 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700'
                      }`}
                    >
                      {dsAutoSyncActive ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          Pause Auto-Sync
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Start Auto-Sync
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-grid of controls & logs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Control Panel */}
                  <div className="lg:col-span-5 bg-slate-50/50 border border-gray-100 p-5 rounded-3xl space-y-4 text-left">
                    <h5 className="font-display font-black text-xs text-gray-800 uppercase tracking-wider">
                      Scheduler Directives
                    </h5>

                    {/* Frequency config */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Sync interval speed</label>
                      <select
                        value={dsSyncInterval}
                        onChange={(e) => setDsSyncInterval(parseInt(e.target.value))}
                        disabled={dsAutoSyncActive}
                        className="w-full bg-white border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-teal-500 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
                      >
                        <option value="5">Every 5 seconds (Fast Test)</option>
                        <option value="10">Every 10 seconds (Simulated)</option>
                        <option value="20">Every 20 seconds (Balanced)</option>
                        <option value="30">Every 30 seconds (Production-like)</option>
                      </select>
                      {dsAutoSyncActive && (
                        <p className="text-[9px] text-amber-600 font-semibold italic">Pause polling action first to update frequency times.</p>
                      )}
                    </div>

                    {/* Integrated Providers checklist */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider block">Integrate Dropshipping Channels</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'cj', name: "CJ Dropship" },
                          { key: 'aliexpress', name: "AliExpress" },
                          { key: 'dhgate', name: "DHGate Bulk" }
                        ].map(prov => (
                          <label key={prov.key} className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-gray-100 cursor-pointer hover:bg-slate-50 transition">
                            <input
                              type="checkbox"
                              checked={dsSyncProviders[prov.key]}
                              onChange={(e) => setDsSyncProviders(prev => ({ ...prev, [prov.key]: e.target.checked }))}
                              className="accent-teal-600"
                            />
                            <span className="text-[10px] font-extrabold text-[#008D7F]">{prov.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Sync Metrics panel */}
                    <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between text-[11px] font-bold">
                      <div className="space-y-0.5">
                        <p className="text-gray-400">Successful API sync runs:</p>
                        <p className="text-gray-800 font-black text-xs">{dsSyncCount} Sync Cycles</p>
                      </div>

                      <div className="space-y-0.5 text-right">
                        <p className="text-gray-400">Last Synced Timestamp:</p>
                        <p className="text-teal-700 font-black text-xs">{dsLastSyncTime || "In Queue"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Terminal Output logs */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Fulfillment Outbound Logging Terminal</span>
                      <button
                        onClick={() => {
                          setDsSyncLogs([`[${new Date().toLocaleTimeString()}] > System log buffer explicitly purged by administrator.`]);
                        }}
                        className="text-[9px] font-black text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-2.5 py-1 rounded cursor-pointer"
                      >
                        Purge logs
                      </button>
                    </div>

                    <div className="bg-slate-950 font-mono text-[10px] p-4 rounded-3xl h-[180px] overflow-y-auto block space-y-1 text-left select-text border border-neutral-900 shadow-inner">
                      {dsSyncLogs.map((log, index) => {
                        let colorClass = "text-emerald-400";
                        if (log.includes("WARNING")) {
                          colorClass = "text-amber-500";
                        } else if (log.includes("STOCK UPDATED")) {
                          colorClass = "text-teal-300 font-bold";
                        } else if (log.includes("PRICING MARGIN")) {
                          colorClass = "text-indigo-400";
                        } else if (log.includes("BACKGROUND ENGINE")) {
                          colorClass = "text-blue-400 font-semibold";
                        } else if (log.includes("SUCCESS")) {
                          colorClass = "text-emerald-400";
                        } else if (log.includes("SHIFT")) {
                          colorClass = "text-amber-300 font-semibold";
                        }
                        return (
                          <p key={index} className={colorClass}>
                            {log}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Dashboard Multi-channel telemetry status meters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2 border-t border-gray-100">
                  <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-left space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      Facebook Pixel Conversions
                    </span>
                    <h5 className="font-display font-black text-xl text-gray-800">429 <span className="text-xs text-emerald-500 font-bold ml-1">+14%</span></h5>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Estimated CPC: $0.34</p>
                  </div>

                  <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-left space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                      Instagram Influencers CTR
                    </span>
                    <h5 className="font-display font-black text-xl text-gray-800">4.82% <span className="text-xs text-emerald-500 font-bold ml-1">+8%</span></h5>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">8 micro influencers active</p>
                  </div>

                  <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-left space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-stone-900 inline-block animate-bounce" />
                      TikTok video views
                    </span>
                    <h5 className="font-display font-black text-xl text-gray-800">18.9K <span className="text-xs text-rose-500 font-bold ml-1">Viral</span></h5>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Trend: ScreenSwipe Active</p>
                  </div>

                  <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-left space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                      Google Search Imp.
                    </span>
                    <h5 className="font-display font-black text-xl text-gray-800">830 <span className="text-xs text-teal-600 font-bold ml-1">Rank #1</span></h5>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">9 SEO target slugs indexed</p>
                  </div>

                  <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-left space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      Completed Profit ROI
                    </span>
                    <h5 className="font-display font-black text-xl text-teal-700">৳89,340</h5>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Margin strategy: {dsPriceMultiplier}x active</p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: DYNAMIC PRICING ENGINE - COMPETITORS & SEO GOOGLE TRENDS OVERLAY */}
              <div id="dynamic-pricing-engine-container" className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-150">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                      Dynamic Real-time Pricing Engine
                    </h4>
                    <p className="text-[10px] text-gray-400 font-semibold text-left">
                      Machine-learning pricing compiler that targets competitor price undercutting, matches demand thresholds, and adjusts product selling pricing dynamically based on live Google Trends data.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 select-none">
                    {/* Active/Inactive Status indicator */}
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                      dsPricingAutoAdjust 
                        ? 'bg-amber-50 text-amber-800 border-amber-200/50 animate-pulse'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${dsPricingAutoAdjust ? 'bg-amber-500 animate-ping' : 'bg-slate-400'} inline-block`} />
                      {dsPricingAutoAdjust ? 'Dynamic Engine: Active' : 'Dynamic Engine: Static'}
                    </span>

                    {/* Activation Toggle Button */}
                    <button
                      onClick={() => setDsPricingAutoAdjust(!dsPricingAutoAdjust)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center gap-1.5 border hover:opacity-90 cursor-pointer ${
                        dsPricingAutoAdjust 
                          ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100' 
                          : 'bg-[#008D7F] text-white border-transparent hover:bg-teal-700'
                      }`}
                    >
                      {dsPricingAutoAdjust ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          Pause Pricing AI
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Activate Pricing AI
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Main Dynamic Pricing Engine Section Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Controls & Parameters Column */}
                  <div className="lg:col-span-4 bg-slate-50/50 border border-gray-100 p-5 rounded-3xl space-y-4 text-left font-sans">
                    <h5 className="font-display font-black text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-gray-500" />
                      Pricing Directives & Parameters
                    </h5>

                    {/* Selection of Active Strategy */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Dynamic Strategy Selection</label>
                      <select
                        value={dsPricingStrategy}
                        onChange={(e) => setDsPricingStrategy(e.target.value as any)}
                        className="w-full bg-white border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-amber-500 hover:bg-slate-50 cursor-pointer"
                      >
                        <option value="balanced">🔒 Balanced Defender (Match & Capture Premium)</option>
                        <option value="undercut">🔥 Aggressive Undercut (Target Lowest Price)</option>
                        <option value="seo-demand">📈 Google Trends SEO Demand Surge Overlay</option>
                        <option value="premium">💎 Elite Premium Margin Positioning</option>
                      </select>
                      <p className="text-[9px] text-gray-405 text-gray-500 font-medium italic select-none">
                        {dsPricingStrategy === 'balanced' && "Defends margins by slightly undercutting competitors, unless Google Trends indicators show high search index volume, in which case it captures an 8% premium."}
                        {dsPricingStrategy === 'undercut' && "Regularly monitors competitive catalog endpoints and forces EcoBazar prices below average competitor quotes to maximize volume."}
                        {dsPricingStrategy === 'seo-demand' && "Correlates high-velocity SEO search words with active collections, applying automatic multipliers that surge prices (+15%) or discount items (-7%)."}
                        {dsPricingStrategy === 'premium' && "Discards competitor undercutting completely to establish premium brand prestige, leveraging maximum cost-margin multipliers."}
                      </p>
                    </div>

                    {/* Pricing Undercut Margin slider */}
                    {dsPricingStrategy === 'undercut' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-black text-gray-750">
                          <span>Competitor Undercut rate</span>
                          <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-100">{dsUndercutPercent}%</span>
                        </div>
                        <input 
                          type="range"
                          min="1"
                          max="10"
                          step="0.5"
                          value={dsUndercutPercent}
                          onChange={(e) => setDsUndercutPercent(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <p className="text-[9px] text-gray-400 font-semibold">
                          The target margin factor to force prices lower than overall competitor averages during re-evaluations.
                        </p>
                      </div>
                    )}

                    {/* Simulation trigger */}
                    <div className="pt-2 border-t border-dashed border-gray-200">
                      <button
                        onClick={triggerDynamicPricingSync}
                        className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] transition text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Compile Real-time Market Re-evaluation
                      </button>
                      <p className="text-[9px] text-gray-400 text-center font-semibold mt-1.5 select-none">
                        Manually force the pricing algorithm to poll competitors and synthesize Google Trends indexing instantly.
                      </p>
                    </div>
                  </div>

                  {/* Right Dynamic Live Telemetry Column */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Google Trends Indices Box */}
                      <div className="md:col-span-6 bg-slate-50/30 border border-gray-100 p-4 rounded-3xl text-left space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-[10px] uppercase font-black text-gray-600 tracking-wider flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-sky-500" />
                            Google Trends SEO Monitoring
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded border">
                            Live Index
                          </span>
                        </div>

                        <div className="space-y-2.5 h-[160px] overflow-y-auto pr-1">
                          {dsTrendsList.map((trend, key) => (
                            <div key={key} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-2xl border border-gray-105 border-gray-100 hover:shadow-sm transition font-sans">
                              <div className="space-y-0.5 max-w-[70%]">
                                <p className="font-extrabold text-[#008D7F] truncate text-[11px]">{trend.keyword}</p>
                                <span className="text-[8px] uppercase font-black px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-gray-400">
                                  {trend.category}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="flex items-center gap-1">
                                  <span className="font-black text-gray-850 text-[11px]">{trend.volume}</span>
                                  {trend.trend === 'up' ? (
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : trend.trend === 'down' ? (
                                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full inline-block" />
                                  )}
                                </div>
                                <span className={`text-[8px] font-extrabold tracking-widest uppercase ${
                                  trend.trend === 'up' ? 'text-emerald-600' : trend.trend === 'down' ? 'text-rose-600' : 'text-slate-500'
                                }`}>
                                  {trend.trend === 'up' ? 'Surging' : trend.trend === 'down' ? 'Cooling' : 'Stable'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing Strategy Audit Terminal Logs Box */}
                      <div className="md:col-span-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-black text-gray-600 tracking-wider flex items-center gap-1.5">
                            <LineChart className="w-4 h-4 text-amber-500" />
                            Pricing Logic Audit logs
                          </span>
                          <button
                            onClick={() => {
                              setDsPricingLogs([`[${new Date().toLocaleTimeString()}] > System log buffer explicitly purged by pricing administrator.`]);
                            }}
                            className="text-[9px] font-black text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 px-2.5 py-1 rounded cursor-pointer"
                          >
                            Purge logs
                          </button>
                        </div>

                        <div className="bg-slate-950 font-mono text-[10px] p-4 rounded-3xl h-[160px] overflow-y-auto block space-y-1.5 text-left select-text border border-neutral-900 shadow-inner">
                          {dsPricingLogs.map((log, index) => {
                            let colorClass = "text-amber-400";
                            if (log.includes("ADJUSTED")) {
                              colorClass = "text-emerald-400 font-semibold";
                            } else if (log.includes("OPTIMAL")) {
                              colorClass = "text-slate-400";
                            } else if (log.includes("GOOGLE TRENDS")) {
                              colorClass = "text-sky-400 font-bold";
                            } else if (log.includes("STRATEGY")) {
                              colorClass = "text-indigo-400";
                            } else if (log.includes("DYNAMIC PRICING")) {
                              colorClass = "text-amber-500 font-semibold";
                            }
                            return (
                              <p key={index} className={colorClass}>
                                {log}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid layout of active product catalog mapped pricing details */}
                <div className="border-t border-gray-100 pt-5 space-y-3 text-left">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-sans">
                    <h5 className="font-display font-black text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" />
                      Continuous Market Matrix & Competitor Overlays
                    </h5>
                    <span className="text-[9px] font-bold text-gray-400 italic">
                      Updated in real-time by dynamic polling directives. Showing EcoBazar catalog against competitor rates.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => {
                      const costData = dsProductCostMap[p._id] || { cost: Math.floor(p.price * 0.35), shipping: 6, supplier: "AliExpress" };
                      const compData = dsCompetitorPrices[p._id] || { comp1: p.price, comp2: p.price, sourceComp1: "AliExpress", sourceComp2: "Daraz" };
                      const isJewelry = p.category.toLowerCase().includes("jewel") || p.category.toLowerCase().includes("ring") || p.category.toLowerCase().includes("bead");
                      const matchedTrends = dsTrendsList.filter(t => isJewelry ? t.category === "jewelry" : t.category === "gadgets");
                      const highestVolumeTrend = matchedTrends.length > 0 ? matchedTrends[0] : { keyword: "SEO volume", volume: 50 };

                      const compAvg = Math.round((compData.comp1 + compData.comp2) / 2);
                      const isOverpriced = p.price > compAvg * 1.05;
                      const isUnderpriced = p.price < compAvg * 0.92;
                      
                      let recommendBadge = (
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md font-extrabold uppercase select-none">
                          Optimal Pricing Mode
                        </span>
                      );

                      if (isOverpriced) {
                        recommendBadge = (
                          <span className="text-[9px] px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-md font-extrabold uppercase select-none animate-pulse">
                            Overpriced (-Margin Risk)
                          </span>
                        );
                      } else if (isUnderpriced) {
                        recommendBadge = (
                          <span className="text-[9px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-md font-extrabold uppercase select-none">
                            Discount Gap (+Margin Potential)
                          </span>
                        );
                      }

                      return (
                        <div key={p._id} className="bg-slate-50/50 p-4 border border-gray-100 rounded-3xl space-y-3.5 hover:shadow-sm transition font-sans">
                          <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-2.5">
                            <div className="space-y-0.5 truncate max-w-[65%]">
                              <h6 className="text-[11px] font-black text-gray-800 truncate" title={p.title}>{p.title}</h6>
                              <p className="text-[9px] uppercase font-black text-[#008D7F]">{p.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-gray-950">৳{p.price.toLocaleString()}</p>
                              <span className="text-[8px] font-bold text-gray-400 block uppercase">EcoBazar retail</span>
                            </div>
                          </div>

                          {/* Competitor list mapping */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] select-none">
                            <div className="bg-white border border-gray-100 p-2 rounded-2xl">
                              <span className="text-[8px] font-bold text-gray-400 block truncate">{compData.sourceComp1}</span>
                              <span className="font-extrabold text-slate-700">৳{compData.comp1.toLocaleString()}</span>
                            </div>
                            <div className="bg-white border border-gray-100 p-2 rounded-2xl">
                              <span className="text-[8px] font-bold text-gray-400 block truncate">{compData.sourceComp2}</span>
                              <span className="font-extrabold text-slate-700">৳{compData.comp2.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* SEO trends keyword analysis alignment overlay */}
                          <div className="bg-white border border-gray-100 p-2.5 rounded-2xl flex items-center justify-between text-[10px] font-semibold text-gray-500">
                            <div className="space-y-0.5 truncate max-w-[60%]">
                              <span className="text-[8px] uppercase font-bold text-gray-400 block">SEO Demand Term Match</span>
                              <span className="font-extrabold text-[#008D7F] truncate block">"{highestVolumeTrend.keyword}"</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[8px] uppercase font-bold text-gray-400 block">Relative interest</span>
                              <span className="font-black text-slate-800">{highestVolumeTrend.volume}/100</span>
                            </div>
                          </div>

                          {/* Recommendation and core wholesale markup stats */}
                          <div className="flex items-center justify-between text-[10px] font-bold select-none border-t border-dashed border-gray-100 pt-2.5">
                            <div className="space-y-0.5">
                              <span className="text-[8px] text-gray-400 block uppercase">Supplier Cost:</span>
                              <span className="text-gray-800">৳{costData.cost} (+ ৳{costData.shipping})</span>
                            </div>

                            <div className="text-right space-y-0.5">
                              <span className="text-[8px] text-gray-400 block uppercase">Status Badge</span>
                              {recommendBadge}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 5: MALAYSIAN/BANGLADESHI DROPSHIPPING.COM.BD REGIONAL STRATEGY CONTEXT */}
              <div id="bd-dropship-strategy-container" className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-6 mt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-150">
                  <div className="space-y-1 text-left">
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Truck className="w-5 h-5 text-teal-600 animate-pulse" />
                      LOCAL BD DROPSHIP HUB (powered by dropshipping.com.bd strategy)
                    </h4>
                    <p className="text-[10px] text-gray-400 font-semibold text-left">
                      National Cash-On-Delivery (COD) logistics wrapper integrated with Bangladesh third-party couriers, automatic white-label box rebranding, and escrow-based bKash/Nagad merchant profit disbursements.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 select-none">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                      dsBdStrategyActive 
                        ? 'bg-teal-50 text-[#008D7F] border-teal-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${dsBdStrategyActive ? 'bg-[#008D7F] animate-ping' : 'bg-slate-400'} inline-block`} />
                      {dsBdStrategyActive ? 'dropshipping.com.bd mode: Active' : 'dropshipping.com.bd mode: Suspended'}
                    </span>
                    
                    <button
                      onClick={() => setDsBdStrategyActive(!dsBdStrategyActive)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                    >
                      Toggle Local Strategy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* CARD 1: logistics tariff tool */}
                  <div className="lg:col-span-4 bg-slate-50/50 border border-gray-100 p-5 rounded-3xl space-y-4 text-left font-sans">
                    <div className="flex items-center gap-1.5 text-xs font-black text-gray-800 uppercase tracking-widest">
                      <Target className="w-4 h-4 text-teal-600" />
                      <span>3PL Courier & COD Tariffs</span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-gray-400">Preferred Local 3PL Provider</label>
                        <select
                          value={dsBdCourierPartner}
                          onChange={(e) => setDsBdCourierPartner(e.target.value as any)}
                          className="w-full bg-white border border-gray-150 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-teal-500 cursor-pointer"
                        >
                          <option value="steadfast">⚡ Steadfast Courier (Fastest Disbursement)</option>
                          <option value="pathao">🛵 Pathao Courier BD (Best Dhaka Coverage)</option>
                          <option value="redx">📦 REDX Logistics BD (Wide Outside Reach)</option>
                          <option value="paperfly">✈ Paperfly Delivery (Custom Air Cargo)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-gray-400">Target Delivery Zone Tariff</label>
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          {[
                            { id: 'inside', label: "Inside Dhaka", rate: 60 },
                            { id: 'suburbs', label: "Dhaka Suburbs", rate: 100 },
                            { id: 'outside', label: "Outside Dhaka", rate: 130 }
                          ].map(z => (
                            <button
                              key={z.id}
                              onClick={() => setDsBdZone(z.id as any)}
                              className={`p-2 rounded-xl border text-[10px] font-black transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                                dsBdZone === z.id 
                                  ? 'bg-teal-50 text-[#008D7F] border-[#008D7F]' 
                                  : 'bg-white hover:bg-slate-50 border-gray-150 text-gray-650'
                              }`}
                            >
                              <span>{z.label}</span>
                              <strong className="text-gray-950 font-black">৳{z.rate}</strong>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-black text-gray-400">1% COD Processing Tariff</span>
                          <p className="text-[9px] text-gray-400 font-semibold leading-tight">Charged by local couriers on cash collection</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={dsBdCodFeeEnable}
                          onChange={(e) => setDsBdCodFeeEnable(e.target.checked)}
                          className="w-4 h-4 accent-[#008D7F] cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-3 rounded-2xl flex justify-between items-center text-[10px]">
                      <span className="font-extrabold text-gray-500">Effective Courier Overhead:</span>
                      <strong className="text-gray-900 font-black text-xs">
                        ৳{dsBdZone === 'inside' ? 60 : dsBdZone === 'suburbs' ? 100 : 130} BDT 
                        {dsBdCodFeeEnable && " + 1% COD Fee"}
                      </strong>
                    </div>
                  </div>

                  {/* CARD 2: White Label Custom Box Packaging & Premium Invoice preview */}
                  <div className="lg:col-span-4 bg-slate-50/50 border border-gray-100 p-5 rounded-3xl space-y-4 text-left font-sans flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
                          <SlidersHorizontal className="w-4 h-4 text-[#008D7F]" />
                          White-Label Branding
                        </span>
                        <input
                          type="checkbox"
                          checked={dsBdWhiteLabelEnabled}
                          onChange={(e) => setDsBdWhiteLabelEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#008D7F] cursor-pointer"
                        />
                      </div>

                      <p className="text-[9px] text-gray-400 font-semibold leading-relaxed mt-1">
                        Dropshipping.com.bd acts behind the scenes. Buyer package is branded with your custom shop credentials.
                      </p>

                      {dsBdWhiteLabelEnabled && (
                        <div className="space-y-2.5 mt-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400">Merchant Store Title (Affixed to Box)</label>
                            <input
                              type="text"
                              value={dsBdStoreLogoText}
                              onChange={(e) => setDsBdStoreLogoText(e.target.value)}
                              className="w-full bg-white border border-gray-150 px-3 py-2 rounded-xl text-xs font-bold text-gray-850 focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          {/* Visual mockup review template */}
                          <div className="bg-white p-3 rounded-2xl border border-gray-200 space-y-2 pointer-events-none select-none">
                            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1.5 text-[8px] font-mono text-gray-400">
                              <span>OUTBOUND STRIP</span>
                              <span>BD-POST COLLECT COD</span>
                            </div>
                            <div className="space-y-1">
                              <h6 className="font-extrabold text-slate-800 text-[10px] tracking-tight">{dsBdStoreLogoText}</h6>
                              <p className="text-[8px] text-gray-400 font-bold whitespace-nowrap overflow-hidden">Fulfillment Node: dropshipping.com.bd Dhaka Whse</p>
                              <div className="flex justify-between text-[8px] text-teal-700 bg-slate-50 p-1.5 rounded border border-gray-100">
                                <span>Courier: {dsBdCourierPartner.toUpperCase()}</span>
                                <span className="font-black">COD COLLECT ✓</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {!dsBdWhiteLabelEnabled && (
                      <div className="py-8 text-center text-[10px] text-gray-400 font-bold bg-white border border-dashed border-gray-200 rounded-2xl italic">
                        Raw packaging strategy. Packages will ship standard white boxes with system logistic barcodes.
                      </div>
                    )}
                  </div>

                  {/* CARD 3: Escrow balances & bKash automatic payout disbursement */}
                  <div className="lg:col-span-4 bg-slate-50/50 border border-gray-100 p-5 rounded-3xl space-y-4 text-left font-sans flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-black text-gray-800 uppercase tracking-widest">
                        <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span>MFS Wallet Disbursements</span>
                      </div>

                      {/* Display Escrow balances */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-[#008D7F]/5 border border-[#008D7F]/10 p-2.5 rounded-2xl">
                          <span className="text-[8px] font-bold text-gray-400 block uppercase">Transit Payout Escrow</span>
                          <strong className="text-gray-900 font-black text-sm block mt-0.5">৳{dsBdPendingProfit.toLocaleString()}</strong>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl">
                          <span className="text-[8px] font-bold text-emerald-600 block uppercase">Settled available profit</span>
                          <strong className="text-teal-800 font-black text-sm block mt-0.5">৳{dsBdEarnedProfitPaid.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Form inputs */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 'bkash', label: "bKash" },
                            { id: 'nagad', label: "Nagad" },
                            { id: 'bank', label: "Bank DBBL" }
                          ].map(ch => (
                            <button
                              key={ch.id}
                              onClick={() => setDsBdPayoutChannel(ch.id as any)}
                              className={`py-1 rounded-xl border text-[9px] font-extrabold transition-all cursor-pointer ${
                                dsBdPayoutChannel === ch.id 
                                  ? 'bg-[#008D7F] text-white border-transparent w-full' 
                                  : 'bg-white hover:bg-slate-50 border-gray-100 text-gray-500 w-full'
                              }`}
                            >
                              {ch.label}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-gray-400">Recipient Mobile Wallet Number</label>
                          <input
                            type="text"
                            value={dsBdPayoutPhone}
                            onChange={(e) => setDsBdPayoutPhone(e.target.value)}
                            placeholder="e.g. 01712-345678"
                            className="w-full bg-white border border-gray-150 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-750 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-gray-400">Reseller Full Name Account Title</label>
                          <input
                            type="text"
                            value={dsBdAccountName}
                            onChange={(e) => setDsBdAccountName(e.target.value)}
                            className="w-full bg-white border border-gray-150 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-750 focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleRequestBdPayout}
                        disabled={dsBdPendingProfit <= 0}
                        className={`w-full py-2.5 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                          dsBdPendingProfit > 0 
                            ? 'bg-amber-500 hover:bg-amber-600 shadow-sm active:scale-[0.98]'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed border'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        Disburse Escrow collections to Mobile Wallet
                      </button>
                      <p className="text-[8px] text-gray-400 text-center font-bold mt-1 select-none">
                        Transfers dropshipping.com.bd collected COD revenues instantly to bKash/Nagad wallet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* LEDGER & SYSTEM LOGS */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 border-t border-gray-100 font-sans">
                  {/* Ledger Table */}
                  <div className="md:col-span-6 text-left space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-[10px] uppercase font-black text-gray-650 tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        bKash Profit Settlement Ledger
                      </span>
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 border-emerald-200 border px-2 py-0.5 rounded uppercase font-black tracking-widest">
                        Settled
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[10px]">
                        <thead>
                          <tr className="border-b border-gray-150 text-gray-400 uppercase font-black text-[9px]">
                            <th className="pb-2">Disbursement ID</th>
                            <th className="pb-2">Transfer Channel</th>
                            <th className="pb-2">Account No</th>
                            <th className="pb-2 text-right">Settled Amt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {dsBdPayoutHistory.map((tx, idx) => (
                            <tr key={idx} className="text-gray-750 font-semibold hover:bg-slate-50/50">
                              <td className="py-2.5 font-mono text-stone-500">{tx.id}</td>
                              <td className="py-2.5">
                                <span className="px-1.5 py-0.5 bg-gray-50 border rounded text-[8px] font-black text-[#008D7F] uppercase tracking-wider">
                                  {tx.channel}
                                </span>
                              </td>
                              <td className="py-2.5 font-mono">{tx.recipient}</td>
                              <td className="py-2.5 text-right font-black text-teal-800">৳{tx.amount.toLocaleString()} BDT</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* BD dropship log lines */}
                  <div className="md:col-span-6 text-left space-y-3 flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-[10px] uppercase font-black text-gray-650 tracking-wider flex items-center gap-1.5">
                        <LineChart className="w-4 h-4 text-[#008D7F]" />
                        bdDropship Operational Logging Terminal
                      </span>
                      
                      <button
                        onClick={() => {
                          setDsBdLogs([`[${new Date().toLocaleTimeString()}] > System log buffer explicitly purged by active dropship manager.`]);
                        }}
                        className="text-[8px] font-black text-[#008D7F] bg-teal-50 border border-teal-100 px-2 py-0.5 rounded cursor-pointer"
                      >
                        Reset logs
                      </button>
                    </div>

                    <div className="bg-slate-950 font-mono text-[9px] p-4 rounded-3xl h-[120px] overflow-y-auto block space-y-1.5 text-left select-text border border-neutral-900 shadow-inner">
                      {dsBdLogs.map((log, index) => {
                        let colorClass = "text-sky-450";
                        if (log.includes("DISBURSED SUCCESS")) {
                          colorClass = "text-emerald-400 font-semibold";
                        } else if (log.includes("LOGISTICS")) {
                          colorClass = "text-amber-400";
                        } else if (log.includes("WHITE-LABEL")) {
                          colorClass = "text-indigo-400";
                        } else if (log.includes("TRANSACTION UNLOCKED")) {
                          colorClass = "text-teal-300 font-bold animate-pulse";
                        }
                        return (
                          <p key={index} className={colorClass}>
                            {log}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TABS: SEO HEALTH CHECKER & GOOGLE TRENDS ANALYZER */}
          {activeTab === 'seo-health-checker' && user.role === 'admin' && (
            <div className="space-y-8 animate-fade-in text-left font-sans">
              <div className="border-b border-gray-100 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-2xl text-gray-950 flex items-center gap-2">
                      <Globe className="w-6 h-6 text-teal-600" />
                      SEO Health Checker & Search Trends Analyzer
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                      Audit your store items against organic search volume indices, simulate Search Engine spider indexing bots, and inject high-CTR titles and descriptions to claim higher ranking on Google.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      Google Trends Sync: Live
                    </span>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID Layout for configuration */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT BLOCK: Global targets and active trends keyword configurations */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Manage Keywords Targets Card */}
                  <div className="bg-slate-50/50 border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                      <Target className="w-4.5 h-4.5 text-blue-600" />
                      Active Google Trends Targets
                    </div>
                    <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                      These search query strings are currently polled to test matching density inside your product page titles and descriptions.
                    </p>

                    {/* Form to enter custom targets */}
                    <form onSubmit={handleAddTrendKeyword} className="flex gap-2">
                      <input
                        type="text"
                        value={newTrendKeyword}
                        onChange={(e) => setNewTrendKeyword(e.target.value)}
                        placeholder="e.g. premium gold chokers"
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#008D7F]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#008D7F] hover:bg-teal-700 text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </form>

                    {/* Trends List Render */}
                    <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                      {dsTrendsList.map((t, index) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-3 text-xs shadow-sm hover:border-gray-200 transition">
                          <div className="space-y-1">
                            <p className="font-extrabold text-gray-800 inline-flex items-center gap-1.5 leading-snug">
                              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                              {t.keyword}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold select-none">
                              <span className="bg-slate-100 text-gray-500 px-1.5 py-0.5 rounded uppercase text-[8px] font-black font-mono">
                                {t.category || "custom"}
                              </span>
                              <span className="flex items-center gap-0.5 font-bold">
                                Vol: <strong className="text-gray-700">{t.volume}</strong>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 select-none ${
                              t.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              t.trend === 'down' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {t.trend === 'up' ? (
                                <>
                                  <TrendingUp className="w-3 h-3 text-emerald-600" /> UP
                                </>
                              ) : t.trend === 'down' ? (
                                <>
                                  <TrendingDown className="w-3 h-3 text-rose-600" /> DOWN
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3 h-3 text-amber-600 animate-spin-slow" /> STABLE
                                </>
                              )}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => handleRemoveTrendKeyword(t.keyword)}
                              className="text-gray-300 hover:text-rose-600 p-1 rounded-lg transition"
                              title="Delete keyword target"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

                {/* RIGHT BLOCK: Selected product review, trigger tool audit, display recommendations */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Select Product Card */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                      <SlidersHorizontal className="w-4.5 h-4.5 text-[#008D7F]" />
                      Audit Subject: Product Catalog Selection
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5 pl-0.5">
                        Select a Store Product for live audit
                      </label>
                      
                      <select
                        value={seoSelectedProductId}
                        onChange={(e) => {
                          setSeoSelectedProductId(e.target.value);
                          setSeoAnalysisResult(null);
                          setSeoAnalyzeError(null);
                          setSeoSource(null);
                        }}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-extrabold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#008D7F]"
                      >
                        <option value="" disabled>-- Choose a product --</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id} className="font-semibold text-gray-700">
                            [{p.category}] - {p.title.slice(0, 50)}{p.title.length > 50 ? '...' : ''} (৳{p.price.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selected product previews */}
                    {seoSelectedProductId && products.find(p => p._id === seoSelectedProductId) && (() => {
                      const p = products.find(prod => prod._id === seoSelectedProductId)!;
                      return (
                        <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100 text-xs font-semibold space-y-2.5">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 pl-0.5">
                            Current Metadata State
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <img src={p.photoURL || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300'} alt={p.title} className="col-span-3 h-16 w-full object-cover rounded-xl border border-gray-200" />
                            <div className="col-span-9 space-y-1.5 text-xs text-gray-550">
                              <p className="font-extrabold text-gray-800 text-sm leading-snug">{p.title}</p>
                              <p className="text-[10px] text-gray-400">Category Tags: <span className="bg-white border border-gray-100 px-2 py-0.5 rounded font-black text-[#008D7F]">{p.category}</span></p>
                              <p className="text-[10px] leading-relaxed text-gray-405 font-bold font-sans overflow-hidden max-h-[38px] line-clamp-2">
                                {p.description || "No description currently recorded."}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRunSeoAnalysis(p._id)}
                              disabled={seoLoading}
                              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#008D7F] to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-teal-350 disabled:to-emerald-350 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-700/10 flex items-center justify-center gap-1.5 transition active:scale-98"
                            >
                              {seoLoading ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Crawling Metadata & Querying Search Trends...
                                </>
                              ) : (
                                <>
                                  <Globe className="w-4 h-4" />
                                  Audit & Analyze Live SEO Relevancy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                </div>

              </div>

              {/* AUDIT OUTPUT REPORTS */}
              {seoAnalyzeError && (
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl text-xs font-bold text-rose-800 space-y-2">
                  <p className="flex items-center gap-1.5 text-sm uppercase">🚨 Audit Process Blocked</p>
                  <p className="text-rose-600 font-semibold">{seoAnalyzeError}</p>
                </div>
              )}

              {seoAnalysisResult && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                  
                  {/* Score circle & category checklist review */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Score gauge card */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl relative overflow-hidden">
                      
                      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>

                      <div className="flex justify-between items-center relative z-10 select-none">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#008D7F] bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
                          Crawler Score
                        </span>
                        
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-indigo-400" />
                          {seoSource === 'gemini_api' ? "Gemini 3.5 Flash" : "Local Analytics Engine"}
                        </span>
                      </div>

                      <div className="pt-2 flex flex-col items-center justify-center space-y-1 relative z-10">
                        <div className="relative flex items-center justify-center w-36 h-36">
                          
                          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                          <div className={`absolute inset-0 rounded-full border-4 ${
                            seoAnalysisResult.score >= 80 ? "border-teal-500" :
                            seoAnalysisResult.score >= 50 ? "border-amber-500" :
                            "border-rose-500"
                          } animate-pulse`} style={{ clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100% , 50% 0%)` }}></div>

                          <div className="text-center">
                            <span className="font-display font-black text-5xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                              {seoAnalysisResult.score}
                            </span>
                            <span className="text-slate-500 text-xs font-black block mt-0.5">
                              / 100
                            </span>
                          </div>

                        </div>
                        
                        <p className={`text-sm font-black uppercase tracking-widest mt-3 ${
                          seoAnalysisResult.score >= 80 ? "text-teal-400" :
                          seoAnalysisResult.score >= 55 ? "text-amber-400" :
                          "text-rose-400"
                        }`}>
                          {seoAnalysisResult.score >= 80 ? "🔥 HIGH DISCOVERABILITY" :
                           seoAnalysisResult.score >= 55 ? "⚠️ AVERAGE VISIBILITY" :
                           "❌ RED ALERT: INDEXING RISK"}
                        </p>
                        
                        <p className="text-[10px] text-gray-400 font-semibold px-4 pt-1 leading-normal max-w-sm">
                          Calculated directly based on spider parsing rules, metadata truncation flags, and targeted keyword overlap percentages.
                        </p>
                      </div>

                    </div>

                    {/* Category breakdown check targets */}
                    <div className="bg-slate-50 border border-gray-100 rounded-2xl p-5 space-y-3.5 shadow-sm">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-450 pl-0.5">
                        Crawler Checkpoint Feedback
                      </p>
                      
                      <div className="space-y-3">
                        {seoAnalysisResult.analysis?.map((item: any, i: number) => {
                          const gradeClasses = 
                            item.grade === 'A' ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                            item.grade === 'B' ? "bg-teal-100 text-teal-850 border-teal-200" :
                            item.grade === 'C' ? "bg-amber-100 text-amber-850 border-amber-200" :
                            item.grade === 'D' ? "bg-orange-100 text-orange-850 border-orange-200" :
                            "bg-rose-100 text-rose-800 border-rose-200";

                          return (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3.5 space-y-2 hover:border-gray-200 transition text-xs shadow-sm">
                              <div className="flex items-center justify-between gap-2.5">
                                <span className="font-extrabold text-gray-800 leading-snug">{item.item}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase flex items-center justify-center shrink-0 w-8 h-6 select-none ${gradeClasses}`}>
                                  {item.grade}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-extrabold">
                                <span>Status:</span>
                                <span className="text-gray-600 bg-slate-50 border border-gray-100 rounded px-1.5 py-px uppercase text-[9px]">{item.status}</span>
                              </div>
                              <p className="text-[10.5px] leading-relaxed text-gray-500 font-medium pl-1 border-l-2 border-slate-200">
                                {item.feedback}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* AI Suggested/Optimized Product Metadata & trends advice */}
                  <div className="lg:col-span-7 space-y-6 text-xs font-semibold">
                    
                    {/* Suggestions output section */}
                    <div className="bg-teal-900/5 border border-teal-500/10 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase tracking-wider">
                          <CheckCircle className="w-5 h-5 text-teal-600" />
                          Recommended Highest Search (SEO) Upgrades
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleApplySeoSuggestions}
                          className="px-4 py-2 bg-[#008D7F] hover:bg-teal-700 text-white text-[11px] font-black rounded-xl border border-teal-600/20 shadow flex items-center gap-1 transition"
                        >
                          <Award className="w-4 h-4 text-amber-350" /> Accept & Sync Live Store Listings
                        </button>
                      </div>

                      <p className="text-[11px] text-teal-700 font-semibold leading-relaxed">
                        Below is the simulated high-discoverability metadata formulated dynamically using actual target volumes. Press <strong>"Accept & Sync Live Store Listings"</strong> to replace your item's title & descriptions on the storefront immediately.
                      </p>

                      <div className="space-y-4 pt-1">
                        
                        {/* Title suggestions block */}
                        <div className="bg-white border border-teal-100 rounded-xl p-4 space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Suggested Title Target
                          </p>
                          <p className="text-gray-800 font-black text-sm pr-1 leading-snug select-all">
                            {seoAnalysisResult.suggestedTitle}
                          </p>
                          <div className="flex justify-between items-center text-[9px] text-gray-400 font-medium">
                            <span>Length: {seoAnalysisResult.suggestedTitle?.length || 0} characters (Optimal for Google)</span>
                            <span className="text-emerald-600 font-black uppercase">✓ Passed Truncation Filter</span>
                          </div>
                        </div>

                        {/* Description suggestions block */}
                        <div className="bg-white border border-teal-100 rounded-xl p-4 space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Suggested Meta Description
                          </p>
                          <p className="text-gray-700 font-semibold text-xs leading-relaxed select-all">
                            {seoAnalysisResult.suggestedDesc}
                          </p>
                          <div className="flex justify-between items-center text-[9px] text-gray-400 font-medium">
                            <span>Length: {seoAnalysisResult.suggestedDesc?.length || 0} characters</span>
                            <span className="text-emerald-600 font-black uppercase font-display">✓ Target Length Perfect</span>
                          </div>
                        </div>

                        {/* Suggested high conversions keywords tags */}
                        {seoAnalysisResult.suggestedKeywords && (
                          <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-2">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              LSI / Search-Ranking Keywords to Append
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                              {seoAnalysisResult.suggestedKeywords.split(",").map((kw: string, i: number) => (
                                <span key={i} className="bg-teal-50 text-teal-800 text-[10px] font-black border border-teal-100 px-2.5 py-1 rounded-lg">
                                  {kw.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Trend analysis insights */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Google Search Relevancy Insight
                          </p>
                          <p className="text-gray-600 font-semibold text-xs leading-relaxed font-sans">
                            {seoAnalysisResult.trendInsights}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* DELIVERY TABS: ACTIVE MY ORDER LOGS */}
          {activeTab === 'my-order' && user.role === 'delivery' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Active Delivery Workload</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5 font-sans">Active deliveries dispatched or assigned to your cargo account.</p>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.deliveryMan === user.name && o.status === 'onTheWay').length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-430 select-none">
                    No active assignments given. You have coordinates fully delivered!
                  </div>
                ) : (
                  orders.filter(o => o.deliveryMan === user.name && o.status === 'onTheWay').map((o) => (
                    <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-4 text-xs font-semibold">
                      
                      <div className="flex justify-between items-center bg-blue-50/50 px-3.5 py-2 rounded-xl text-blue-800 border border-blue-100">
                        <div>
                          <p className="font-bold flex items-center gap-1">Order: <span className="font-black">{o._id}</span></p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Assigned Target date: {o.deliveryDate}</p>
                        </div>
                        
                        <span className="text-[10px] font-black bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          On The Way
                        </span>
                      </div>

                      {/* address block */}
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-550 border-b border-gray-50 pb-3">
                        <div>
                          <p className="font-bold text-gray-700">Billing details</p>
                          <p className="mt-1">{o.name} ({o.phone})</p>
                        </div>
                        
                        <div>
                          <p className="font-bold text-gray-700">Delivery Address</p>
                          <p className="mt-1 leading-normal text-[10px] text-gray-400 font-bold">{o.address}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 select-none">
                        <p className="text-gray-400">Total cash due: <strong className="text-gray-800 text-sm font-display font-black">৳{o.total.toLocaleString()}</strong></p>
                        
                        <button
                          onClick={() => handleMarkDelivered(o._id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg transition"
                        >
                          ✓ Confirm Delivered & Cash Collected
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* DELIVERY TABS: MY COMPLETED HISTORY */}
          {activeTab === 'my-completed' && user.role === 'delivery' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Historic Deliveries closed</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Parcels you delivered successfully and marked closed historically.</p>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.deliveryMan === user.name && o.status === 'completed').length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-430 select-none">
                    No historic closed items reported.
                  </div>
                ) : (
                  orders.filter(o => o.deliveryMan === user.name && o.status === 'completed').map((o) => (
                    <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-3 text-xs font-semibold text-gray-500">
                      
                      <div className="flex justify-between items-center bg-emerald-50 px-3.5 py-2 rounded-xl text-emerald-850 border border-emerald-100 text-[10px]">
                        <div>
                          <p className="font-bold">Order ID: <span className="font-black text-[#008D7F]">{o._id}</span></p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Completed Date: {o.deliveryDate}</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase font-display">
                          Delivered
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-800 font-bold">{o.name}</p>
                          <p className="text-[9px] text-gray-400">{o.email} | {o.phone}</p>
                        </div>
                        
                        <p className="font-display font-black text-gray-800 text-xs">
                          ৳{o.total.toLocaleString()}
                        </p>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </section>

    </div>
  );
};
