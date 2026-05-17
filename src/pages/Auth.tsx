import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Language } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Phone, CheckCircle2, Globe } from 'lucide-react';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const { setLanguage, setUser, language } = useStore();
  const { t, isRtl } = useI18n();
  const [step, setStep] = useState<'lang' | 'phone' | 'otp'>('lang');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    if (phoneNumber.length < 7) {
      toast.error(isRtl ? "رقم الهاتف غير صحيح" : "Invalid phone number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setStep('otp');
      setIsLoading(false);
      toast.success(isRtl ? "تم إرسال رمز التحقق" : "OTP Sent successfully");
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      toast.error(isRtl ? "رمز التحقق غير صحيح" : "Invalid OTP");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setUser({
        phoneNumber,
        plan: 'Basic',
        credits: 0,
        marketIntelUnlocked: false,
        onboardingComplete: false,
        metrics: {
          invoiceCount: 0,
          reportViewCount: 0,
          topCategories: []
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  const languages: { id: Language; name: string; flag: string }[] = [
    { id: 'ar', name: 'العربية', flag: '🇸🇦' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'so', name: 'Af-Soomaali', flag: '🇸🇴' },
    { id: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { id: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  ];

  return (
    <div className={`min-h-screen bg-white p-6 flex flex-col items-center justify-center ${isRtl ? 'rtl' : 'ltr'}`}>
      <AnimatePresence mode="wait">
        {step === 'lang' && (
          <motion.div
            key="lang"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Select Language</h2>
              <p className="text-slate-500">اختر لغتك المفضلة</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang.id);
                    setStep('phone');
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    language === lang.id ? 'border-primary bg-primary/5' : 'border-slate-100'
                  }`}
                >
                  <span className="font-semibold text-lg">{lang.name}</span>
                  <span className="text-2xl">{lang.flag}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{t('login')}</h2>
              <p className="text-slate-500">{isRtl ? "أدخل رقم هاتفك للبدء" : "Enter your phone number to continue"}</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Phone className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-slate-400 w-5 h-5`} />
                <Input
                  type="tel"
                  placeholder={t('phoneNumber')}
                  className={`${isRtl ? 'pr-10' : 'pl-10'} h-12 text-lg rounded-xl`}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSendOtp} 
                className="w-full h-12 text-lg font-bold rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? '...' : t('sendOTP')}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{t('enterOTP')}</h2>
              <p className="text-slate-500">{isRtl ? `تم إرسال الكود إلى ${phoneNumber}` : `Code sent to ${phoneNumber}`}</p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                maxLength={4}
                placeholder="0000"
                className="h-12 text-center text-2xl font-bold tracking-widest rounded-xl"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button 
                onClick={handleVerifyOtp} 
                className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/30"
                disabled={isLoading}
              >
                {isLoading ? '...' : t('verifyOTP')}
              </Button>
              <button 
                onClick={() => setStep('phone')}
                className="w-full text-slate-500 text-sm font-medium"
              >
                {isRtl ? "تغيير رقم الهاتف" : "Change phone number"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;