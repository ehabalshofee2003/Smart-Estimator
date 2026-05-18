import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-center border-t border-white/10 text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} SmartEstimator. جميع الحقوق محفوظة.</p>
    </footer>
  );
};

export default Footer;