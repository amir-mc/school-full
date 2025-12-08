// services/authService.ts
import api from '@/lib/api';

export const authService = {
  async login(credentials: { username: string; password: string }) { // حذف role
    try {
      console.log('🔐 Sending login request:', credentials);
      
      const response = await api.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });

      console.log('✅ Login response:', response.data);

      return {
        token: response.data.access_token,
        userId: response.data.userId,
        username: response.data.username,
        role: response.data.role, // نقش از بک‌اند دریافت می‌شود
        name: response.data.name,
        parentId: response.data.parentId
      };
    } catch (error: any) {
      console.error('❌ Login service error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      // پاک کردن توکن از localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // اگر endpoint logout داریم، call کنیم
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // دریافت اطلاعات کاربر از localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }

      // یا از API بگیر
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }
};