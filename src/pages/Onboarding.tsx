import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { CheckCircle2, ChevronRight, ChevronLeft, Store, MapPin, PackagePlus } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { user, setUser } = useStore();
  const { t, isRtl } = useI18n();
  const [phase, setPhase] = useState<'carousel' | 'wizard'>('carousel');
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [wizardStep, setWizardStep] = useState(0);
  
  const [storeData, setStoreData] = useState({
    name: '',
    type: 'grocery',
    city: '',
  });

  const carouselItems = [
    {
      title: t('manageStore'),
      desc: t('manageStoreDesc'),
      image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/onboarding-manage-store-93f010bb-1779024054844.webp"
    },
    {
      title: t('invoices'),
      desc: t('invoicesDesc'),
      image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/onboarding-invoices-82351bdb-1779024055733.webp"
    },
    {
      title: t('analytics'),
      desc: t('analyticsDesc'),
      image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/onboarding-analytics-d90079f0-1779024054138.webp"
    }
  ];

  const businessTypes = [
    { id: 'grocery', name: t('businessTypes.grocery'), img: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/grocery-icon-45b0cc23-1779024054390.webp" },
    { id: 'electronics', name: t('businessTypes.electronics'), img: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/electronics-icon-80bf4c68-1779024054264.webp" },
    { id: 'clothing', name: t('businessTypes.clothing'), img: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/clothing-icon-95c7e8c1-1779024056580.webp" },
    { id: 'pharmacy', name: t('businessTypes.pharmacy'), img: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/pharmacy-icon-74b029b8-1779024055363.webp" },
    { id: 'restaurant', name: t('businessTypes.restaurant'), img: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/restaurant-icon-a062d4c9-1779024054160.webp" },
    { id: 'building', name: t('businessTypes.building'), img: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/8b50f936-ea15-4277-bd01-f94e36e5ad13/building-materials-icon-52c2c184-1779024056960.webp" },
  ];

  const handleNextCarousel = () => {
    if (carouselIdx < carouselItems.length - 1) {
      setCarouselIdx(carouselIdx + 1);
    } else {
      setPhase('wizard');
    }
  };

  const handleComplete = () => {
    if (user) {
      setUser({
        ...user,
        storeName: storeData.name,
        businessType: storeData.type,
        city: storeData.city,
        onboardingComplete: true,
      });
    }
  };

  return (
    <div className={`min-h-screen bg-white ${isRtl ? 'rtl' : 'ltr'}`}>
      {phase === 'carousel' ? (
        <div className="h-screen flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <div className="w-full max-w-[280px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl mx-auto bg-slate-100">
                  <img src={carouselItems[carouselIdx].image} alt="Onboarding" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900 leading-tight">{carouselItems[carouselIdx].title}</h2>
                  <p className="text-slate-500 text-lg px-4">{carouselItems[carouselIdx].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex space-x-2 mt-8">
              {carouselItems.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === carouselIdx ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`} />
              ))}
            </div>
          </div>
          
          <div className="p-8 flex items-center justify-between">
            <button onClick={() => setPhase('wizard')} className="text-slate-400 font-medium px-4 py-2">
              {t('skip')}
            </button>
            <Button onClick={handleNextCarousel} className="h-14 px-8 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
              {t('next')}
              {isRtl ? <ChevronLeft className="mr-2 w-6 h-6" /> : <ChevronRight className="ml-2 w-6 h-6" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen p-6 flex flex-col">
          <div className="mb-8 flex items-center justify-between">
            <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden mr-4">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }}
                animate={{ width: `${(wizardStep + 1) * 25}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-400">{wizardStep + 1}/4</span>
          </div>

          <AnimatePresence mode="wait">
            {wizardStep === 0 && (
              <motion.div key="w1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{t('storeSetup')}</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">{t('storeName')}</label>
                  <Input 
                    value={storeData.name} 
                    onChange={e => setStoreData({...storeData, name: e.target.value})}
                    placeholder="e.g. Ali's Grocery" 
                    className="h-14 text-lg rounded-xl"
                  />
                </div>
              </motion.div>
            )}

            {wizardStep === 1 && (
              <motion.div key="w2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold">{t('businessType')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {businessTypes.map((bt) => (
                    <button
                      key={bt.id}
                      onClick={() => setStoreData({...storeData, type: bt.id})}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${
                        storeData.type === bt.id ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-100'
                      }`}
                    >
                      <div className="w-12 h-12 mx-auto mb-2 rounded-lg overflow-hidden">
                        <img src={bt.img} alt={bt.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-bold">{bt.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {wizardStep === 2 && (
              <motion.div key="w3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold">{t('city')}</h2>
                <Input 
                  value={storeData.city} 
                  onChange={e => setStoreData({...storeData, city: e.target.value})}
                  placeholder="e.g. Hargeisa, Mogadishu, Addis Ababa" 
                  className="h-14 text-lg rounded-xl"
                />
              </motion.div>
            )}

            {wizardStep === 3 && (
              <motion.div key="w4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center py-12">
                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <h2 className="text-3xl font-bold">{t('welcome')}!</h2>
                <p className="text-slate-500 text-lg">Your store is ready. Let's start selling.</p>
                <div className="pt-8 space-y-4">
                  <Card className="p-4 bg-slate-50 border-none flex items-center text-left">
                    <PackagePlus className="w-10 h-10 text-primary mr-4" />
                    <div>
                      <h4 className="font-bold text-slate-800">Add Your First Product</h4>
                      <p className="text-xs text-slate-500">You can also import from Excel later.</p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto pt-8 flex space-x-4">
            {wizardStep > 0 && wizardStep < 3 && (
              <Button variant="outline" onClick={() => setWizardStep(wizardStep - 1)} className="h-14 flex-1 rounded-2xl font-bold">
                {t('cancel')}
              </Button>
            )}
            <Button 
              onClick={() => wizardStep < 3 ? setWizardStep(wizardStep + 1) : handleComplete()} 
              className="h-14 flex-[2] rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
            >
              {wizardStep === 3 ? t('finish') : t('next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;