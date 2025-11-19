// hooks/useAdminStats.ts
import { useState, useEffect } from 'react';
import { 
  getTotalUsers, 
  getStudentCount, 
  getTeacherCount, 
  getParentCount,
  getClassCount 
} from '@/services/adminService';

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalClasses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Fetching admin stats...');
        
        const [
          usersRes, 
          studentsRes, 
          teachersRes, 
          parentsRes, 
          classesRes
        ] = await Promise.all([
          getTotalUsers(),
          getStudentCount(),
          getTeacherCount(),
          getParentCount(),
          getClassCount(),
        ]);

        console.log('✅ Stats fetched successfully');

        setStats({
          totalUsers: usersRes.data?.count || usersRes.data || 0,
          totalStudents: studentsRes.data?.count || studentsRes.data || 0,
          totalTeachers: teachersRes.data?.count || teachersRes.data || 0,
          totalParents: parentsRes.data?.count || parentsRes.data || 0,
          totalClasses: classesRes.data?.count || classesRes.data || 0,
        });

      } catch (err: any) {
        console.error('❌ Error in useAdminStats:', err);
        setError(err.message || 'خطا در دریافت آمار');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => window.location.reload() };
};