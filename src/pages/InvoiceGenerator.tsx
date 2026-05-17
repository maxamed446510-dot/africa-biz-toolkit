import React, { useState } from 'react';
import { useStore, Product, InvoiceItem, Customer } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, UserPlus, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const InvoiceGenerator: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { products, customers, addInvoice, addCustomer } = useStore();
  const { t, isRtl } = useI18n();
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [searchCust, setSearchCust] = useState('');
  const [searchProd, setSearchProd] = useState('');
  const [isAddingCust, setIsAddingCust] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', phone: '' });

  const total = invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredCust = customers.filter(c => 
    c.name.toLowerCase().includes(searchCust.toLowerCase()) || 
    c.phoneNumber.includes(searchCust)
  );

  const filteredProd = products.filter(p => 
    p.name.toLowerCase().includes(searchProd.toLowerCase()) && p.quantity > 0
  );

  const addItem = (product: Product) => {
    const existing = invoiceItems.find(i => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.quantity) {
        toast.error("Not enough stock");
        return;
      }
      setInvoiceItems(invoiceItems.map(i => 
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setInvoiceItems([...invoiceItems, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.sellingPrice
      }]);
    }
  };

  const removeItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(i => i.productId !== id));
  };

  const handleAddCust = () => {
    if (!newCust.name || !newCust.phone) return;
    const c: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCust.name,
      phoneNumber: newCust.phone,
      totalPurchases: 0
    };
    addCustomer(c);
    setSelectedCustomer(c);
    setIsAddingCust(false);
    setStep(2);
  };

  const handleFinish = () => {
    if (!selectedCustomer) return;
    const inv = {
      id: `INV-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: invoiceItems,
      totalAmount: total,
      status: 'Issued' as const,
      createdAt: new Date().toISOString()
    };
    addInvoice(inv);
    toast.success("Invoice generated successfully!");
    
    // Simulate WhatsApp sharing
    const text = `Hi ${selectedCustomer.name}, your invoice from Zyro Toolkit is ready. Total: $${total.toFixed(2)}.`;
    window.open(`https://wa.me/${selectedCustomer.phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    
    onComplete();
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black text-slate-900">{t('invoice')}</h1>
        <div className="text-sm font-bold text-slate-400">Step {step}/3</div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-xl font-bold">Select Customer</h2>
            <div className="relative">
              <Search className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-slate-400 w-5 h-5`} />
              <Input 
                placeholder="Search by name or phone" 
                value={searchCust}
                onChange={e => setSearchCust(e.target.value)}
                className={`h-12 bg-white rounded-xl ${isRtl ? 'pr-10' : 'pl-10'} border-none shadow-sm`}
              />
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setIsAddingCust(true)}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-bold flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add New Customer</span>
              </button>
              
              {filteredCust.map(c => (
                <Card 
                  key={c.id} 
                  onClick={() => { setSelectedCustomer(c); setStep(2); }}
                  className="p-4 border-none shadow-sm flex justify-between items-center active:scale-95 transition-all"
                >
                  <div className="font-bold">{c.name}</div>
                  <div className="text-slate-400 text-sm">{c.phoneNumber}</div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Products</h2>
              <div className="text-primary font-black text-lg">${total.toFixed(2)}</div>
            </div>
            
            <div className="relative">
              <Search className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-slate-400 w-5 h-5`} />
              <Input 
                placeholder="Search products" 
                value={searchProd}
                onChange={e => setSearchProd(e.target.value)}
                className={`h-12 bg-white rounded-xl ${isRtl ? 'pr-10' : 'pl-10'} border-none shadow-sm`}
              />
            </div>

            <div className="max-h-[300px] overflow-auto space-y-2">
              {filteredProd.map(p => (
                <Card 
                  key={p.id} 
                  onClick={() => addItem(p)}
                  className="p-3 border-none shadow-sm flex justify-between items-center active:bg-slate-50"
                >
                  <div>
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-[10px] text-slate-400">Stock: {p.quantity}</div>
                  </div>
                  <div className="font-black text-primary">${p.sellingPrice}</div>
                </Card>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <h3 className="font-bold text-sm text-slate-500 uppercase">Current Items</h3>
              {invoiceItems.map(item => (
                <div key={item.productId} className="flex justify-between items-center bg-white p-3 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => removeItem(item.productId)} className="text-error p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-xs text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <Button 
              disabled={invoiceItems.length === 0} 
              onClick={() => setStep(3)} 
              className="w-full h-14 rounded-2xl text-lg font-bold"
            >
              Review Invoice
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold">Review & Issue</h2>
            <Card className="p-6 border-none shadow-lg space-y-6 bg-white">
              <div className="flex justify-between border-b pb-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold">To</div>
                  <div className="font-black text-lg text-slate-900">{selectedCustomer?.name}</div>
                  <div className="text-sm text-slate-500">{selectedCustomer?.phoneNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase font-bold">Date</div>
                  <div className="font-bold text-slate-900">{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              <div className="space-y-3">
                {invoiceItems.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-black text-slate-900">{t('total')}</span>
                <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
              </div>
            </Card>

            <div className="space-y-4">
              <Button onClick={handleFinish} className="w-full h-14 rounded-2xl text-lg font-bold bg-success hover:bg-success/90 shadow-lg shadow-success/20">
                <CheckCircle className="w-5 h-5 mr-2" />
                Issue & Send WhatsApp
              </Button>
              <Button variant="outline" onClick={() => setStep(2)} className="w-full h-12 rounded-xl">
                Edit Items
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isAddingCust && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6 space-y-6">
            <h2 className="text-xl font-bold">New Customer</h2>
            <div className="space-y-4">
              <Input placeholder="Full Name" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
              <Input placeholder="Phone Number" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setIsAddingCust(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleAddCust} className="flex-1">Save</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;