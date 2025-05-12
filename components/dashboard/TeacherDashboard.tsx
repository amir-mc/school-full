// src/components/dashboard/teacher/TeacherDashboard.tsx
import { BookOpen, Calendar, ClipboardList, BarChart } from 'lucide-react';
import DashboardCard from '../shared/DashboardCard';

export default function TeacherDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">داشبورد معلم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="لیست دروس"
          description="مدیریت دروس تدریسی"
          href="/dashboard/courses"
          icon={<BookOpen className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="برنامه هفتگی"
          description="مشاهده برنامه کلاسی"
          href="/dashboard/schedule"
          icon={<Calendar className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="حضور و غیاب"
          description="ثبت حضور و غیاب دانش‌آموزان"
          href="/dashboard/attendance"
          icon={<ClipboardList className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="ثبت نمرات"
          description="ثبت و مدیریت نمرات دانش‌آموزان"
          href="/dashboard/grades"
          icon={<BarChart className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}