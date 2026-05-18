import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, MessageSquare, FolderKanban, FileText, Settings, LogOut, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/authStore'; // استدعاء الـ Store

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const links = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: t('sidebar.home') },
    { path: '/chat', icon: <MessageSquare size={20} />, label: t('sidebar.newEstimation') },
    { path: '/projects', icon: <FolderKanban size={20} />, label: t('sidebar.projects') },
    { path: '/reports', icon: <FileText size={20} />, label: t('sidebar.reports') },
    { path: '/settings', icon: <Settings size={20} />, label: t('sidebar.settings') },
  ];

  return (
    <aside className="w-64 bg-secondary-900 border-l border-white/10 p-6 flex flex-col justify-between fixed h-full right-0 top-0 z-40">
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity size={24} className="text-white" />
          </div>
          <span className="text-xl font-extrabold text-white">SmartEst.</span>
        </div>
        <nav className="space-y-2">
          {links.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={index}
                to={link.path} // تأكد أن هذا الحقل موجود ومكتوب بشكل صحيح
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                  isActive 
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {link.icon}
                <span className="font-semibold">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* زر تسجيل الخروج */}
      <button 
        onClick={() => useAuthStore.getState().logout()}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition duration-200 border border-transparent hover:border-red-500/20"
      >
        <LogOut size={20} />
        <span className="font-semibold">{t('sidebar.logout')}</span>
      </button>
    </aside>
  );
};

export default Sidebar;