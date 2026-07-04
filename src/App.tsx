import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NewsletterModal } from './components/NewsletterModal';
import { ToastContainer } from './components/ToastContainer';
import { motion, AnimatePresence } from 'motion/react';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { BlogListView } from './views/BlogListView';
import { BlogDetailView } from './views/BlogDetailView';
import { AboutView } from './views/AboutView';
import { CompareView } from './views/CompareView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { WishlistView } from './views/WishlistView';
import { ContactView } from './views/ContactView';
import { ThankYouView } from './views/ThankYouView';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';

function AppContent() {
  const router = useRouter();
  const { currentPath, navigate, getParam } = router;
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronize dynamic open/close event signals
  useEffect(() => {
    const handleSetState = (e: any) => {
      setIsCartOpen(e.detail);
    };
    window.addEventListener('set-cart-drawer-state', handleSetState);
    return () => window.removeEventListener('set-cart-drawer-state', handleSetState);
  }, []);

  // Render view depending on the matching hash route path
  const renderActiveView = () => {
    if (currentPath === '/' || currentPath === '/home') {
      return <HomeView navigate={navigate} />;
    }
    
    if (currentPath === '/shop') {
      return <ShopView navigate={navigate} />;
    }

    if (currentPath.startsWith('/product/')) {
      const pId = getParam('/product/:id');
      return pId ? <ProductDetailView productId={pId} navigate={navigate} /> : <ShopView navigate={navigate} />;
    }

    if (currentPath === '/cart') {
      return <CartView navigate={navigate} />;
    }

    if (currentPath === '/checkout') {
      return <CheckoutView navigate={navigate} />;
    }

    if (currentPath === '/blog') {
      return <BlogListView navigate={navigate} />;
    }

    if (currentPath.startsWith('/single-blog/')) {
      const bId = getParam('/single-blog/:id');
      return bId ? <BlogDetailView blogId={bId} navigate={navigate} /> : <BlogListView navigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutView navigate={navigate} />;
    }

    if (currentPath === '/compare') {
      return <CompareView navigate={navigate} />;
    }

    if (currentPath === '/track') {
      return <OrderTrackingView navigate={navigate} />;
    }

    if (currentPath === '/wishlist') {
      return <WishlistView navigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactView />;
    }

    if (currentPath === '/thank-you') {
      return <ThankYouView navigate={navigate} />;
    }

    if (currentPath === '/login') {
      return <AuthView navigate={navigate} />;
    }

    if (currentPath === '/dashboard') {
      return <DashboardView navigate={navigate} />;
    }

    // Default fallback to Home
    return <HomeView navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ebf6f2] dark:bg-black text-gray-800 dark:text-white selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      {/* Navigation Top bar */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Main Container Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-4 pb-12">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.20, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* Footer Bottom Block */}
      <Footer navigate={navigate} />

      {/* Luxury Cart Drawer Overlay */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} navigate={navigate} />

      {/* Exit-Intent Newsletter Subscription Modal */}
      <NewsletterModal />

      {/* Global Toast Notification System */}
      <ToastContainer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
