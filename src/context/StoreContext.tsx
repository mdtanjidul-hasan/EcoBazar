import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Blog, User, Order, Review, Comment, ToastNotification } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BLOGS } from '../data';

interface StoreContextType {
  // Auth state
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<User>;
  signUp: (email: string, name: string, pass: string, role: 'admin' | 'delivery' | 'user') => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  allUsers: User[];
  
  // Shop state
  products: Product[];
  blogs: Blog[];
  cart: { product: Product; quantity: number }[];
  wishlist: Product[];
  orders: Order[];
  reviews: Review[];
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  
  createOrder: (orderDetail: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  }) => Order;
  
  addReview: (productId: string, name: string, email: string, comment: string, rating: number) => void;
  addComment: (blogId: string, name: string, email: string, commentText: string) => void;
  
  // Admin & Delivery Actions
  addProduct: (product: Omit<Product, '_id' | 'rating' | 'sell_number'>) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (product: Product) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], deliveryMan?: string, deliveryDate?: string) => void;
  deleteOrder: (orderId: string) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Premium Extra states
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: 'EN' | 'AR' | 'FR' | 'ES';
  setLang: (lang: 'EN' | 'AR' | 'FR' | 'ES') => void;
  currency: 'BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD';
  setCurrency: (curr: 'BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD') => void;
  formatPrice: (bdtPrice: number) => string;
  getWholesalePrice: (product: Product, quantity: number) => number;
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  addLoyaltyPoints: (email: string, points: number) => void;
  // Toast notifications state & methods
  toasts: ToastNotification[];
  addNotificationToast: (toast: Omit<ToastNotification, '_id'>) => void;
  dismissNotificationToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Seeds for Users list
const DEFAULT_USERS: User[] = [
  { email: 'admin@ecobazar.com', name: 'Maruf Hossen (Admin)', role: 'admin', photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', createdAt: '2026-01-10', loyaltyPoints: 1250 },
  { email: 'delivery@ecobazar.com', name: 'Mishuk RJ (Delivery)', role: 'delivery', photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', createdAt: '2026-02-15', loyaltyPoints: 320 },
  { email: 'user@ecobazar.com', name: 'Zarin Tasnim', role: 'user', photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', createdAt: '2026-03-20', loyaltyPoints: 450 }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or seed defaults
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eb_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
    }

    return list.map((p: Product, index: number) => {
      let cat = p.category;
      if (cat === 'Earrings' || cat === 'Jewelry Set' || cat === 'Kids Jewelry Sets' || cat === 'Jewellery' || cat === 'Jewelry' || cat === 'Apparel') {
        cat = 'Fashion Accessories';
      } else if (cat === 'Mini Fan' || cat === 'Gadget') {
        cat = 'Smart Gadgets';
      } else if (cat === 'Beauty' || cat === 'Fragrances') {
        cat = 'Beauty & Personal Care';
      } else if (cat === 'Fitness') {
        cat = 'Fitness Products';
      } else if (cat === 'Home Decor' || cat === 'Home & Kitchen' || cat === 'Home') {
        cat = 'Home & Kitchen';
      }

      // Add Alibaba wholesale details dynamically
      const price = p.price;
      const moq = p.moq || (price < 150 ? 20 : price < 500 ? 10 : price < 2000 ? 5 : 2);
      
      const supplierNames = [
        "Guangzhou Sheng Jewelry Co., Ltd.",
        "Yiwu EcoBreeze Electronic Appliance Factory",
        "Zhejiang Well-Living Manufacturing Ltd.",
        "Shenzhen CuteTech Innovations Co., Ltd.",
        "Aparupa Ethnic Craft & Export Co.",
        "Dhanmondi Signature Wholesalers",
        "Ningbo Sports & Fitness Equipment Factory"
      ];
      const supplierName = p.supplierName || supplierNames[index % supplierNames.length];
      const supplierRating = p.supplierRating || parseFloat((4.5 + (index % 5) * 0.1).toFixed(1));
      const supplierResponseRate = p.supplierResponseRate || `${85 + (index % 16)}%`;
      const supplierResponseTime = p.supplierResponseTime || (index % 2 === 0 ? "< 2h" : "< 5h");
      const isVerifiedSupplier = p.isVerifiedSupplier !== undefined ? p.isVerifiedSupplier : (index % 3 !== 2);
      const isTradeAssurance = p.isTradeAssurance !== undefined ? p.isTradeAssurance : true;

      // Price Tiers: progressive volume discounts
      const priceTiers = p.priceTiers || [
        { minQty: moq, maxQty: moq * 3, price: Math.round(price) },
        { minQty: moq * 3 + 1, maxQty: moq * 10, price: Math.round(price * 0.9) },
        { minQty: moq * 10 + 1, price: Math.round(price * 0.8) }
      ];

      return {
        ...p,
        category: cat,
        moq,
        supplierName,
        supplierRating,
        supplierResponseRate,
        supplierResponseTime,
        isVerifiedSupplier,
        isTradeAssurance,
        priceTiers
      };
    });
  });

  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
    const saved = localStorage.getItem('eb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('eb_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, userRes, blogRes, orderRes, revRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/users'),
          fetch('/api/blogs'),
          fetch('/api/orders'),
          fetch('/api/reviews')
        ]);
        if(prodRes.ok) {
          const rawProds = await prodRes.json();
          // Apply wholesale formatting mapping
          const mappedProds = rawProds.map((p: Product, index: number) => {
            let cat = p.category;
            if (cat === 'Earrings' || cat === 'Jewelry Set' || cat === 'Kids Jewelry Sets' || cat === 'Jewellery' || cat === 'Jewelry' || cat === 'Apparel') {
              cat = 'Fashion Accessories';
            } else if (cat === 'Mini Fan' || cat === 'Gadget') {
              cat = 'Smart Gadgets';
            } else if (cat === 'Beauty' || cat === 'Fragrances') {
              cat = 'Beauty & Personal Care';
            } else if (cat === 'Fitness') {
              cat = 'Fitness Products';
            } else if (cat === 'Home Decor' || cat === 'Home & Kitchen' || cat === 'Home') {
              cat = 'Home & Kitchen';
            }

            const price = p.price;
            const moq = p.moq || (price < 150 ? 20 : price < 500 ? 10 : price < 2000 ? 5 : 2);
            
            const supplierNames = [
              "Guangzhou Sheng Jewelry Co., Ltd.",
              "Yiwu EcoBreeze Electronic Appliance Factory",
              "Zhejiang Well-Living Manufacturing Ltd.",
              "Shenzhen CuteTech Innovations Co., Ltd.",
              "Aparupa Ethnic Craft & Export Co.",
              "Dhanmondi Signature Wholesalers",
              "Ningbo Sports & Fitness Equipment Factory"
            ];
            const supplierName = p.supplierName || supplierNames[index % supplierNames.length];
            const supplierRating = p.supplierRating || parseFloat((4.5 + (index % 5) * 0.1).toFixed(1));
            const supplierResponseRate = p.supplierResponseRate || `${85 + (index % 16)}%`;
            const supplierResponseTime = p.supplierResponseTime || (index % 2 === 0 ? "< 2h" : "< 5h");
            const isVerifiedSupplier = p.isVerifiedSupplier !== undefined ? p.isVerifiedSupplier : (index % 3 !== 2);
            const isTradeAssurance = p.isTradeAssurance !== undefined ? p.isTradeAssurance : true;

            const priceTiers = p.priceTiers || [
              { minQty: moq, maxQty: moq * 3, price: Math.round(price) },
              { minQty: moq * 3 + 1, maxQty: moq * 10, price: Math.round(price * 0.9) },
              { minQty: moq * 10 + 1, price: Math.round(price * 0.8) }
            ];

            return {
              ...p,
              category: cat,
              moq,
              supplierName,
              supplierRating,
              supplierResponseRate,
              supplierResponseTime,
              isVerifiedSupplier,
              isTradeAssurance,
              priceTiers
            };
          });
          setProducts(mappedProds);
        }
        if(userRes.ok) setAllUsers(await userRes.json());
        if(blogRes.ok) setBlogs(await blogRes.json());
        if(orderRes.ok) setOrders(await orderRes.json());
        if(revRes.ok) setReviews(await revRes.json());
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchData();
  }, []);

  const [orders, setOrders] = useState<Order[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Premium Extra states
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ecobazar-theme') as 'light' | 'dark') || 'light';
  });

  const [lang, setLangState] = useState<'EN' | 'AR' | 'FR' | 'ES'>(() => {
    return (localStorage.getItem('eb_lang') as 'EN' | 'AR' | 'FR' | 'ES') || 'EN';
  });

  const [currency, setCurrencyState] = useState<'BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD'>(() => {
    return (localStorage.getItem('eb_currency') as 'BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD') || 'BDT';
  });

  const [compareList, setCompareList] = useState<Product[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('ecobazar-theme', next);
      return next;
    });
  };

  const setLang = (newLang: 'EN' | 'AR' | 'FR' | 'ES') => {
    setLangState(newLang);
    localStorage.setItem('eb_lang', newLang);
  };

  const setCurrency = (curr: 'BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD') => {
    setCurrencyState(curr);
    localStorage.setItem('eb_currency', curr);
  };

  const formatPrice = (bdtPrice: number): string => {
    if (currency === 'USD') {
      return '$' + (bdtPrice / 120).toFixed(2);
    }
    if (currency === 'GBP') {
      return '£' + (bdtPrice / 150).toFixed(2);
    }
    if (currency === 'EUR') {
      return '€' + (bdtPrice / 130).toFixed(2);
    }
    if (currency === 'AUD') {
      return 'A$' + (bdtPrice / 80).toFixed(2);
    }
    return '৳' + bdtPrice.toLocaleString();
  };

  const getWholesalePrice = (product: Product, quantity: number): number => {
    if (!product.priceTiers || product.priceTiers.length === 0) {
      return product.price;
    }
    const sortedTiers = [...product.priceTiers].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sortedTiers) {
      if (quantity >= tier.minQty) {
        return tier.price;
      }
    }
    return product.price;
  };

  const addToCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.some(p => p._id === product._id)) return prev;
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p._id !== productId));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('eb_current_user', user ? JSON.stringify(user) : '');
  }, [user]);

  // Auth Functions
  const signIn = async (email: string, pass: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setUser(data);
        return data;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };
            setUser(updated);
            return updated;
          }
          return u;
        }));
      }
    }

    clearCart();
    return newOrder;
  };

  const addReview = (productId: string, name: string, email: string, comment: string, rating: number) => {
    const newRev: Review = {
      _id: 'rev_' + Math.random().toString(36).substr(2, 9),
      productId,
      name,
      email,
      comment,
      rating,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newRev]);
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRev)
    }).catch(console.error);

    // Recalculate average rating of product
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (p._id === productId) {
          const productReviews = reviews.filter(r => r.productId === productId).concat(newRev);
          const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
          return { ...p, rating: parseFloat(avg.toFixed(1)) };
        }
        return p;
      });
    });
  };

  const addComment = (blogId: string, name: string, email: string, commentText: string) => {
    const newComment: Comment = {
      name,
      email,
      comment: commentText,
      blogId,
      date: new Date().toISOString().split('T')[0]
    };

    setBlogs(prevBlogs => {
      return prevBlogs.map(b => {
        if (b._id === blogId) {
          const cms = b.comments || [];
          return { ...b, comments: [...cms, newComment] };
        }
        return b;
      });
    });
    fetch(`/api/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment)
    }).catch(console.error);
  };

  // Product CRUD
  const addProduct = (p: Omit<Product, '_id' | 'rating' | 'sell_number'>) => {
    const newProd: Product = {
      ...p,
      _id: 'prod_' + Math.random().toString(36).substr(2, 9),
      rating: 5,
      sell_number: 0
    };
    setProducts(prev => [newProd, ...prev]);
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    }).catch(console.error);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p._id !== id));
    fetch(`/api/products/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const addNotificationToast = (toast: Omit<ToastNotification, '_id'>) => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, _id: id }]);
    
    // Auto remove after 6 seconds so users have ample time to click or read
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t._id !== id));
    }, 6000);
  };

  const dismissNotificationToast = (id: string) => {
    setToasts(prev => prev.filter(t => t._id !== id));
  };

  const updateProduct = (updated: Product) => {
    // Check if there is a price drop on this product
    const oldProduct = products.find(p => p._id === updated._id);
    if (oldProduct && updated.price < oldProduct.price) {
      // It's a price drop! Verify if it is in the wishlist
      const isWishlisted = wishlist.some(p => p._id === updated._id);
      if (isWishlisted) {
        addNotificationToast({
          type: 'sale',
          title: lang === 'EN' ? 'Wishlist Price Drop! 🚨' : 'উইশলিস্ট মূল্যহ্রাস! 🚨',
          message: lang === 'EN' 
            ? `Your wishlisted item "${updated.title}" has dropped from ${formatPrice(oldProduct.price)} to ${formatPrice(updated.price)}!`
            : `আপনার পছন্দের তালিকায় থাকা "${updated.title}" এর দাম ${formatPrice(oldProduct.price)} থেকে কমে ${formatPrice(updated.price)} টাকা হয়েছে!`,
          product: updated,
          priceDropDetails: {
            oldPrice: oldProduct.price,
            newPrice: updated.price
          }
        });
      }
    }
    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
    fetch(`/api/products/${updated._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(console.error);
  };

  // Admin / Delivery updates
  const updateOrderStatus = (orderId: string, status: Order['status'], deliveryMan?: string, deliveryDate?: string) => {

    setOrders(prev => prev.map(o => {
      if (o._id === orderId) {
        return {
          ...o,
          status,
          deliveryMan: deliveryMan !== undefined ? deliveryMan : o.deliveryMan,
          deliveryDate: deliveryDate !== undefined ? deliveryDate : o.deliveryDate
        
    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, deliveryMan, deliveryDate })
    }).catch(console.error);
  };
      }
      return o;
    }));
  };

  const deleteOrder = (orderId: string) => {

    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
  
    fetch(`/api/orders/${orderId}`, { method: 'DELETE' }).catch(console.error);
  };

  const addLoyaltyPoints = (email: string, points: number) => {
    setAllUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const updated = { ...u, loyaltyPoints: (u.loyaltyPoints || 0) + points };
        if (user && user.email.toLowerCase() === email.toLowerCase()) {
          setUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  return (
    <StoreContext.Provider value={{
      user, loading, signIn, signUp, logout, updateProfile, allUsers,
      products, blogs, cart, wishlist, orders, reviews,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      addToWishlist, removeFromWishlist, createOrder, addReview, addComment,
      addProduct, deleteProduct, updateProduct, updateOrderStatus, deleteOrder,
      searchQuery, setSearchQuery,
      theme, toggleTheme, lang, setLang, currency, setCurrency, formatPrice, getWholesalePrice, compareList, addToCompare, removeFromCompare,
      addLoyaltyPoints,
      toasts, addNotificationToast, dismissNotificationToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
