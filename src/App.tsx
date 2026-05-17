import React, { useState, useEffect } from 'react';
import { useStore } from './lib/store';
import { useI18n } from './lib/i18n';
import { Toaster } from './components/ui/sonner';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import InvoiceGenerator from './pages/InvoiceGenerator';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import SupportButton from './components/SupportButton';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const { user, language, isOffline, setOffline } = useStore();
  const { isRtl } = useI18n();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOffline]);

  if (showSplash) return <Splash />;
  if (!user) return <Auth />;
  if (!user.onboardingComplete) return <Onboarding />;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'products': return <Products />;
      case 'invoice': return <InvoiceGenerator onComplete={() => setActiveTab('home')} />;
      case 'customers': return <Customers />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="flex-1 pb-20 overflow-auto">
        {isOffline && (
          <div className="bg-destructive text-destructive-foreground py-1 px-4 text-xs text-center sticky top-0 z-50">
            Offline Mode - Data will sync when reconnected
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <SupportButton />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toaster position="top-center" />
    </div>
  );
};

export default App;