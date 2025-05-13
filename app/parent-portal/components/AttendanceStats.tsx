// src/app/parent-portal/dashboard/components/AttendanceStats.tsx
'use client';

import { useEffect, useState } from "react";

interface AttendanceStatsProps {
  studentId: number;
}

export default function AttendanceStats({ studentId }: AttendanceStatsProps) {
  const [stats, setStats] = useState<{
    present: number;
    absent: number;
    late: number;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/attendance/stats?studentId=${studentId}`)
      .then(res => res.json())
      .then(setStats);
  }, [studentId]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="font-bold mb-3">وضعیت حضور</h3>
      {stats ? (
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>حاضر: {stats.present} روز</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>غایب: {stats.absent} روز</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>تأخیر: {stats.late} روز</span>
          </div>
        </div>
      ) : (
        <p>در حال بارگذاری...</p>
      )}
    </div>
  );
}