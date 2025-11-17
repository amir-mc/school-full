// hooks/useAdminStats.ts
import { useState, useEffect } from 'react';
import { getTotalUsers, getStudentCount, getTeacherCount, getClassCount } from '@/services/adminService';

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [usersRes, studentsRes, teachersRes, classesRes] = await Promise.all([
          getTotalUsers(token),
          getStudentCount(token),
          getTeacherCount(token),
          getClassCount(token),
        ]);

        setStats({
          totalUsers: usersRes.data.count || usersRes.data,
          totalStudents: studentsRes.data.count || studentsRes.data,
          totalTeachers: teachersRes.data.count || teachersRes.data,
          totalClasses: classesRes.data.count || classesRes.data,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت آمار');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};