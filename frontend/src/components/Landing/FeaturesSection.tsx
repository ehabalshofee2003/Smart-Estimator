import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// تعريف واجهة (Interface) للمميزات - قوة TypeScript!
interface Feature {
  icon: string;
  titleKey: string;
  descKey: string;
}

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features: Feature[] = [
    { icon: '🤖', titleKey: 'landing.features.ai.title', descKey: 'landing.features.ai.desc' },
    { icon: '📊', titleKey: 'landing.features.fpa.title', descKey: 'landing.features.fpa.desc' },
    { icon: '🎯', titleKey: 'landing.features.ucp.title', descKey: 'landing.features.ucp.desc' },
    { icon: '📄', titleKey: 'landing.features.pdf.title', descKey: 'landing.features.pdf.desc' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section id="features" className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          {t('landing.features.mainTitle')}
        </h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:border-primary-500/50 transition duration-300 group cursor-pointer"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition">
                {t(feature.titleKey)}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;