// services/teacherService.ts

import api from "@/lib/api";


export const teacherService = {
  // آمار داشبورد
  async getDashboardStats() {
    const response = await api.get('/teacher/dashboard/stats');
    return response.data;
  },

  // کلاس‌های معلم
  async getMyClasses() {
    const response = await api.get('/teacher/classes');
    return response.data;
  },

  // دانش‌آموزان یک کلاس خاص
  async getClassStudents(classId: string) {
    const response = await api.get(`/teacher/classes/${classId}/students`);
    return response.data;
  },

  // نمرات معلم
  async getMyGrades() {
    const response = await api.get('/teacher/grades');
    return response.data;
  },

  // برنامه درسی
  async getMySchedule() {
    const response = await api.get('/teacher/schedule');
    return response.data;
  },

  // ثبت نمره جدید (بعداً پیاده‌سازی می‌شود)
  async submitGrade(gradeData: any) {
    // بعداً پیاده‌سازی می‌شود
    throw new Error('Not implemented yet');
  },

  // ارسال پیام (بعداً پیاده‌سازی می‌شود)
  async sendMessage(messageData: any) {
    // بعداً پیاده‌سازی می‌شود
    throw new Error('Not implemented yet');
  }
};