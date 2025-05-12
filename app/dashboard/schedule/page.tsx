// src/app/dashboard/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { CalendarDays } from 'lucide-react';

// تعریف انواع TypeScript با فیلد id
interface ScheduleItem {
  id: string; // اضافه کردن فیلد id
  day: string;
  time: string;
  courseName: string;
  teacherName: string;
  className?: string;
}

interface ExtendedUser {
  id: string;
  role: string;
  userId: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const daysOfWeek = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه'] as const;

export default function SchedulePage() {
  const { data: session } = useSession();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // بررسی وجود session در ابتدا
  if (!session) {
    redirect('/login');
  }

  useEffect(() => {
    fetchSchedule();
  }, [session]);

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const url = (session.user as ExtendedUser).role === 'TEACHER' 
        ? `/api/schedule?teacherId=${(session.user as ExtendedUser).userId}`
        : '/api/schedule';
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('خطا در دریافت برنامه هفتگی');
      }
      
      const data = await res.json();
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = (courseId: string) => {
    // منطق ویرایش دوره
    console.log('ویرایش دوره با ID:', courseId);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <CalendarDays className="w-6 h-6 mr-2" />
          برنامه هفتگی
        </h1>
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
                <th className="py-2 px-4 border-b">ساعت</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="py-2 px-4 border-b text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['8-10', '10-12', '12-14', '14-16'].map((time) => (
                <tr key={time} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">{time}</td>
                  {daysOfWeek.map((day) => {
                    const course = schedule.find(
                      (item) => item.day === day && item.time === time
                    );
                    return (
                      <td key={`${day}-${time}`} className="py-2 px-4 border-b text-center">
                        {course ? (
                          <div className="p-2 bg-blue-50 rounded-md">
                            <div className="font-medium">{course.courseName}</div>
                            <div className="text-sm text-gray-600">
                              {course.teacherName}
                            </div>
                            {(session.user as ExtendedUser).role === 'STUDENT' && course.className && (
                              <div className="text-xs mt-1">{course.className}</div>
                            )}
                            {(session.user as ExtendedUser).role === 'TEACHER' && (
                              <button 
                                onClick={() => handleEditCourse(course.id)}
                                className="text-xs text-blue-600 mt-1 hover:text-blue-800 underline hover:no-underline"
                              >
                                ویرایش
                              </button>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}