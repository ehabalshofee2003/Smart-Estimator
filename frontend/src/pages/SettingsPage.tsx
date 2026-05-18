import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Save, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [hourlyRate, setHourlyRate] = useState('50');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setHourlyRate(response.data.hourly_rate.toString());
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', { hourly_rate: parseFloat(hourlyRate) });
      toast.success('تم حفظ الإعدادات بنجاح!');
    } catch (error) { 
      toast.error('فشل حفظ الإعدادات.');
    } finally { setSaving(false); }
  };

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    toast.success('تم تغيير اللغة');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <Settings size={24} /> الإعدادات
      </h1>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-8">
        
        {/* إعدادات السعر */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">التقديرات المالية</h2>
          <label className="block text-gray-400 text-sm mb-2">سعر الساعة بالدولار ($) - يُستخدم في حساب التكلفة</label>
          <div className="flex items-center gap-4">
            <input 
              type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white w-32 outline-none focus:border-primary-500 transition"
              min="1"
            />
            <button 
              onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50">
              <Save size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>

        {/* إعدادات اللغة */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">اللغة والمظهر</h2>
          <label className="block text-gray-400 text-sm mb-2">لغة الواجهة</label>
          <div className="flex gap-4">
            <button 
              onClick={() => toggleLanguage('ar')}
              className={`px-6 py-2 rounded-xl border transition ${i18n.language === 'ar' ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
              العربية
            </button>
            <button 
              onClick={() => toggleLanguage('en')}
              className={`px-6 py-2 rounded-xl border transition ${i18n.language === 'en' ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
              English
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;