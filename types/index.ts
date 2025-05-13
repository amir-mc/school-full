// src/types/index.ts

// نوع کاربر
export interface User {
  id: string;
  nationalId: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// نوع دانش‌آموز
export interface Student {
  id: number;
  userId: number;
  user: {
    id: number;
    fullName: string;
  };
  class: {
    id: number;
    name: string;
    grade: string;
  };
  parentId?: number;
}

// نوع نمره
export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  value: number;
  type: GradeType;
  date: string;
  teacherId?: string;
  teacherName?: string;
   course?: {
    id: string;
    name: string;
  };
  student?: {
    id: string;
    name: string;
  };
}

// نوع حضور و غیاب
export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  courseId?: string;
  courseName?: string;
}

// نوع درس
export interface Course {
  id: string;
  name: string;
  description?: string;
  classId: string;
  className: string;
  teacherId?: string;
  teacherName?: string;
  schedule: Schedule[];
}

// نوع برنامه زمانی
export interface Schedule {
  day: 'SATURDAY' | 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  startTime: string;
  endTime: string;
  classroom?: string;
}

// نوع کلاس
export interface Class {
  id: string;
  name: string;
  gradeLevel: number;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
}

// نوع معلم
export interface Teacher {
  id: string;
  user: User;
  courses?: Course[];
  classId?: string;
  className?: string;
}

// نوع والدین
export interface Parent {
  id: string;
  user: User;
  students: Student[];
}

// نوع پیام
export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: 'TEACHER' | 'PARENT' | 'ADMIN';
  };
  receiverId: string;
  createdAt: string;
  isRead: boolean;
}

// انواع مقادیر ثابت
export type GradeType = 'QUIZ' | 'EXAM' | 'ASSIGNMENT' | 'PROJECT';
export type DayOfWeek = 'SATURDAY' | 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

// نوع آمار مدرسه
export interface SchoolStats {
  totalStudents: number;
  averageGrade: number;
  attendanceRate: number;
  gradeDistribution: {
    range: string;
    count: number;
  }[];
  attendanceTrend: {
    month: string;
    rate: number;
  }[];
}
// نوع برای فرم‌های مختلف
export interface GradeFormData {
  studentId: string;
  courseId: string;
  value: number;
  type: GradeType;
}

export interface AttendanceFormData {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  courseId?: string;
}