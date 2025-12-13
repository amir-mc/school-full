'use client';

import Link from 'next/link';
import { ChevronLeft, Award, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ClassHeaderProps {
  classData: {
    id: string;
    name: string;
    grade: number;
    totalStudents: number;
    description?: string;
  };
  onAddGrade: () => void;
  onMessageParents: () => void;
}

export default function ClassHeader({ 
  classData, 
  onAddGrade, 
  onMessageParents 
}: ClassHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link href="/teacher/classes">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 ml-2" />
            بازگشت
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{classData.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary">پایه {classData.grade}</Badge>
            <Badge variant="outline">
              <span className="ml-1">{classData.totalStudents}</span>
              دانش‌آموز
            </Badge>
            {classData.description && (
              <p className="text-gray-600 text-sm">{classData.description}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAddGrade} size="sm">
          <Award className="h-4 w-4 ml-2" />
          ثبت نمره جدید
        </Button>
        <Button variant="outline" onClick={onMessageParents} size="sm">
          <Mail className="h-4 w-4 ml-2" />
          پیام به والدین
        </Button>
      </div>
    </div>
  );
}