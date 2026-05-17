import React, { useState } from 'react';
import { useStore, Language } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Globe, 
  User, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ChevronLeft,
  MessageSquare, 
  Phone, 
  Info, 
  ChevronDown,
  CreditCard
} from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import Subscription from './Subscription';

const Settings: React.FC = () => {
  const { user, setUser, setLanguage, language } = useStore();
  const { t, isRtl } = useI18n();
  const [showHelp, setShowHelp] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  const sections = [
    { 
      title: 'General',
      items: [
        { id: 'profile', label: t('settings'), icon: User, value: user?.phoneNumber },
        { id: 'store', label: 'Store Profile', icon: Shield, value: user?.storeName },
        { id: 'sub', label: t('subscription'), icon: CreditCard, action: () => setShowSubscription(true) },
      ]
    },
    {
      title: 'App Settings',
      items: [
        { id: 'lang', label: 'Language', icon: Globe, value: t(`languages.${language}`), action: 'lang' },
      ]
    }
  ];

  const faqs = [
    { q: "How do I create an invoice?", a: "Go to the 'Invoice' tab, select a customer, add products, and click 'Issue'." },
    { q: "Can I use it offline?", a: "Yes, Zyro works offline and syncs your data once you're back online." },
    { q: "How to add products?", a: "Go to the 'Products' tab and click the '+' button to add manually." },
    { q: "Is my data safe?", a: "Your data is stored securely on your device and backed up to our cloud." },
    { q: "How to upgrade to Pro?", a: "Visit the dashboard and click on the 'Upgrade to Pro' card." },
    { q: "Can I print invoices?", a: "Yes, once an invoice is issued, you can choose the 'Print' option." },
    { q: "How to contact support?", a: "You can find our WhatsApp and Email in the 'About' section." },
    { q: "Does it support barcode scanning?", a: "Yes, use the scan icon in the Products tab." },
    { q: "How to add new customers?", a: "You can add them during invoice creation or in the Customers tab." },
    { q: "Can I export my data?", a: "Yes, go to Security & Privacy to export your business data." }
  ];

  if (showSubscription) {
    return <Subscription onBack={() => setShowSubscription(false)} />;
  }

  if (showHelp) {
    return (
      <div className="p-6 pb-24 space-y-6">
        <button onClick={() => setShowHelp(false)} className="text-primary font-bold flex items-center">
          {isRtl ? <ChevronRight className="w-5 h-5 ml-1" /> : <ChevronLeft className="w-5 h-5 mr-1" />}
          Back to Settings
        </button>
        <h1 className="text-2xl font-black text-slate-900">Help & Support</h1>
        
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm font-bold text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 text-xs leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card className="p-6 bg-primary/5 border-none space-y-4">
          <h3 className="font-bold text-primary">Contact Support</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-slate-600">
              <Phone className="w-4 h-4 mr-3 text-primary" />
              +252 63 7494948
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <MessageSquare className="w-4 h-4 mr-3 text-primary" />
              maxamed446510@gmail.com
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <Info className="w-4 h-4 mr-3 text-primary" />
              Sat - Thu, 9 AM - 6 PM (EAT)
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const languages: { id: Language; name: string }[] = [
    { id: 'ar', name: 'العربية' },
    { id: 'en', name: 'English' },
    { id: 'so', name: 'Af-Soomaali' },
    { id: 'am', name: 'አማርኛ' },
    { id: 'sw', name: 'Kiswahili' },
  ];

  return (
    <div className="p-6 pb-24 space-y-8">
      <h1 className="text-2xl font-black text-slate-900">{t('settings')}</h1>

      <div className="space-y-6">
        {/* Language Quick Switcher */}
        <Card className="p-4 border-none shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
            <Globe className="w-3 h-3 mr-1" /> Quick Language Switch
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === lang.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </Card>

        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{section.title}</h3>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {section.items.map((item, i) => (
                <button 
                  key={item.id}
                  onClick={() => typeof item.action === 'function' ? item.action() : null}
                  className={`w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors ${i !== section.items.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <item.icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <span className="font-bold text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    {item.value && <span className="text-sm mr-2">{item.value}</span>}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Support</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button 
              onClick={() => setShowHelp(true)}
              className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-slate-500" />
                </div>
                <span className="font-bold text-slate-700">Help & FAQ</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
        
        <div className="pt-4 space-y-4">
          <Card className="p-6 border-none bg-slate-100 text-center">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div className="font-black text-slate-900">Zyro Toolkit v1.0.0</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Developer: Zyro Tech</div>
            <div className="text-xs text-slate-500 mt-2">Made for East African SMEs</div>
          </Card>

          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-destructive/10"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;