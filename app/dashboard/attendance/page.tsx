// src/app/dashboard/attendance/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

// تعریف نوع برای دانش‌آموز
interface Student {
  id: string;
  fullName: string;
  className: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LATE';
}

export default function AttendancePage() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // بررسی وجود session و نقش کاربر
    if (!session?.user?.role || !['TEACHER', 'SUPER_ADMIN'].includes(session.user.role)) {
      redirect('/unauthorized');
    }
    fetchAttendanceData();
  }, [selectedDate, session]);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await fetch(`/api/attendance?date=${dateStr}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendanceChange = async (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          date: selectedDate.toISOString().split('T')[0],
          status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }

      fetchAttendanceData();
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  // اگر session وجود ندارد یا در حال بارگذاری است
  if (!session) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          سیستم حضور و غیاب
        </h1>
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
                if (date) {
                setSelectedDate(date);
                     }
                     }}
            dateFormat="yyyy/MM/dd"
            className="border rounded-md p-2"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ردیف</th>
                <th className="py-2 px-4 border-b">نام دانش‌آموز</th>
                <th className="py-2 px-4 border-b">کلاس</th>
                <th className="py-2 px-4 border-b">وضعیت</th>
                <th className="py-2 px-4 border-b">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-center">{student.fullName}</td>
                  <td className="py-2 px-4 border-b text-center">{student.className}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.attendanceStatus === 'PRESENT' ? 'bg-green-100 text-green-800' :
                      student.attendanceStatus === 'ABSENT' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.attendanceStatus === 'PRESENT' ? 'حاضر' :
                       student.attendanceStatus === 'ABSENT' ? 'غایب' : 'تأخیر'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'PRESENT')}
                        className={`p-1 rounded-md ${student.attendanceStatus === 'PRESENT' ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                        aria-label="علامت حضور"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'ABSENT')}
                        className={`p-1 rounded-md ${student.attendanceStatus === 'ABSENT' ? 'bg-red-100' : 'hover:bg-gray-100'}`}
                        aria-label="علامت غیبت"
                      >
                        <XCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}