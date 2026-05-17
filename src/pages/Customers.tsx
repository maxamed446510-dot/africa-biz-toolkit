import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Users, Search, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Customers: React.FC = () => {
  const { customers } = useStore();
  const { t, isRtl } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phoneNumber.includes(searchTerm)
  );

  const handleBulkWhatsApp = () => {
    toast.info("Preparing bulk promotion message...");
    setTimeout(() => {
      toast.success("Ready! Select customers to send.");
    }, 1000);
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">{t('customers')}</h1>
        <Button onClick={handleBulkWhatsApp} variant="outline" className="border-primary text-primary font-bold rounded-xl">
          <MessageCircle className="w-4 h-4 mr-1" />
          Bulk Promo
        </Button>
      </div>

      <div className="relative">
        <Search className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-slate-400 w-5 h-5`} />
        <Input 
          placeholder="Search customers" 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`h-12 bg-white rounded-xl ${isRtl ? 'pr-10' : 'pl-10'} border-none shadow-sm`}
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">No customers yet</p>
          </div>
        ) : (
          filtered.map(c => (
            <Card key={c.id} className="p-4 border-none shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center text-xl font-black">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.phoneNumber}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-slate-50 rounded-lg text-primary active:scale-90 transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <div className="text-right ml-4">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Purchases</div>
                  <div className="font-black text-slate-900">${c.totalPurchases.toFixed(2)}</div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Customers;