// src/app/parent-portal/dashboard/components/GradesOverview.tsx
'use client';

import { Grade } from "@/types";
import { useEffect, useState } from "react";

interface GradesOverviewProps {
  studentId: number;
}

export default function GradesOverview({ studentId }: GradesOverviewProps) {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    fetch(`/api/grades?studentId=${studentId}`)
      .then(res => res.json())
      .then(setGrades);
  }, [studentId]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="font-bold mb-3">نمرات اخیر</h3>
      <ul className="space-y-2">
        {grades.slice(0, 5).map(grade => (
          <li key={grade.id} className="flex justify-between">
            <span>{grade.course.name}</span>
            <span className={`font-bold ${
              grade.value >= 10 ? 'text-green-600' : 'text-red-600'
            }`}>
              {grade.value.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}