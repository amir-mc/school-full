'use client';

import { Award, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  studentCode?: string; // اختیاری کن
  averageGrade: number;
}

interface Grade {
  id: string;
  studentName: string;
  subject: string;
  value: number;
  date: string;
}

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
}

interface OverviewTabProps {
  classId: string;
  topStudents: Student[];
  schedule: Schedule[];
  recentGrades: Grade[];
}

export default function OverviewTab({ classId, topStudents, schedule, recentGrades }: OverviewTabProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'ب.ظ' : 'ق.ظ';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 17) return 'bg-green-100 text-green-800';
    if (grade >= 14) return 'bg-blue-100 text-blue-800';
    if (grade >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* دانش‌آموزان برتر */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            دانش‌آموزان برتر
          </CardTitle>
          <CardDescription>برترین دانش‌آموزان کلاس بر اساس میانگین نمرات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    {student.studentCode && (
                      <p className="text-sm text-gray-500">{student.studentCode}</p>
                    )}
                  </div>
                </div>
                <Badge className={getGradeColor(student.averageGrade)}>
                  {student.averageGrade.toFixed(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* برنامه هفتگی */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            برنامه هفتگی
          </CardTitle>
          <CardDescription>زمان‌بندی کلاس</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((session, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">{session.day}</Badge>
                  <div className="text-sm text-gray-600">
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </div>
                </div>
                <p className="font-medium">{session.subject}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* آخرین نمرات */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            آخرین نمرات ثبت شده
          </CardTitle>
          <CardDescription>تاریخچه نمرات اخیر کلاس</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">دانش‌آموز</th>
                  <th className="text-right py-3 px-4">درس</th>
                  <th className="text-right py-3 px-4">نمره</th>
                  <th className="text-right py-3 px-4">تاریخ</th>
                  <th className="text-right py-3 px-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {recentGrades.map((grade) => (
                  <tr key={grade.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{grade.studentName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{grade.subject}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getGradeColor(grade.value)}>
                        {grade.value}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(grade.date).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/teacher/classes/${classId}/grades/${grade.id}`}>
                        <Button variant="ghost" size="sm">
                          جزئیات
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}