import { create } from 'zustand';
import api from '../api/axios';

interface Message {
  id: number;
  role: 'user' | 'bot';
  content: string;
}

interface Session {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface ChatState {
  sessions: Session[];
  activeSessionId: number | null;
  messages: Message[];
  isLoading: boolean;
  fetchSessions: () => Promise<void>;
  loadSession: (sessionId: number) => Promise<void>;
  startNewSession: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  isLoading: false,

  // جلب قائمة المحادثات
  fetchSessions: async () => {
    try {
      const response = await api.get('/chat/sessions');
      const sessions = response.data.sessions;
      set({ sessions });
      
      // إذا كانت هناك محادثات، افتح آخر محادثة تلقائياً
      if (sessions.length > 0 && !get().activeSessionId) {
        await get().loadSession(sessions[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  },

  // تحميل رسائل محادثة قديمة
  loadSession: async (sessionId) => {
    try {
      set({ activeSessionId: sessionId, isLoading: true });
      const response = await api.get(`/chat/sessions/${sessionId}`);
      
      const formattedMessages = response.data.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content
      }));

      set({ messages: formattedMessages, isLoading: false });
    } catch (error) {
      console.error('Failed to load session:', error);
      set({ isLoading: false });
    }
  },

  // بدء محادثة جديدة
  startNewSession: async () => {
    set({ isLoading: true, messages: [] });
    try {
      const response = await api.post('/chat/start');
      const { session, bot_message } = response.data;
      
      set((state) => ({
        activeSessionId: session.id,
        messages: [{ id: Date.now(), role: 'bot', content: bot_message.content }],
        // الحل: تحويل التاريخ إلى نص
        sessions: [{ id: session.id, title: 'محادثة جديدة', status: 'active', created_at: new Date().toISOString() }, ...state.sessions]
      }));
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // إرسال رسالة
  sendMessage: async (content) => {
    const { activeSessionId } = get();
    if (!activeSessionId) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content };
    set((state) => ({ messages: [...state.messages, userMessage], isLoading: true }));

    try {
      const response = await api.post('/chat/send', {
        session_id: activeSessionId,
        message: content
      });

      const botMessageData = response.data.bot_message;
      const updatedSession = response.data.session; // استلام بيانات الجلسة المحدثة
      
      const botMessage: Message = { id: Date.now() + 1, role: 'bot', content: botMessageData.content };
      
      set((state) => ({ 
        messages: [...state.messages, botMessage],
        // تحديث اسم المحادثة في القائمة إذا تغير في الباك إند
        sessions: state.sessions.map(s => s.id === activeSessionId && updatedSession ? { ...s, title: updatedSession.title } : s)
      }));

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        get().startNewSession(); 
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));