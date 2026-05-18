import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-800/30 rounded-full filter blur-3xl animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          {t('landing.hero.title1')} <br />
          <span className="bg-gradient-to-l from-primary-400 to-blue-500 bg-clip-text text-transparent">
            {t('landing.hero.titleHighlight')}
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {t('landing.hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition transform hover:scale-105 shadow-lg shadow-primary-500/30">
            {t('landing.hero.startBtn')}
          </button>
          <button className="bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-bold text-lg transition">
            {t('landing.hero.loginBtn')}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;