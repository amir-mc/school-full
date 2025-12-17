'use client';

import { User, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  username: string;
  gradeCount: number;
  lastGrades: Array<{
    subject: string;
    value: number;
    date: string;
  }>;
}

interface StudentsTabProps {
  classId: string;
  students: Student[];
}

export default function StudentsTab({ classId, students }: StudentsTabProps) {
  const getGradeColor = (grade: number) => {
    if (grade >= 17) return 'bg-green-100 text-green-800';
    if (grade >= 14) return 'bg-blue-100 text-yellow-800';
    if (grade >= 10) return 'bg-yellow-100 text-red-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>لیست دانش‌آموزان کلاس</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4">ردیف</th>
                <th className="text-right py-3 px-4">نام دانش‌آموز</th>
                <th className="text-right py-3 px-4">نام کاربری</th>
                <th className="text-right py-3 px-4">تعداد نمرات</th>
                <th className="text-right py-3 px-4">آخرین نمره</th>
                <th className="text-right py-3 px-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const lastGrade = student.lastGrades[0];
                
                return (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{student.username}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{student.gradeCount} نمره</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {lastGrade ? (
                        <div className="flex items-center gap-2">
                          <Badge className={getGradeColor(lastGrade.value)}>
                            {lastGrade.value}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            ({lastGrade.subject})
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/teacher/classes/${classId}/add-grade?studentId=${student.id}`}>
                          <Button size="sm">ثبت نمره</Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 ml-2" />
                          پیام
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}