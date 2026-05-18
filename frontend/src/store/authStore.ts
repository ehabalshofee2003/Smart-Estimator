import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null; // أضفنا هذا
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          // لا حاجة لـ csrf-cookie بعد الآن
          const response = await api.post('/login', { email, password });
          set({ 
            user: response.data.user, 
            token: response.data.token, // حفظ التوكن
            isAuthenticated: true 
          });
        } catch (error) {
          throw error;
        }
      },

      register: async (name, email, password) => {
        try {
          const response = await api.post('/register', { 
            name, email, password, password_confirmation: password 
          });
          set({ 
            user: response.data.user, 
            token: response.data.token, // حفظ التوكن
            isAuthenticated: true 
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        api.post('/logout').catch(() => {});
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, // حفظ التوكن في الذاكرة المحلية
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);