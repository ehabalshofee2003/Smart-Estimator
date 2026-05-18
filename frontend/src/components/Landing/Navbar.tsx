import React from 'react';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = (): void => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-secondary-950/80 backdrop-blur-md border-b border-white/10 z-50 fixed w-full top-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-secondary-800 rounded-lg"></div>
        <span className="text-xl font-bold text-white">SmartEstimator</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-gray-300">
        <a href="#features" className="hover:text-primary-400 transition">{t('landing.nav.features')}</a>
        <a href="#how-it-works" className="hover:text-primary-400 transition">{t('landing.nav.howItWorks')}</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="text-sm text-gray-300 border border-white/20 px-3 py-1 rounded-lg hover:bg-white/10 transition"
        >
          {i18n.language === 'ar' ? 'EN' : 'عربي'}
        </button>
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-xl font-semibold transition shadow-lg shadow-primary-500/20">
          {t('landing.nav.login')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;