// services/adminService.ts
import api from '../lib/api';

export const getTotalUsers = (token: string) => 
  api.get('/admin/users/count/all', { 
    headers: { Authorization: `Bearer ${token}` } 
  });

export const getStudentCount = (token: string) => 
  api.get('/admin/users/count/students', { 
    headers: { Authorization: `Bearer ${token}` } 
  });

export const getTeacherCount = (token: string) => 
  api.get('/admin/users/count/teachers', { 
    headers: { Authorization: `Bearer ${token}` } 
  });

export const getClassCount = (token: string) => 
  api.get('/admin/classes/count', { 
    headers: { Authorization: `Bearer ${token}` } 
  });