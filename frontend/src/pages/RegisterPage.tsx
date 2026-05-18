import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // دمج الاسم الأول والأخير ليطابق حقل 'name' في الـ Backend
const name = `${formData.firstName} ${formData.lastName}`.trim();
await register(name, formData.email, formData.password);   
      // إذا نجح التسجيل، ننتقل للوحة التحكم
      navigate('/dashboard');
    } catch (err: any) {
      // عرض خطأ من الـ Backend (مثل: البريد مستخدم مسبقاً)
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0];
        setError(String(firstError));
      } else {
        setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-secondary-950 flex items-center justify-center p-4 font-cairo relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-800/20 rounded-full filter blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative z-10"
      >
        {/* القسم الأيمن: نموذج التسجيل */}
        <div className="p-8 md:p-12 bg-secondary-950/80 backdrop-blur-xl flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">{t('register.title')}</h2>
          <p className="text-gray-400 mb-8">{t('register.subtitle')}</p>

          {/* رسالة الخطأ */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <input type="text" name="firstName" placeholder=" " required onChange={handleChange}
                  className="w-full bg-transparent border-b-2 border-white/20 px-1 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary-400 transition-colors duration-300 peer" />
                <label className="absolute right-1 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary-400 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-sm">
                  {t('register.firstName')}
                </label>
              </div>
              <div className="relative">
                <input type="text" name="lastName" placeholder=" " required onChange={handleChange}
                  className="w-full bg-transparent border-b-2 border-white/20 px-1 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary-400 transition-colors duration-300 peer" />
                <label className="absolute right-1 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary-400 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-sm">
                  {t('register.lastName')}
                </label>
              </div>
            </div>
            
            <div className="relative">
              <input type="email" name="email" placeholder=" " required onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-white/20 px-1 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary-400 transition-colors duration-300 peer" />
              <label className="absolute right-1 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary-400 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-sm">
                {t('register.email')}
              </label>
            </div>

            <div className="relative">
              <input type="password" name="password" placeholder=" " required onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-white/20 px-1 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary-400 transition-colors duration-300 peer" />
              <label className="absolute right-1 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary-400 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-sm">
                {t('register.password')}
              </label>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-l from-primary-500 to-primary-600 hover:to-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري إنشاء الحساب...' : t('register.registerBtn')}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            {t('register.haveAccount')}{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition">
              {t('register.loginLink')}
            </Link>
          </p>
        </div>

        {/* القسم الأيسر: العرض التقديمي (كما هو بدون تغيير) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-secondary-800 to-secondary-900 relative overflow-hidden">
          {/* ... نفس كود القسم الأيسر السابق ... */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/20 rounded-full filter blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-blue-500 rounded-xl"></div>
              <span className="text-2xl font-extrabold text-white">SmartEstimator</span>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-4 leading-tight">{t('register.rightTitle')}</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">{t('register.rightDesc')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;