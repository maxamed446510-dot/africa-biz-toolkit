import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';

const Splash: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
          <span className="text-primary text-6xl font-black">Z</span>
        </div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white text-3xl font-bold tracking-tight"
        >
          {t('appName')} Business Toolkit
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-4 text-white/80 text-sm"
        >
          Empowering SME Owners
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-12 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-white"
          />
        ))}
      </div>
    </div>
  );
};

export default Splash;