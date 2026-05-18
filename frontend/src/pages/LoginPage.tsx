import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // استدعاء دالة تسجيل الدخول من Zustand Store
      await login(email, password);
      // في حالة النجاح، الانتقال للوحة التحكم
      navigate('/dashboard');
    } catch (err: any) {
      // عرض خطأ من الـ Backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-secondary-950 flex items-center justify-center p-4 font-cairo relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-blue-500 rounded-xl"></div>
          <span className="text-2xl font-extrabold text-white">SmartEst.</span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input type="email" placeholder=" " required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/20 px-1 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary-400 transition-colors duration-300 peer" />
            <label className="absolute right-1 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary-400 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-sm">
              البريد الإلكتروني
            </label>
          </div>

          <div className="relative">
            <input type="password" placeholder=" " required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/20 px-1 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary-400 transition-colors duration-300 peer" />
            <label className="absolute right-1 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary-400 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-sm">
              كلمة المرور
            </label>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={isSubmitting}
            className="w-full bg-gradient-to-l from-primary-500 to-primary-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition">
            سجل الآن
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;