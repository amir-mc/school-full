// src/components/dashboard/student/StudentDashboard.tsx
import { BookOpen, Calendar, Clock, Award } from 'lucide-react';
import DashboardCard from '../shared/DashboardCard';

export default function StudentDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">داشبورد دانش‌آموز</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="برنامه درسی"
          description="مشاهده برنامه هفتگی"
          href="/dashboard/schedule"
          icon={<Calendar className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="نمرات"
          description="مشاهده نمرات و کارنامه"
          href="/dashboard/grades"
          icon={<BookOpen className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="حضور و غیاب"
          description="مشاهده وضعیت حضور و غیاب"
          href="/dashboard/attendance"
          icon={<Clock className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="پیشرفت تحصیلی"
          description="مشاهده گزارشات تحلیلی"
          href="/dashboard/progress"
          icon={<Award className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}