import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  CreditCard, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle,
  Zap,
  ShoppingBag,
  Gem
} from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';

interface SubscriptionProps {
  onBack: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ onBack }) => {
  const { t, isRtl } = useI18n();
  const { user } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showWaafiConfirm, setShowWaafiConfirm] = useState(false);

  const plans = [
    { id: 'basic', name: 'Basic', price: 9.99, period: 'mo', icon: ShoppingBag, color: 'bg-slate-100', text: 'text-slate-600' },
    { id: 'pro', name: 'Pro', price: 19.99, period: 'mo', icon: Zap, color: 'bg-primary/10', text: 'text-primary', popular: true },
    { id: 'market', name: 'Market Intel', price: 7.99, period: 'mo', icon: Gem, color: 'bg-secondary/10', text: 'text-secondary' },
  ];

  const cards = [
    { qty: 25, price: 2.99 },
    { qty: 100, price: 7.99 },
    { qty: 500, price: 24.99 },
  ];

  const handleContinuePayment = () => {
    if (!selectedPlan) {
      toast.error('Please select a plan or card first');
      return;
    }
    setShowPayment(true);
  };

  const handlePay = (method: 'mpesa' | 'waafi') => {
    if (method === 'waafi') {
      setShowWaafiConfirm(true);
    } else {
      toast.success('M-Pesa payment initiated. Please check your phone.');
      // Simulate success
      setTimeout(() => onBack(), 2000);
    }
  };

  if (showPayment) {
    return (
      <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setShowPayment(false)} className="flex items-center text-primary font-bold">
          {isRtl ? <ChevronRight className="mr-1" /> : <ChevronLeft className="mr-1" />}
          {t('paymentMethod')}
        </button>

        <div className="space-y-6">
          <h1 className="text-2xl font-black text-slate-900">{t('paymentMethod')}</h1>
          
          <div className="space-y-4">
            <button 
              onClick={() => handlePay('mpesa')}
              className="w-full p-6 bg-white rounded-3xl shadow-sm border-2 border-slate-100 flex items-center justify-between active:border-primary transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center font-black text-[#4CAF50]">M</div>
                <div className="text-left">
                  <div className="font-black text-slate-800">{t('payWithMpesa')}</div>
                  <div className="text-xs text-slate-400">Default for KE / ET</div>
                </div>
              </div>
              <ChevronRight className="text-slate-300" />
            </button>

            <button 
              onClick={() => handlePay('waafi')}
              className="w-full p-6 bg-white rounded-3xl shadow-sm border-2 border-slate-100 flex items-center justify-between active:border-primary transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary">W</div>
                <div className="text-left">
                  <div className="font-black text-slate-800">{t('payWithWaafi')}</div>
                  <div className="text-xs text-slate-400">Available in Somalia, Djibouti, SSD</div>
                </div>
              </div>
              <ChevronRight className="text-slate-300" />
            </button>
          </div>
        </div>

        <AlertDialog open={showWaafiConfirm} onOpenChange={setShowWaafiConfirm}>
          <AlertDialogContent className="rounded-3xl max-w-[90%] mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black">WaafiPay Redirection</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600">
                {t('waafiRedirectMsg')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2">
              <AlertDialogAction 
                onClick={() => {
                  toast.success('Redirecting to WaafiPay...');
                  setTimeout(() => onBack(), 2000);
                }}
                className="rounded-2xl h-14 bg-primary font-bold"
              >
                {t('continue')}
              </AlertDialogAction>
              <AlertDialogCancel className="rounded-2xl h-14 border-none font-bold">
                {t('cancel')}
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
      <button onClick={onBack} className="flex items-center text-primary font-bold">
        {isRtl ? <ChevronRight className="mr-1" /> : <ChevronLeft className="mr-1" />}
        {t('settings')}
      </button>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900">{t('subscription')}</h1>
        <p className="text-slate-500 text-sm">Current Plan: <span className="font-bold text-primary">{user?.plan}</span></p>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t('plans')}</h3>
        <div className="grid gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-5 border-2 transition-all cursor-pointer relative overflow-hidden ${
                selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-tighter">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${plan.color} ${plan.text}`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{plan.name}</div>
                  <div className="text-2xl font-black text-slate-900">${plan.price}<span className="text-xs font-medium text-slate-400">/{plan.period}</span></div>
                </div>
                {selectedPlan === plan.id && <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Prepaid Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t('prepaidCards')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {cards.map((card) => (
            <Card 
              key={card.qty}
              onClick={() => setSelectedPlan(`card-${card.qty}`)}
              className={`p-4 border-2 transition-all cursor-pointer text-center ${
                selectedPlan === `card-${card.qty}` ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'
              }`}
            >
              <div className="text-lg font-black text-slate-900">{card.qty}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Invoices</div>
              <div className="text-sm font-black text-primary">${card.price}</div>
            </Card>
          ))}
        </div>
      </div>

      <Button 
        className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
        onClick={handleContinuePayment}
        disabled={!selectedPlan}
      >
        {t('continue')}
      </Button>
    </div>
  );
};

export default Subscription;