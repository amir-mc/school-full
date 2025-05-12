// src/app/dashboard/reports/page.tsx
'use client';

import AttendanceTrendChart from "@/components/reports/AttendanceTrendChart";
import GradeDistributionChart from "@/components/reports/GradeDistributionChart";
import StatCard from "@/components/shared/StatCard";
import { SchoolStats } from "@/types";
import { BookIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [stats, setStats] = useState<SchoolStats>();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await fetch('/api/reports/stats');
    const data = await res.json();
    setStats(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">گزارشات و آمار</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="تعداد دانش‌آموزان"
          value={stats?.totalStudents}
          icon={<UsersIcon />}
        />
        <StatCard 
          title="میانگین نمرات"
          value={stats?.averageGrade}
          icon={<BookIcon />}
        />
        <StatCard 
          title="نرخ حضور"
          value={`${stats?.attendanceRate}%`}
          icon={<CalendarIcon />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GradeDistributionChart data={stats?.gradeDistribution} />
        <AttendanceTrendChart data={stats?.attendanceTrend} />
      </div>
    </div>
  );
}