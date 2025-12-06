// app/teacher/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, Calendar, Award, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { teacherService } from '@/services/teacherService';

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await teacherService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError('خطا در بارگذاری اطلاعات داشبورد');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          سلام، {stats?.teacherName || 'معلم'} 👋
        </h1>
        <p className="text-gray-600">آمار و اطلاعات تدریس شما</p>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="کلاس‌های فعال"
          value={stats?.activeClasses || 0}
          icon={<BookOpen className="h-5 w-5" />}
          description="کلاس‌های تحت تدریس"
          href="/teacher/classes"
        />
        <StatCard
          title="تعداد دانش‌آموزان"
          value={stats?.totalStudents || 0}
          icon={<Users className="h-5 w-5" />}
          description="دانش‌آموزان تحت آموزش"
          href="/teacher/classes"
        />
        <StatCard
          title="نمرات ثبت شده"
          value={stats?.totalGrades || 0}
          icon={<FileText className="h-5 w-5" />}
          description="در این ترم"
          href="/teacher/grades"
        />
        <StatCard
          title="میانگین نمرات"
          value={stats?.averageGrade?.toFixed(2) || '0.00'}
          icon={<Award className="h-5 w-5" />}
          description="میانگین کل"
          unit="/20"
        />
      </div>

      {/* نمرات اخیر */}
      {stats?.recentGrades && stats.recentGrades.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold">آخرین نمرات ثبت شده</h3>
            <div className="space-y-3">
              {stats.recentGrades.map((grade: any, index: number) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{grade.studentName}</p>
                    <p className="text-sm text-gray-600">{grade.subject}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                      grade.value >= 17 ? 'bg-green-100 text-green-800' :
                      grade.value >= 12 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade.value}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(grade.date).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* اقدامات سریع */}
      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">اقدامات سریع</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/teacher/grades">
              <Button className="w-full gap-2">
                <FileText className="h-4 w-4" />
                مدیریت نمرات
              </Button>
            </Link>
            <Link href="/teacher/classes">
              <Button variant="outline" className="w-full gap-2">
                <BookOpen className="h-4 w-4" />
                کلاس‌های من
              </Button>
            </Link>
            <Link href="/teacher/schedule">
              <Button variant="outline" className="w-full gap-2">
                <Calendar className="h-4 w-4" />
                برنامه هفتگی
              </Button>
            </Link>
            <Link href="/teacher/students">
              <Button variant="outline" className="w-full gap-2">
                <Users className="h-4 w-4" />
                دانش‌آموزان
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, description, href, unit }: any) {
  const content = (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold">{value}</p>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-64" />
      <Skeleton className="h-32" />
    </div>
  );
}