import React from 'react';
import { Home, Package, PlusCircle, Users, Settings } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useI18n();

  const tabs = [
    { id: 'home', label: t('dashboard'), icon: Home },
    { id: 'products', label: t('products'), icon: Package },
    { id: 'invoice', label: t('invoice'), icon: PlusCircle, highlight: true },
    { id: 'customers', label: t('customers'), icon: Users },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 pb-6 pt-2 flex justify-around items-center z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        if (tab.highlight) {
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="-mt-12 flex flex-col items-center"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-primary' : 'bg-primary/90'}`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center py-2 px-1 transition-colors active:opacity-70"
          >
            <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : 'text-slate-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;