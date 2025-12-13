'use client';

import { BookOpen, Users, GraduationCap, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ClassStatsProps {
  totalClasses: number;
  totalStudents: number;
  averageGrade: number;
  teachingHours: number;
}

export default function ClassStats({ 
  totalClasses, 
  totalStudents, 
  averageGrade, 
  teachingHours 
}: ClassStatsProps) {
  const stats = [
    {
      title: 'کل کلاس‌ها',
      value: totalClasses,
      icon: <BookOpen className="h-5 w-5" />,
      color: 'blue' as const,
    },
    {
      title: 'کل دانش‌آموزان',
      value: totalStudents,
      icon: <Users className="h-5 w-5" />,
      color: 'green' as const,
    },
    {
      title: 'میانگین نمرات',
      value: averageGrade.toFixed(1),
      icon: <GraduationCap className="h-5 w-5" />,
      color: 'purple' as const,
      unit: '/20'
    },
    {
      title: 'ساعات تدریس',
      value: teachingHours,
      icon: <Clock className="h-5 w-5" />,
      color: 'orange' as const,
      unit: 'ساعت'
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.unit && <span className="text-sm text-gray-500">{stat.unit}</span>}
                </div>
              </div>
              <div className={`rounded-lg ${colorClasses[stat.color]} p-3`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}