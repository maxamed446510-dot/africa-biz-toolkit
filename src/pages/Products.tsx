import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, ScanLine, AlertTriangle, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Products: React.FC = () => {
  const { products, addProduct } = useStore();
  const { t, isRtl } = useI18n();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newProd, setNewProd] = useState({
    name: '',
    sellingPrice: '',
    costPrice: '',
    quantity: '',
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newProd.name || !newProd.sellingPrice || !newProd.quantity) {
      toast.error("Please fill all fields");
      return;
    }
    addProduct({
      id: Math.random().toString(36).substr(2, 9),
      name: newProd.name,
      sellingPrice: parseFloat(newProd.sellingPrice),
      costPrice: parseFloat(newProd.costPrice || '0'),
      quantity: parseInt(newProd.quantity),
      category: 'General',
      salesCount: 0,
      trending: false,
    });
    setNewProd({ name: '', sellingPrice: '', costPrice: '', quantity: '' });
    setShowAdd(false);
    toast.success("Product added successfully");
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">{t('products')}</h1>
        <Button onClick={() => setShowAdd(true)} className="rounded-xl shadow-lg shadow-primary/30">
          <Plus className="w-5 h-5 mr-1" />
          {t('add')}
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-slate-400 w-5 h-5`} />
          <Input 
            placeholder={t('search')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`h-12 bg-white rounded-xl ${isRtl ? 'pr-10' : 'pl-10'} border-none shadow-sm`}
          />
        </div>
        <button className="p-3 bg-white rounded-xl shadow-sm">
          <ScanLine className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">No products found</p>
          </div>
        ) : (
          filteredProducts.map(p => (
            <Card key={p.id} className="p-4 border-none shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${p.quantity < 5 ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-400 flex items-center">
                    {t('stock')}: <span className={`ml-1 font-bold ${p.quantity < 5 ? 'text-error' : 'text-slate-600'}`}>{p.quantity}</span>
                    {p.quantity < 5 && <AlertTriangle className="w-3 h-3 ml-1 text-error" />}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-lg text-slate-900">${p.sellingPrice.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('price')}</div>
              </div>
            </Card>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-3xl p-6 space-y-6"
          >
            <h2 className="text-xl font-black text-slate-900">Add New Product</h2>
            <div className="space-y-4">
              <Input 
                placeholder="Product Name" 
                value={newProd.name}
                onChange={e => setNewProd({...newProd, name: e.target.value})}
                className="h-12 rounded-xl"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  type="number" 
                  placeholder="Selling Price" 
                  value={newProd.sellingPrice}
                  onChange={e => setNewProd({...newProd, sellingPrice: e.target.value})}
                  className="h-12 rounded-xl"
                />
                <Input 
                  type="number" 
                  placeholder="Quantity" 
                  value={newProd.quantity}
                  onChange={e => setNewProd({...newProd, quantity: e.target.value})}
                  className="h-12 rounded-xl"
                />
              </div>
              <Input 
                type="number" 
                placeholder="Cost Price (Optional)" 
                value={newProd.costPrice}
                onChange={e => setNewProd({...newProd, costPrice: e.target.value})}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1 h-12 rounded-xl">Cancel</Button>
              <Button onClick={handleAdd} className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20">Add Product</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;