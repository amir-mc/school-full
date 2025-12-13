//teacher/classes/components/ClassCard.tsx
'use client';

import Link from 'next/link';
import { BookOpen, Users, Calendar, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ClassCardProps {
  cls: {
    id: string;
    name: string;
    grade: number;
    studentCount: number;
    hasSchedule: boolean;
  };
}

export default function ClassCard({ cls }: ClassCardProps) {
  const getGradeBadgeVariant = (grade: number) => {
    if (grade <= 9) return 'default';
    if (grade <= 11) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {cls.name}
            </CardTitle>
            <CardDescription className="mt-2">
              <Badge variant={getGradeBadgeVariant(cls.grade)}>
                پایه {cls.grade}
              </Badge>
              <span className="mr-2"></span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Users className="h-3 w-3 ml-1" />
                {cls.studentCount} دانش‌آموز
              </Badge>
              {cls.hasSchedule && (
                <>
                  <span className="mr-2"></span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <Calendar className="h-3 w-3 ml-1" />
                    دارای برنامه
                  </Badge>
                </>
              )}
            </CardDescription>
          </div>
          <Link href={`/teacher/classes/${cls.id}`}>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          برای مشاهده جزئیات، دانش‌آموزان و ثبت نمرات روی دکمه‌های زیر کلیک کنید.
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex gap-2 w-full">
          <Link href={`/teacher/classes/${cls.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              جزئیات
            </Button>
          </Link>
          <Link href={`/teacher/classes/${cls.id}/students`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 ml-2" />
              دانش‌آموزان
            </Button>
          </Link>
          <Link href={`/teacher/classes/${cls.id}/add-grade`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Award className="h-4 w-4 ml-2" />
              ثبت نمره
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}