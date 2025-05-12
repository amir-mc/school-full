// src/app/dashboard/report-card/page.tsx
'use client';

import GradeCard from '@/components/grades/GradeCard';
import { Grade } from '@/generated/prisma';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ReportCardPage() {
  const { data: session } = useSession();
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    if (session?.user.role === 'STUDENT') {
      fetchGrades();
    }
  }, [session]);

  const fetchGrades = async () => {
    const res = await fetch(`/api/students/${session?.user.id}/grades`);
    const data = await res.json();
    setGrades(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">کارنامه تحصیلی</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {grades.map(grade => (
          <GradeCard key={grade.id} grade={grade} />
        ))}
      </div>
    </div>
  );
}