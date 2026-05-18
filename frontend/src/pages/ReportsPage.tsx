import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Calendar, BarChart3, DollarSign, FolderKanban, Loader2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try { const response = await api.get('/projects'); setReports(response.data.projects); } 
    catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
      try {
        await api.delete(`/projects/${projectId}`);
        setReports(reports.filter((r: any) => r.id !== projectId));
        toast.success('تم حذف التقرير');
      } catch (error) { toast.error('فشل الحذف'); }
    }
  };

  const handleDownloadPdf = async (projectId: number, projectName: string) => {
    setDownloadingId(projectId);
    try {
      const response = await api.get(`/reports/${projectId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', `report-${projectName}.pdf`);
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
      toast.success('جاري تحميل التقرير');
    } catch (error) { toast.error('فشل تحميل التقرير'); } 
    finally { setDownloadingId(null); }
  };

  if (loading) return <div className="p-8 flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-primary-400 animate-spin" /></div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8"><h1 className="text-2xl font-bold text-white">التقارير</h1></div>
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/5 border border-white/10 rounded-2xl">
          <FileText size={40} className="text-gray-500 mb-4" /><p className="text-gray-400">لا توجد تقارير.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report: any, index) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/30 flex flex-col">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20"><FolderKanban size={20} className="text-primary-400" /></div><h3 className="text-lg font-bold text-white truncate">{report.name}</h3></div>
                  <button onClick={(e) => handleDelete(e, report.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition"><Trash2 size={18} /></button>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-3"><Calendar size={14} /><span>{new Date(report.created_at).toLocaleDateString('ar-EG')}</span></div>
              </div>
              <div className="p-6 flex-1 space-y-3">
                <div className="flex justify-between items-center"><span className="text-gray-400 flex items-center gap-1"><BarChart3 size={16} /> التعقيد</span><span className="text-white font-semibold bg-white/10 px-2 py-0.5 rounded-md text-xs">{report.complexity_level === 'small' ? 'صغير' : report.complexity_level === 'medium' ? 'متوسط' : report.complexity_level === 'large' ? 'كبير' : 'مؤسسي'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 flex items-center gap-1"><DollarSign size={16} /> التكلفة</span><span className="text-primary-400 font-extrabold text-lg">{report.estimated_cost} $</span></div>
              </div>
              <div className="p-4 border-t border-white/10">
                <button onClick={() => handleDownloadPdf(report.id, report.name)} disabled={downloadingId === report.id} className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-primary-500 to-primary-600 text-white py-2.5 rounded-xl font-semibold transition text-sm disabled:opacity-50">
                  <Download size={16} className={downloadingId === report.id ? 'animate-bounce' : ''} /> {downloadingId === report.id ? 'جاري التحميل...' : 'تحميل PDF'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;