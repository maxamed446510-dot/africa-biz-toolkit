import React from 'react';
import { HelpCircle, Phone, MessageSquare, Mail } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';

const SupportButton: React.FC = () => {
  const { t, isRtl } = useI18n();

  const supportDetails = {
    phone: '+252637494948',
    whatsapp: '+252637494948',
    email: 'maxamed446510@gmail.com'
  };

  return (
    <div className={`fixed bottom-24 ${isRtl ? 'left-6' : 'right-6'} z-40`}>
      <Drawer>
        <DrawerTrigger asChild>
          <button className="w-14 h-14 bg-white text-primary rounded-full shadow-xl flex items-center justify-center border-2 border-primary/10 active:scale-95 transition-all">
            <HelpCircle className="w-7 h-7" />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm p-6 pb-12">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-2xl font-black">{t('needHelp')}</DrawerTitle>
            </DrawerHeader>
            <div className="space-y-4 mt-4">
              <Button 
                variant="outline" 
                className="w-full h-16 justify-start text-lg font-bold gap-4 rounded-2xl border-slate-100"
                onClick={() => window.open(`tel:${supportDetails.phone}`)}
              >
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                {t('callSupport')}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-16 justify-start text-lg font-bold gap-4 rounded-2xl border-slate-100"
                onClick={() => window.open(`https://wa.me/${supportDetails.whatsapp.replace('+', '')}`)}
              >
                <div className="p-2 bg-success/10 rounded-xl text-success">
                  <MessageSquare className="w-6 h-6" />
                </div>
                {t('whatsapp')}
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-16 justify-start text-lg font-bold gap-4 rounded-2xl border-slate-100"
                onClick={() => window.open(`mailto:${supportDetails.email}`)}
              >
                <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                  <Mail className="w-6 h-6" />
                </div>
                {t('email')}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SupportButton;