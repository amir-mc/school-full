// services/adminService.ts
import api from '@/lib/api';

export const getTotalUsers = () => 
  api.get('/admin/users/count/all');

export const getStudentCount = () => 
  api.get('/admin/users/count/students');

export const getTeacherCount = () => 
  api.get('/admin/users/count/teachers');

export const getParentCount = () => 
  api.get('/admin/users/count/parents');

export const getClassCount = () => 
  api.get('/admin/classes/count');

export const getClasses = () =>
  api.get('/admin/classes');



export const createUser = (userData: any) =>
  api.post('/admin/users', userData);

export const deleteUser = (userId: string) =>
  api.delete(`/admin/users/${userId}`);

export const updateUser = (userId: string, userData: any) =>
  api.patch(`/admin/users/${userId}`, userData);

export const getUserById = (userId: string) =>
  api.get(`/admin/users/${userId}`);

export const confirmUser = (userId: string, classId?: string) => {
  const payload = classId ? { classId } : {};
  return api.post(`/admin/users/confirm/${userId}`, payload);
};

export const updateUserConfirmation = (userId: string, isConfirmed: boolean) =>
  api.patch(`/admin/users/${userId}`, { isConfirmed });


export const getUsers = (params?: { 
  query?: string; 
  role?: string; 
  classId?: string;
  isConfirmed?: boolean;
}) =>
  api.get('/admin/users', { 
    params: {
      ...params,
      includeStudentDetails: true // اضافه کردن این پارامتر
    }
  });