// src/components/dashboard/parent/ParentDashboard.tsx
import { User, Book, Clock, Activity } from 'lucide-react';
import DashboardCard from '../shared/DashboardCard';

export default function ParentDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">داشبورد والدین</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="اطلاعات فرزندان"
          description="مشاهده اطلاعات دانش‌آموزان"
          href="/dashboard/children"
          icon={<User className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="کارنامه تحصیلی"
          description="مشاهده نمرات و عملکرد تحصیلی"
          href="/dashboard/report-cards"
          icon={<Book className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="حضور و غیاب"
          description="مشاهده وضعیت حضور و غیاب"
          href="/dashboard/attendance"
          icon={<Clock className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="گزارشات"
          description="گزارشات تحلیلی عملکرد"
          href="/dashboard/reports"
          icon={<Activity className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}