import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FolderKanban, DollarSign, BarChart3, Users, Loader2 } from 'lucide-react';
import api from '../api/axios';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalProjects: 0, totalCost: 0, avgCost: 0, recentProjects: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  const cards = [
    { icon: <FolderKanban size={24} />, value: stats.totalProjects, label: 'إجمالي المشاريع', color: 'from-blue-500 to-blue-600' },
    { icon: <DollarSign size={24} />, value: `$${stats.totalCost.toLocaleString()}`, label: 'إجمالي التكلفة', color: 'from-primary-500 to-primary-600' },
    { icon: <BarChart3 size={24} />, value: `$${stats.avgCost.toLocaleString()}`, label: 'متوسط التكلفة', color: 'from-amber-500 to-amber-600' },
    { icon: <Users size={24} />, value: '1', label: 'فريق العمل', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">{t('dashboard.title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4 group hover:border-white/20 transition">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">آخر المشاريع</h2>
        
        {stats.recentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderKanban size={40} className="text-gray-500 mb-4" />
            <p className="text-gray-400 mb-6 max-w-md">لا توجد مشاريع حالياً. ابدأ بتقدير مشروعك الأول!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="px-4 py-3 font-semibold">اسم المشروع</th>
                  <th className="px-4 py-3 font-semibold">التعقيد</th>
                  <th className="px-4 py-3 font-semibold">التكلفة</th>
                  <th className="px-4 py-3 font-semibold">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProjects.map((project: any) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-white">
                    <td className="px-4 py-3 font-semibold">{project.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-primary-500/20 text-primary-400">{project.complexity_level}</span>
                    </td>
                    <td className="px-4 py-3 text-primary-400 font-bold">${project.estimated_cost}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{new Date(project.created_at).toLocaleDateString('ar-EG')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;