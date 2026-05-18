import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useChatStore } from '../store/chatStore';
import { Send, Calculator, Plus, MessageSquare, Sparkles, Trash2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const { sessions, activeSessionId, messages, isLoading, fetchSessions, loadSession, startNewSession, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchSessions(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const handleCalculate = () => { sendMessage('CALCULATE_ESTIMATION'); };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: number) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
      try {
        await api.delete(`/chat/sessions/${sessionId}`);
        if (activeSessionId === sessionId) {
          useChatStore.setState({ activeSessionId: null, messages: [] });
        }
        fetchSessions();
        toast.success('تم حذف المحادثة');
      } catch (error) { toast.error('فشل الحذف'); }
    }
  };

  return (
    // المكون الأب: يأذذ المساحة المتبقية من MainLayout ويمنع التمرير
    <div className="flex h-full overflow-hidden bg-secondary-950">
      
      {/* ========================================= */}
      {/* 1. منطقة المحادثة الرئيسية (وسط/يمين) */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* خلفيات متوهجة للزينة */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* منطقة عرض الرسائل (هذا الجزء وحده يلف للأسفل) */}
        {/* منطقة عرض الرسائل (الشريط هنا يلتصق بالحافة) */}
        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          {/* الـ Padding والـ Max-width نقلناهما هنا، ليكون الشريط على الحافة */}
          <div className="p-6 space-y-6 max-w-4xl w-full mx-auto">
            
            {messages.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                <Sparkles size={48} className="mb-4 text-primary-500/50" />
                <h2 className="text-xl font-bold text-white mb-2">مرحباً بك في المساعد الذكي</h2>
                <p>اضغط على "محادثة جديدة" من القائمة اليسرى لبدء تقدير مشروعك</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] p-4 rounded-2xl shadow-lg backdrop-blur-md ${
                      msg.role === 'user' ? 'bg-primary-500/10 border border-primary-500/30 text-white rounded-br-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                <div className="bg-white/5 border border-white/10 text-gray-400 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* شريط الإدخال السفلي (ملصق بالأسفل دائماً) */}
        <div className="w-full p-4 bg-secondary-950/80 backdrop-blur-md border-t border-white/10 relative z-20">
          <div className="max-w-4xl mx-auto flex items-end gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 focus-within:border-primary-500/50 transition-colors">
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={t('chat.inputPlaceholder')} className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 px-2 resize-none max-h-32 overflow-y-auto" rows={1} disabled={isLoading || !activeSessionId} />
            <button onClick={handleSend} disabled={!input.trim() || isLoading || !activeSessionId}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition h-fit">
              <Send size={20} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. القائمة الجانبية للمحادثات (يسار) */}
      {/* ========================================= */}
      <div className="w-72 bg-secondary-900 border-r border-white/10 flex flex-col h-full">
        
        {/* زر محادثة جديدة */}
        <div className="p-4">
          <button onClick={startNewSession}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-xl font-semibold transition">
            <Plus size={18} /> محادثة جديدة
          </button>
        </div>
        
        {/* قائمة المحادثات */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {sessions.map((session) => (
            <div key={session.id} 
              className={`group w-full flex items-center justify-between text-right p-3 rounded-lg transition border ${
                activeSessionId === session.id ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-gray-400 hover:bg-white/5 border-transparent'
              }`}>
              <button onClick={() => loadSession(session.id)} className="flex items-center gap-2 text-sm flex-1 truncate">
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="truncate">{session.title}</span>
              </button>
              <button onClick={(e) => handleDeleteSession(e, session.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* زر احسب التقدير (أسفل القائمة) */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleCalculate} disabled={isLoading || !activeSessionId}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-primary-500 to-primary-600 text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-500/20 transition disabled:opacity-40">
            <Calculator size={18} /> احسب التقدير
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatPage;