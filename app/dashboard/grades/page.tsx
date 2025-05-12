// src/app/dashboard/grades/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {  GradeType, Student } from '@/types';
import GradeRow from '@/components/grades/GradeRow';


export default function GradeEntryPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [gradeType, setGradeType] = useState<GradeType>('QUIZ');

  useEffect(() => {
    if (session?.user.role === 'TEACHER') {
      fetchStudents();
    }
  }, [session, selectedCourse]);

  const fetchStudents = async () => {
    const res = await fetch(`/api/courses/${selectedCourse}/students`);
    const data = await res.json();
    setStudents(data);
  };

  const handleGradeSubmit = async (studentId: string, gradeValue: number) => {
    await fetch('/api/grades', {
      method: 'POST',
      body: JSON.stringify({
        studentId,
        courseId: selectedCourse,
        value: gradeValue,
        type: gradeType
      })
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ثبت نمرات</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* انتخاب درس و نوع نمره */}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th>نام دانش‌آموز</th>
              <th>نمره</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <GradeRow 
                key={student.id}
                student={student}
                onSubmit={handleGradeSubmit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}