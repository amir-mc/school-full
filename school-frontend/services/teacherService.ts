// services/teacherService.ts

import api from "@/lib/api";


export const teacherService = {
  async getDashboardStats() {
    const response = await api.get('/teacher/dashboard/stats');
    return response.data;
  },

  async getMyClasses() {
    const response = await api.get('/teacher/classes');
    return response.data;
  },

  async getClassStudents(classId: string) {
    const response = await api.get(`/teacher/classes/${classId}/students`);
    return response.data;
  },

  async getMyGrades() {
    const response = await api.get('/teacher/grades');
    return response.data;
  },

  async getMySchedule() {
    const response = await api.get('/teacher/schedule');
    return response.data;
  },

  async submitGrade(gradeData: any) {
    const response = await api.post('/teacher/grades', gradeData);
    return response.data;
  },

  async updateGrade(gradeId: string, gradeData: any) {
    const response = await api.put(`/teacher/grades/${gradeId}`, gradeData);
    return response.data;
  },

  async deleteGrade(gradeId: string) {
    const response = await api.delete(`/teacher/grades/${gradeId}`);
    return response.data;
  },

  async getMessages() {
    const response = await api.get('/teacher/messages');
    return response.data;
  },

  async sendMessage(messageData: any) {
    const response = await api.post('/teacher/messages', messageData);
    return response.data;
  }
};