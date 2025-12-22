'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { teacherService } from '@/services/teacherService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ClassHeader from './components/ClassHeader';
import ClassStats from './components/ClassStats';
import ClassTabs from './components/ClassTabs';
import OverviewTab from './components/OverviewTab';
import StudentsTab from './components/StudentsTab';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Student {
  id: string;
  name: string;
  username: string;
  studentCode: string;
  gradeCount: number;
  lastGrades: Array<{
    subject: string;
    value: number;
    date: string;
  }>;
  averageGrade: number;
}

interface Grade {
  id: string;
  studentId: string;
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

interface ClassDetails {
  id: string;
  name: string;
  grade: number;
  totalStudents: number;
  averageClassGrade: number;
  totalGrades: number;
  students: Student[];
  topStudents: Student[];
  recentGrades: Grade[];
  schedule: Schedule[];
  upcomingSchedule?: {
    day: string;
    time: string;
    subject: string;
  };
}

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
 
  useEffect(() => {
    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. دریافت اطلاعات پایه کلاس
      const classes = await teacherService.getMyClasses();
      const currentClass = classes.find((cls: any) => cls.id === classId);
      
      if (!currentClass) {
        throw new Error('کلاس مورد نظر یافت نشد یا دسترسی ندارید');
      }

      // 2. دریافت دانش‌آموزان کلاس
      const rawStudents = await teacherService.getClassStudents(classId);
      
      // 3. دریافت همه نمرات معلم و فیلتر کردن
      const allGrades = await teacherService.getMyGrades();
      const classGrades: Grade[] = allGrades
        .filter((grade: any) => 
          rawStudents.some((student: any) => student.id === grade.studentId)
        )
        .map((grade: any) => ({
          id: grade.id,
          studentId: grade.studentId,
          studentName: grade.studentName || 
                       rawStudents.find((s: any) => s.id === grade.studentId)?.name || 
                       'نامشخص',
          subject: grade.subject,
          value: grade.value,
          date: grade.createdAt || grade.date || new Date().toISOString()
        }));
      
      // 4. دریافت برنامه کلاس
      const schedule = await getClassSchedule(classId);

      // تبدیل rawStudents به Student[] با تمام فیلدهای مورد نیاز
      const students: Student[] = rawStudents.map((rawStudent: any) => {
        const studentGrades = classGrades.filter(grade => grade.studentId === rawStudent.id);
        
        // محاسبه میانگین نمرات دانش‌آموز
        const averageGrade = studentGrades.length > 0
          ? parseFloat((studentGrades.reduce((sum, grade) => sum + grade.value, 0) / studentGrades.length).toFixed(1))
          : 0;

        return {
          id: rawStudent.id,
          name: rawStudent.name || rawStudent.fullName || 'بدون نام',
          username: rawStudent.username || rawStudent.email?.split('@')[0] || `user_${rawStudent.id}`,
          studentCode: rawStudent.studentCode || rawStudent.code || rawStudent.id.slice(0, 8),
          gradeCount: studentGrades.length,
          lastGrades: studentGrades
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
            .map(grade => ({
              subject: grade.subject,
              value: grade.value,
              date: grade.date
            })),
          averageGrade
        };
      });

      // محاسبه میانگین کل کلاس
      const averageClassGrade = classGrades.length > 0
        ? parseFloat((classGrades.reduce((sum, grade) => sum + grade.value, 0) / classGrades.length).toFixed(1))
        : 0;

      // انتخاب دانش‌آموزان برتر (بر اساس میانگین نمره)
      const topStudents = [...students]
        .sort((a, b) => b.averageGrade - a.averageGrade)
        .slice(0, 3);

      // دریافت نمرات اخیر
      const recentGrades = getRecentGrades(classGrades);
      
      // دریافت برنامه آتی
      const upcomingSchedule = getUpcomingSchedule(schedule);

      // ساخت آبجکت کامل
      const classDetailsData: ClassDetails = {
        id: classId,
        name: currentClass.name,
        grade: currentClass.grade || 0,
        totalStudents: students.length,
        averageClassGrade,
        totalGrades: classGrades.length,
        students,
        topStudents,
        recentGrades,
        schedule,
        upcomingSchedule
      };

      setClassDetails(classDetailsData);
      
    } catch (err: any) {
      console.error('Error fetching class details:', err);
      setError(err.message || 'خطا در بارگذاری جزئیات کلاس');
    } finally {
      setLoading(false);
    }
  };

  // تابع کمکی: دریافت نمرات اخیر
  const getRecentGrades = (grades: Grade[]): Grade[] => {
    return [...grades]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  // تابع کمکی: دریافت برنامه کلاس
  const getClassSchedule = async (classId: string): Promise<Schedule[]> => {
    try {
      const allSchedule = await teacherService.getMySchedule();
      const classSchedule = allSchedule.flatMap((daySchedule: any) => 
        daySchedule.schedules.filter((schedule: any) => 
          schedule.classId === classId || schedule.className?.includes(classId)
        ).map((schedule: any) => ({
          day: daySchedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          subject: schedule.subject
        }))
      );
      return classSchedule;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return [];
    }
  };

  // تابع کمکی: دریافت کلاس بعدی
  const getUpcomingSchedule = (schedule: Schedule[]): { day: string; time: string; subject: string } | undefined => {
    if (schedule.length === 0) return undefined;
    
    const daysOrder = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    const today = new Date().toLocaleDateString('fa-IR', { weekday: 'long' });
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // مرتب کردن برنامه‌ها بر اساس روز و زمان
    const sortedSchedule = [...schedule].sort((a, b) => {
      const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      
      const [aHour, aMinute] = a.startTime.split(':').map(Number);
      const [bHour, bMinute] = b.startTime.split(':').map(Number);
      return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
    });

    // یافتن اولین کلاس بعدی
    for (const session of sortedSchedule) {
      const [startHour, startMinute] = session.startTime.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      
      const dayIndex = daysOrder.indexOf(session.day);
      const todayIndex = daysOrder.indexOf(today);
      
      if (dayIndex > todayIndex || (dayIndex === todayIndex && startTimeInMinutes > currentTime)) {
        return {
          day: session.day,
          time: `${session.startTime} - ${session.endTime}`,
          subject: session.subject
        };
      }
    }

    // اگر هیچ کلاسی برای آینده نزدیک نبود، اولین کلاس هفته آینده
    return {
      day: sortedSchedule[0]?.day || 'نامشخص',
      time: sortedSchedule[0] ? `${sortedSchedule[0].startTime} - ${sortedSchedule[0].endTime}` : '--',
      subject: sortedSchedule[0]?.subject || 'نامشخص'
    };
  };

  const handleAddGrade = () => {
    router.push(`/teacher/classes/${classId}/add-grade`);
  };

  const handleMessageParents = () => {
    alert('ویژگی ارسال پیام به والدین به زودی اضافه خواهد شد');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error || 'کلاس مورد نظر یافت نشد'}</AlertDescription>
          </Alert>
          <Button onClick={fetchClassDetails}>تلاش مجدد</Button>
        </div>
      </div>
    );
  }

  // تعریف تب‌ها
  const tabs = [
    {
      value: 'overview',
      label: 'نمای کلی',
      content: (
        <OverviewTab
          classId={classId}
          topStudents={classDetails.topStudents}
          schedule={classDetails.schedule}
          recentGrades={classDetails.recentGrades}
        />
      )
    },
    {
      value: 'students',
      label: 'دانش‌آموزان',
      content: (
        <StudentsTab
          classId={classId}
          students={classDetails.students}
        />
      )
    },
    {
      value: 'grades',
      label: 'نمرات',
      content: (
        <GradesTab
          classId={classId}
          grades={classDetails.recentGrades}
          totalGrades={classDetails.totalGrades}
        />
      )
    },
    {
      value: 'schedule',
      label: 'برنامه',
      content: (
        <ScheduleTab schedule={classDetails.schedule} />
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* هدر */}
      <ClassHeader
        classData={classDetails}
        onAddGrade={handleAddGrade}
        onMessageParents={handleMessageParents}
      />

      {/* آمار کلاس */}
      <ClassStats
        averageClassGrade={classDetails.averageClassGrade}
        totalStudents={classDetails.totalStudents}
        totalGrades={classDetails.totalGrades}
        upcomingSchedule={classDetails.upcomingSchedule}
      />

      {/* تب‌های اصلی */}
      <ClassTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
    </div>
  );
}

// کامپوننت‌های ساده برای GradesTab و ScheduleTab
function GradesTab({ classId, grades, totalGrades }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نمرات کلاس</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          کلاس دارای {totalGrades} نمره ثبت شده است.
        </p>
        {/* می‌توانید این بخش رو کامل‌تر کنید */}
      </CardContent>
    </Card>
  );
}

function ScheduleTab({ schedule }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>برنامه هفتگی کلاس</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {schedule.map((session: any, index: number) => (
            <div key={index} className="p-3 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="font-medium">{session.subject}</span>
                <span className="text-gray-600">{session.day}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {session.startTime} - {session.endTime}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}