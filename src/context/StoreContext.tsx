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
  
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('eb_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('eb_products');
    const list = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    return list.map((p: Product) => {
      let cat = p.category;
      if (cat === 'Earrings' || cat === 'Jewelry Set' || cat === 'Kids Jewelry Sets' || cat === 'Jewellery' || cat === 'Jewelry') {
        cat = 'Fashion Accessories';
      } else if (cat === 'Mini Fan' || cat === 'Gadget') {
        cat = 'Smart Gadgets';
      } else if (cat === 'Beauty') {
        cat = 'Beauty & Personal Care';
      } else if (cat === 'Fitness') {
        cat = 'Fitness Products';
      }
      return { ...p, category: cat };
    });
  });

  const [blogs, setBlogs] = useState<Blog[]>(() => {
    const saved = localStorage.getItem('eb_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
    const saved = localStorage.getItem('eb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('eb_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('eb_orders');
    if (saved) return JSON.parse(saved);
    
    // Seed an order for showcases
    return [
      {
        _id: 'ord_' + Math.random().toString(36).substr(2, 9),
        items: [
          {
            productId: '6a099b6f6cf6409285fb55f4',
            title: "Earring's Point 3-in-1 Combo Set – Pearl, Crystal & Butterfly Drop",
            price: 100,
            quantity: 2,
            image: "https://i.ibb.co/0RS6Bnr4/image-113.jpg"
          }
        ],
        total: 200,
        status: 'pending',
        date: '2026-06-17',
        name: 'Zarin Tasnim',
        email: 'user@ecobazar.com',
        address: 'House 24, Road 5, Dhanmondi, Dhaka',
        phone: '+8801712345678',
        notes: 'Please deliver in the afternoon.'
      }
    ];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('eb_reviews');
    if (saved) return JSON.parse(saved);
    
    // Default seeded reviews
    return [
      {
        _id: 'rev_1',
        productId: '6a099b6f6cf6409285fb55f4',
        name: 'Sadia Rahman',
        email: 'sadia@gmail.com',
        comment: 'Absolutely stunning! The packaging was gorgeous and the earrings feel premium and gentle on skins.',
        rating: 5,
        date: '2026-06-15'
      },
      {
        _id: 'rev_2',
        productId: '6a099b6f6cf6409285fb55f4',
        name: 'Farhana Akhter',
        email: 'farhana@gmail.com',
        comment: 'Nice combo sets. Good value for money and very shiny crystal studs.',
        rating: 4,
        date: '2026-06-16'
      }
    ];
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Premium Extra states
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('eb_theme') as 'light' | 'dark') || 'light';
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
      localStorage.setItem('eb_theme', next);
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

  useEffect(() => {
    localStorage.setItem('eb_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('eb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('eb_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('eb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('eb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('eb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('eb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Auth Functions
  const signIn = async (email: string, pass: string): Promise<User> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        // Standard check
        const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (found) {
          // If password matches password scheme or just standard pass
          // For sandbox simplicity, any pass works but seed checks can exist
          setUser(found);
          resolve(found);
        } else {
          // If not found, let's auto-create a user role for easy testing!
          const name = email.split('@')[0];
          const newUser: User = {
            email: email.toLowerCase(),
            name: name.charAt(0).toUpperCase() + name.slice(1),
            role: 'user',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
            createdAt: new Date().toISOString().split('T')[0]
          };
          setAllUsers(prev => [...prev, newUser]);
          setUser(newUser);
          resolve(newUser);
        }
      }, 600);
    });
  };

  const signUp = async (email: string, name: string, pass: string, role: 'admin' | 'delivery' | 'user'): Promise<User> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        const exists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          reject(new Error('User already exists with this email address.'));
          return;
        }
        const newUser: User = {
          email: email.toLowerCase(),
          name,
          role,
          photoURL: role === 'delivery' 
            ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces'
            : role === 'admin'
            ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces'
            : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
          createdAt: new Date().toISOString().split('T')[0]
        };
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
        resolve(newUser);
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    setAllUsers(prev => prev.map(u => u.email === user.email ? updated : u));
  };

  // Cart Functions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product._id === product._id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { product, quantity }];
    });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cart-item-added'));
      window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }));
    }, 50);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product._id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Functions
  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.some(p => p._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(p => p._id !== productId));
  };

  // Order Functions
  const createOrder = (orderDetail: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  }): Order => {
    const orderItems = cart.map(item => ({
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.gallery[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200'
    }));

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const newOrder: Order = {
      _id: 'ord_' + Math.random().toString(36).substr(2, 9),
      items: orderItems,
      total,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      ...orderDetail
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Increment sell count of products
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const purchased = cart.find(c => c.product._id === p._id);
        if (purchased) {
          return {
            ...p,
            quantity: Math.max(0, p.quantity - purchased.quantity),
            sell_number: p.sell_number + purchased.quantity
          };
        }
        return p;
      });
    });

    // Award loyalty points to user (1 loyalty point per ৳10 BDT spent)
    if (user) {
      const earnedPoints = Math.floor(total / 10);
      if (earnedPoints > 0) {
        setAllUsers(prev => prev.map(u => {
          if (u.email.toLowerCase() === user.email.toLowerCase()) {
            const updated = { ...u, loyaltyPoints: (u.loyaltyPoints || 0) + earnedPoints };
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
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p._id !== id));
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
        };
      }
      return o;
    }));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
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
      theme, toggleTheme, lang, setLang, currency, setCurrency, formatPrice, compareList, addToCompare, removeFromCompare,
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
