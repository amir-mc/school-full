// services/teacherService.ts
import api from '@/lib/api';

export const teacherService = {
  async getDashboardStats() {
    try {
      const response = await api.get('/teacher/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getMyClasses() {
    try {
      const response = await api.get('/teacher/classes');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching teacher classes:', error);
      
      // اگر خطای 404 بود، آرایه خالی برگردان
      if (error.response?.status === 404) {
        return [];
      }
      
      throw error;
    }
  },

  async getClassDetails(classId: string) {
    try {
      const response = await api.get(`/teacher/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class details:', error);
      throw error;
    }
  },

  async getClassStudents(classId: string) {
    try {
      const response = await api.get(`/teacher/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class students:', error);
      throw error;
    }
  },

 async getClassGrades(classId: string) {
    try {
      // از endpoint کلی نمرات استفاده می‌کنیم و روی کلاینت فیلتر می‌کنیم
      const allGrades = await this.getMyGrades();
      
      // فیلتر نمرات بر اساس classId
      // نیاز به اطلاعات اضافی از student داریم
      const students = await this.getClassStudents(classId);
      const studentIds = students.map((s: any) => s.id);
      
      // فرض می‌کنیم هر grade دارای studentId است
      const classGrades = allGrades.filter((grade: any) => 
        studentIds.includes(grade.studentId)
      );
      
      return classGrades;
    } catch (error) {
      console.error('Error fetching class grades:', error);
      // در صورت خطا، آرایه خالی برگردان
      return [];
    }
  },
  async getMyGrades() {
    try {
      const response = await api.get('/teacher/grades');
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher grades:', error);
      return [];
    }
  },

  async createGrade(gradeData: any) {
    try {
      const response = await api.post('/teacher/grades', gradeData);
      return response.data;
    } catch (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
  },

  async updateGrade(gradeId: string, gradeData: any) {
    try {
      const response = await api.put(`/teacher/grades/${gradeId}`, gradeData);
      return response.data;
    } catch (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
  },

  async deleteGrade(gradeId: string) {
    try {
      const response = await api.delete(`/teacher/grades/${gradeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting grade:', error);
      throw error;
    }
  },

  async getMySchedule() {
    try {
      const response = await api.get('/teacher/schedule');
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  async getMessages() {
    try {
      const response = await api.get('/teacher/messages');
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async sendMessage(messageData: any) {
    try {
      const response = await api.post('/teacher/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};