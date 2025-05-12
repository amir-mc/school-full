// src/components/dashboard/AdminDashboard.tsx
import Link from "next/link";
import { 
  Users,
  BookOpen,
  School,
  Calendar,
  ClipboardList,
  BarChart
} from "lucide-react"


export default function AdminDashboard() {
  return (

    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">داشبورد مدیریت</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="مدیریت کاربران"
          description="افزودن و مدیریت کاربران سیستم"
          href="/dashboard/users"
          icon={<Users className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="مدیریت کلاس‌ها"
          description="تعریف و مدیریت کلاس‌های درسی"
          href="/dashboard/classes"
          icon={<School className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="مدیریت دروس"
          description="تعریف و مدیریت دروس"
          href="/dashboard/courses"
          icon={<BookOpen className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="برنامه کلاسی"
          description="تنظیم برنامه هفتگی"
          href="/dashboard/schedule"
          icon={<Calendar className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="گزارشات حضور و غیاب"
          description="مشاهده گزارشات حضورغیاب"
          href="/dashboard/attendance"
          icon={<ClipboardList className="w-5 h-5" />}
        />
        
        <DashboardCard 
          title="آمار و گزارشات"
          description="گزارشات تحلیلی سیستم"
          href="/dashboard/reports"
          icon={<BarChart className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, href, icon }: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer h-full">
        <div className="flex items-center mb-2">
          <div className="p-2 bg-indigo-100 rounded-md mr-3">
            {icon}
          </div>
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}