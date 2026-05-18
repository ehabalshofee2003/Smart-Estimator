import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// الوسيط السحري: يضيف الـ Token لكل طلب يخرج من التطبيق
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // إذا انتهت صلاحية التوكن، نقوم بتسجيل الخروج
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;