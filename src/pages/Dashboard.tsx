import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/card';
import {
  TrendingUp,
  Package,
  AlertCircle,
  Users,
  Bell,
  Search,
  CreditCard,
  Lock,
  PlusCircle,
  BarChart3,
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user, products, customers, invoices, notifications, incrementMetric } = useStore();
  const { t, isRtl } = useI18n();

  const today = new Date().toISOString().split('T')[0];
  const todaySales = invoices
    .filter(inv => inv.createdAt.startsWith(today))
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const lowStockProducts = products.filter(p => p.quantity < 5);
  const draftInvoices = invoices.filter(inv => inv.status === 'Draft');

  const metrics = [
    { label: t('todaySales'), value: `$${todaySales.toFixed(2)}`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { label: t('profit'), value: `$${(todaySales * 0.3).toFixed(2)}`, icon: CreditCard, color: 'text-success', bg: 'bg-success/10' },
    { label: t('lowStock'), value: lowStockProducts.length, icon: AlertCircle, color: 'text-error', bg: 'bg-error/10' },
    { label: t('newCustomers'), value: customers.length, icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Behavior-based logic
  const isInvoiceHeavy = (user?.metrics?.invoiceCount || 0) > 5;
  const isReportLover = (user?.metrics?.reportViewCount || 0) > 3;

  const recommendedProducts = [
    { name: 'Organic Honey', category: 'Health', growth: '+25%' },
    { name: 'Brown Sugar', category: 'Groceries', growth: '+18%' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {t('goodMorning')}, {user?.storeName}!
          </h1>
          <p className="text-slate-500 text-sm">{user?.city}</p>
        </div>
        <div className="flex space-x-3">
          <button className="p-3 bg-white rounded-xl shadow-sm relative">
            <Bell className="w-6 h-6 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-error rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Smart Notifications */}
      {(draftInvoices.length > 0 || lowStockProducts.length > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-warning/10 border border-warning/20 p-4 rounded-2xl flex items-start gap-4"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Zap className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-800 text-sm">Quick Updates</div>
            {draftInvoices.length > 0 && (
              <p className="text-slate-600 text-xs mt-1">
                {t('pendingInvoices', { count: draftInvoices.length })}
              </p>
            )}
            {lowStockProducts.length > 0 && (
              <p className="text-slate-600 text-xs mt-1">
                {t('lowStockAlert', { count: lowStockProducts.length })}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 self-center" />
        </motion.div>
      )}

      {/* Dynamic Shortcuts */}
      <div className="grid grid-cols-2 gap-4">
        {isInvoiceHeavy && (
          <button className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 flex flex-col items-center text-center gap-2 active:scale-95 transition-all">
            <PlusCircle className="w-8 h-8" />
            <span className="font-bold text-xs">{t('newInvoiceShort')}</span>
          </button>
        )}
        {isReportLover && (
          <button 
            className="p-4 bg-secondary text-white rounded-2xl shadow-lg shadow-secondary/20 flex flex-col items-center text-center gap-2 active:scale-95 transition-all"
            onClick={() => incrementMetric('reportViewCount')}
          >
            <BarChart3 className="w-8 h-8" />
            <span className="font-bold text-xs">{t('viewReportsShort')}</span>
          </button>
        )}
      </div>

      {/* Mini Profit Chart (Mocked if report lover) */}
      {isReportLover && (
        <Card className="p-6 border-none shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Weekly Profit</h3>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="h-32 flex items-end justify-between gap-2">
            {[40, 70, 55, 90, 65, 80, 100].map((height, i) => (
              <div 
                key={i} 
                className="w-full bg-slate-100 rounded-t-lg relative group overflow-hidden"
                style={{ height: '100%' }}
              >
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  className="absolute bottom-0 left-0 right-0 bg-secondary/30 group-hover:bg-secondary/50 transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </Card>
      )}

      {/* Quick Search */}
      <div className="relative">
        <Search className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} text-slate-400 w-5 h-5`} />
        <input 
          type="text" 
          placeholder={t('search') + "..."} 
          className={`w-full h-14 bg-white border-none rounded-2xl shadow-sm ${isRtl ? 'pr-12' : 'pl-12'} focus:ring-2 focus:ring-primary/20 transition-all`}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 border-none shadow-sm flex flex-col items-center text-center space-y-2">
              <div className={`p-3 rounded-xl ${m.bg}`}>
                <m.icon className={`w-6 h-6 ${m.color}`} />
              </div>
              <div className="text-2xl font-black text-slate-900">{m.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Market Intelligence / Recommended */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">{t('marketIntelligence')}</h3>
        </div>
        
        <Card className="p-6 border-none bg-gradient-to-br from-primary to-purple-600 text-white">
           <div className="flex items-center gap-2 mb-4">
             <Zap className="w-5 h-5 text-white/80" />
             <span className="text-xs font-bold uppercase tracking-widest">{t('recommendedForYou')}</span>
           </div>
           <h4 className="text-lg font-bold mb-2">{t('basedOnSales')}</h4>
           
           <div className="space-y-3 mt-4">
             {recommendedProducts.map((p, i) => (
               <div key={i} className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                 <div>
                   <div className="font-bold text-sm">{p.name}</div>
                   <div className="text-[10px] text-white/60">{p.category}</div>
                 </div>
                 <div className="text-xs font-black text-success-foreground bg-success px-2 py-1 rounded-lg">
                   {p.growth}
                 </div>
               </div>
             ))}
           </div>
           
           <button className="w-full mt-6 bg-white text-primary font-black py-3 rounded-xl shadow-lg active:scale-95 transition-all">
             Explore Full Market Insights
           </button>
        </Card>
      </div>

      {/* Recent Invoices Mini List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Recent Sales</h3>
          <button className="text-primary text-sm font-bold">See All</button>
        </div>
        {invoices.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-400 text-sm">No sales yet today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.slice(0, 3).map((inv) => (
              <Card key={inv.id} className="p-4 border-none shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">{inv.customerName}</div>
                  <div className="text-xs text-slate-400">{new Date(inv.createdAt).toLocaleTimeString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">${inv.totalAmount.toFixed(2)}</div>
                  <div className="text-[10px] text-success font-bold uppercase">Paid</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;