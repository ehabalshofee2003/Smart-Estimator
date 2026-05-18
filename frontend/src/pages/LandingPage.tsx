import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageSquare, BarChart3, FileText, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore(); // معرفة حالة المستخدم

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const features = [
    { icon: <MessageSquare size={28} />, title: 'محادثة ذكية', desc: 'بوت يفهم اللغة العربية ويوجهك خطوة بخطوة لجمع بيانات مشروعك بسهولة.' },
    { icon: <BarChart3 size={28} />, title: 'تحليل FPA دقيق', desc: 'حساب نقاط الوظائف المعدلة وغير المعدلة بأعلى معايير الدقة الرياضية.' },
    { icon: <Users size={28} />, title: 'تحليل UCP متقدم', desc: 'تقدير حالات الاستخدام مع العوامل التقنية والبيئية الشاملة.' },
    { icon: <FileText size={28} />, title: 'تقارير PDF احترافية', desc: 'إنشاء تقارير مفصلة بتنسيق RTL عربي احترافي جاهزة للطباعة أو المشاركة.' }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-secondary-950 font-cairo text-white overflow-x-hidden">
      
      {/* شريط التنقل العلوي */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-5 bg-secondary-950/80 backdrop-blur-md border-b border-white/10 z-50 fixed w-full top-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-primary-500 to-secondary-800 rounded-lg"></div>
          <span className="text-xl font-bold text-white">SmartEst.</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#features" className="hover:text-primary-400 transition">المميزات</a>
          <a href="#how-it-works" className="hover:text-primary-400 transition">كيف يعمل</a>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className="text-sm text-gray-300 border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            {i18n.language === 'ar' ? 'EN' : 'عربي'}
          </button>
          
          {/* زر تسجيل الدخول / لوحة التحكم حسب الحالة */}
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              لوحة التحكم
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-xl font-semibold transition shadow-lg shadow-primary-500/20"
            >
              تسجيل الدخول
            </button>
          )}
        </div>
      </nav>

      {/* القسم الرئيسي (Hero) */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-800/20 rounded-full filter blur-3xl animate-pulse"></div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            قدّر مشروعك البرمجي <br />
            <span className="bg-gradient-to-l from-primary-400 to-blue-500 bg-clip-text text-transparent">
              بالذكاء الاصطناعي
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            منصة ذكية تحادثك، تحلل متطلباتك، وتقدم تقديرات دقيقة للجهد والتكلفة والوقت باستخدام معايير FPA و UCP.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* الزر الأساسي: يوجه المسجل للشات، وغير المسجل للتسجيل */}
            <button 
              onClick={() => navigate(isAuthenticated ? '/chat' : '/register')}
              className="bg-gradient-to-l from-primary-500 to-primary-600 hover:to-primary-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition transform hover:scale-105 shadow-xl shadow-primary-500/30"
            >
              {isAuthenticated ? 'ابدأ تقدير جديد' : 'ابدأ التقدير مجاناً'}
            </button>
            
            {/* الزر الثانوي */}
            {!isAuthenticated && (
              <button 
                onClick={() => navigate('/login')}
                className="bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition"
              >
                لدي حساب بالفعل
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* قسم المميزات */}
      <section id="features" className="py-24 px-4 relative z-10 bg-secondary-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            لماذا تختار <span className="text-primary-400">SmartEst</span>؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl hover:border-primary-500/50 transition duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-400 mb-5 group-hover:scale-110 transition transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم كيف يعمل */}
      <section id="how-it-works" className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">كيف يعمل النظام؟</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {['أجب على أسئلة البوت', 'تحليل FPA و UCP', 'احصل على التقرير'].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary-500/30">
                  {idx + 1}
                </div>
                <p className="text-white font-semibold text-lg">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* التذييل */}
      <footer className="py-10 text-center border-t border-white/10 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} SmartEstimator. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default LandingPage;