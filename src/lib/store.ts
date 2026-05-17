import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ar' | 'en' | 'so' | 'am' | 'sw';

export interface User {
  phoneNumber: string;
  storeName?: string;
  logo?: string;
  businessType?: string;
  city?: string;
  plan: 'Basic' | 'Pro';
  credits: number;
  marketIntelUnlocked: boolean;
  onboardingComplete: boolean;
  metrics: {
    invoiceCount: number;
    reportViewCount: number;
    topCategories: string[];
  };
}

export interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  costPrice: number;
  quantity: number;
  category: string;
  salesCount: number;
  trending: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  totalPurchases: number;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'Draft' | 'Issued';
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppState {
  user: User | null;
  language: Language;
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  notifications: Notification[];
  isOffline: boolean;
  
  setLanguage: (lang: Language) => void;
  setUser: (user: User | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addCustomer: (customer: Customer) => void;
  addInvoice: (invoice: Invoice) => void;
  markNotificationRead: (id: string) => void;
  setOffline: (status: boolean) => void;
  resetOnboarding: () => void;
  incrementMetric: (metric: keyof User['metrics']) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: 'ar',
      products: [
        { id: '1', name: 'Milk', sellingPrice: 1.5, costPrice: 1.0, quantity: 2, category: 'Dairy', salesCount: 50, trending: true },
        { id: '2', name: 'Bread', sellingPrice: 1.0, costPrice: 0.7, quantity: 15, category: 'Bakery', salesCount: 30, trending: false },
        { id: '3', name: 'Eggs', sellingPrice: 3.0, costPrice: 2.2, quantity: 4, category: 'Dairy', salesCount: 45, trending: true },
      ],
      customers: [],
      invoices: [],
      notifications: [],
      isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
      
      setLanguage: (language) => set({ language }),
      setUser: (user) => set({ user }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
      addInvoice: (invoice) => set((state) => {
        const updatedProducts = state.products.map(p => {
          const item = invoice.items.find(i => i.productId === p.id);
          if (item) {
            return { ...p, quantity: p.quantity - item.quantity, salesCount: p.salesCount + item.quantity };
          }
          return p;
        });
        
        const updatedCustomers = state.customers.map(c => {
          if (c.id === invoice.customerId) {
            return { ...c, totalPurchases: c.totalPurchases + invoice.totalAmount };
          }
          return c;
        });

        const invoiceCount = (state.user?.metrics.invoiceCount || 0) + 1;

        return {
          invoices: [...state.invoices, invoice],
          products: updatedProducts,
          customers: updatedCustomers,
          user: state.user ? {
            ...state.user,
            metrics: {
              ...state.user.metrics,
              invoiceCount
            }
          } : null
        };
      }),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      setOffline: (isOffline) => set({ isOffline }),
      resetOnboarding: () => set((state) => ({ user: state.user ? { ...state.user, onboardingComplete: false } : null })),
      incrementMetric: (metric) => set((state) => {
        if (!state.user) return state;
        const currentVal = state.user.metrics[metric];
        if (typeof currentVal !== 'number') return state;
        
        return {
          user: {
            ...state.user,
            metrics: {
              ...state.user.metrics,
              [metric]: currentVal + 1
            }
          }
        };
      }),
    }),
    {
      name: 'zyro-storage',
    }
  )
);