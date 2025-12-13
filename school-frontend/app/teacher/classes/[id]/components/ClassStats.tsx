'use client';

import { BarChart3, Users, FileText, Bell, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ClassStatsProps {
  averageClassGrade: number;
  totalStudents: number;
  totalGrades: number;
  upcomingSchedule?: {
    day: string;
    time: string;
    subject: string;
  };
}

export default function ClassStats({ 
  averageClassGrade, 
  totalStudents, 
  totalGrades, 
  upcomingSchedule 
}: ClassStatsProps) {
  const stats = [
    {
      title: 'میانگین نمرات کلاس',
      value: averageClassGrade.toFixed(1),
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'blue' as const,
      progress: (averageClassGrade / 20) * 100,
      unit: '/20'
    },
    {
      title: 'دانش‌آموزان',
      value: totalStudents,
      icon: <Users className="h-5 w-5" />,
      color: 'green' as const,
      description: 'همه حضوری'
    },
    {
      title: 'نمرات ثبت شده',
      value: totalGrades,
      icon: <FileText className="h-5 w-5" />,
      color: 'purple' as const,
      description: 'در این ماه'
    },
    {
      title: 'کلاس بعدی',
      value: upcomingSchedule?.subject || 'ندارد',
      icon: upcomingSchedule ? <Bell className="h-5 w-5" /> : <Clock className="h-5 w-5" />,
      color: 'orange' as const,
      description: upcomingSchedule ? `${upcomingSchedule.day} - ${upcomingSchedule.time}` : 'برنامه‌ای وجود ندارد'
    },
  ];

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.unit && <span className="text-sm text-gray-500">{stat.unit}</span>}
                </div>
                {stat.description && (
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                )}
                {stat.progress !== undefined && (
                  <Progress value={stat.progress} className="mt-2 h-2" />
                )}
              </div>
              <div className={`rounded-lg ${bgColorClasses[stat.color]} p-3`}>
                <div className={colorClasses[stat.color]}>{stat.icon}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}