import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { BlogListView } from './views/BlogListView';
import { BlogDetailView } from './views/BlogDetailView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { ThankYouView } from './views/ThankYouView';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';

function AppContent() {
  const router = useRouter();
  const { currentPath, navigate, getParam } = router;

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800 selection:bg-teal-500 selection:text-white">
      {/* Navigation Top bar */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Main Container Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {renderActiveView()}
      </main>

      {/* Footer Bottom Block */}
      <Footer navigate={navigate} />
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
