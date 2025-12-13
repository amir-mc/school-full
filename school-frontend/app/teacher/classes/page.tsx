'use client';

import { useState, useEffect } from 'react';
import { teacherService } from '@/services/teacherService';
import { Skeleton } from '@/components/ui/skeleton';
import ClassStats from './components/ClassStats';
import ClassCard from './components/ClassCard';
import ClassFilters from './components/ClassFilters';
import EmptyState from './components/EmptyState';

interface Class {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
  scheduleCount: number;
  hasSchedule: boolean;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // آمار کلی
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    averageGrade: 0,
    teachingHours: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [classes, searchQuery, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // دریافت کلاس‌های معلم
      const classesData = await teacherService.getMyClasses();
      
      // دریافت آمار داشبورد برای اطلاعات تکمیلی
      const dashboardStats = await teacherService.getDashboardStats();
      
      setClasses(classesData);
      
      // محاسبه آمار از روی داده‌های واقعی
      const totalStudents = classesData.reduce((sum: number, cls: Class) => sum + cls.studentCount, 0);
      const teachingHours = classesData.reduce((sum: number, cls: Class) => sum + (cls.hasSchedule ? 3 : 0), 0);
      
      setStats({
        totalClasses: classesData.length,
        totalStudents,
        averageGrade: dashboardStats.averageGrade || 0,
        teachingHours
      });
      
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setError('خطا در بارگذاری کلاس‌ها');
      
      // در صورت خطا، داده‌های خالی تنظیم کن
      setClasses([]);
      setStats({
        totalClasses: 0,
        totalStudents: 0,
        averageGrade: 0,
        teachingHours: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...classes];

    // فیلتر جستجو
    if (searchQuery.trim()) {
      filtered = filtered.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فیلتر بر اساس پایه
    if (activeTab !== 'all') {
      if (activeTab === 'other') {
        filtered = filtered.filter(cls => cls.grade < 10 || cls.grade > 12);
      } else {
        const grade = parseInt(activeTab);
        filtered = filtered.filter(cls => cls.grade === grade);
      }
    }

    setFilteredClasses(filtered);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
  };

  if (error && classes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">کلاس‌های من</h1>
        <p className="text-gray-600">مدیریت و مشاهده کلاس‌های تحت تدریس</p>
      </div>

      {/* آمار کلی */}
      {!loading && <ClassStats {...stats} />}

      {/* فیلترها */}
      <ClassFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={fetchData}
      />

      {/* لیست کلاس‌ها */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">لیست کلاس‌ها</h2>
          <span className="text-sm text-gray-500">
            {filteredClasses.length} کلاس
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <EmptyState 
            searchQuery={searchQuery}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredClasses.map((cls) => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}