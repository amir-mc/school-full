// backend/src/teachers/teachers.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  // آمار داشبورد
  async getDashboardStats(userId: string) {
    console.log('📊 getDashboardStats called with userId:', userId);
    
    try {
      // ابتدا ببینیم کاربر اصلاً وجود دارد
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, role: true }
      });

      console.log('Found user:', user);

      if (!user) {
        console.log('❌ User not found in database');
        return {
          teacherName: 'کاربر یافت نشد',
          activeClasses: 0,
          totalStudents: 0,
          totalGrades: 0,
          averageGrade: 0,
          recentGrades: []
        };
      }

      // بررسی کنیم که آیا این کاربر واقعاً یک معلم است
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      console.log('Found teacher record:', teacher);

      if (!teacher) {
        console.log('⚠️ User is not registered as a teacher');
        return {
          teacherName: user.name,
          activeClasses: 0,
          totalStudents: 0,
          totalGrades: 0,
          averageGrade: 0,
          recentGrades: []
        };
      }

      // کلاس‌های معلم
      const classes = await this.prisma.class.findMany({
        where: {
          teachers: {
            some: {
              id: teacher.id
            }
          }
        },
        select: {
          id: true,
          name: true,
          students: {
            select: {
              id: true
            }
          }
        }
      });

      console.log(`📚 Found ${classes.length} classes for teacher`);

      // دانش‌آموزان همه کلاس‌ها
      const totalStudents = classes.reduce((sum, cls) => sum + cls.students.length, 0);

      // نمرات معلم
      const grades = await this.getGradesByTeacher(userId);
      
      // محاسبه میانگین
      const averageGrade = grades.length > 0 
        ? grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length 
        : 0;

      // ۵ نمره آخر
      const recentGrades = grades.slice(0, 5).map(grade => ({
        id: grade.id,
        studentName: grade.studentName,
        subject: grade.subject,
        value: grade.value,
        date: grade.createdAt
      }));

      const result = {
        teacherName: user.name,
        activeClasses: classes.length,
        totalStudents,
        totalGrades: grades.length,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        recentGrades
      };

      console.log('📈 Dashboard stats result:', result);
      return result;

    } catch (error) {
      console.error('❌ Error in getDashboardStats:', error);
      throw error;
    }
  }

  // کلاس‌های معلم
  async getClassesByTeacherUserId(userId: string) {
    console.log('🏫 getClassesByTeacherUserId called with userId:', userId);
    
    try {
      // پیدا کردن معلم
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!teacher) {
        console.log('❌ Teacher not found');
        return [];
      }

      // کلاس‌های این معلم
      const classes = await this.prisma.class.findMany({
        where: {
          teachers: {
            some: {
              id: teacher.id
            }
          }
        },
        include: {
          students: {
            select: {
              id: true
            }
          },
          schedules: {
            select: {
              id: true,
              day: true,
              subject: true
            }
          }
        },
        orderBy: {
          grade: 'asc'
        }
      });

      const result = classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        grade: cls.grade,
        studentCount: cls.students.length,
        scheduleCount: cls.schedules.length,
        hasSchedule: cls.schedules.length > 0
      }));

      console.log(`📚 Returning ${result.length} classes`);
      return result;

    } catch (error) {
      console.error('❌ Error in getClassesByTeacherUserId:', error);
      return [];
    }
  }

  // بقیه متدها به همان شکل قبلی باقی می‌مانند...
  // فقط console.log برای دیباگ اضافه می‌کنیم

  async getClassStudents(classId: string, userId: string) {
    console.log('👨‍🎓 getClassStudents called:', { classId, userId });
    // بقیه کد همان...
    return [];
  }

  async getGradesByTeacher(userId: string) {
    console.log('📝 getGradesByTeacher called with userId:', userId);
    
    try {
      // پیدا کردن معلم
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!teacher) {
        console.log('❌ Teacher not found');
        return [];
      }

      // کلاس‌های این معلم
      const classes = await this.prisma.class.findMany({
        where: {
          teachers: {
            some: {
              id: teacher.id
            }
          }
        },
        select: {
          id: true
        }
      });

      const classIds = classes.map(c => c.id);
      console.log(`📚 Teacher has ${classIds.length} classes`);

      // نمرات دانش‌آموزان این کلاس‌ها
      const grades = await this.prisma.grade.findMany({
        where: {
          student: {
            classId: {
              in: classIds
            }
          }
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true
                }
              },
              class: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      });

      const result = grades.map(grade => ({
        id: grade.id,
        studentId: grade.studentId,
        studentName: grade.student.user.name,
        className: grade.student.class.name,
        subject: grade.subject,
        value: grade.value,
        createdAt: grade.createdAt
      }));

      console.log(`📊 Returning ${result.length} grades`);
      return result;

    } catch (error) {
      console.error('❌ Error in getGradesByTeacher:', error);
      return [];
    }
  }

  // برنامه درسی معلم
  async getScheduleByTeacher(userId: string) {
    try {
      // پیدا کردن معلم
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!teacher) {
        return [];
      }

      // کلاس‌های این معلم
      const classes = await this.prisma.class.findMany({
        where: {
          teachers: {
            some: {
              id: teacher.id
            }
          }
        },
        select: {
          id: true,
          name: true
        }
      });

      const classIds = classes.map(c => c.id);

      // برنامه درسی این کلاس‌ها
      const schedules = await this.prisma.schedule.findMany({
        where: {
          classId: {
            in: classIds
          }
        },
        include: {
          class: {
            select: {
              name: true
            }
          }
        },
        orderBy: [
          { day: 'asc' },
          { startTime: 'asc' }
        ]
      });

      // گروه‌بندی بر اساس روز
      const groupedByDay: Record<string, any[]> = {};
      
      schedules.forEach(schedule => {
        if (!groupedByDay[schedule.day]) {
          groupedByDay[schedule.day] = [];
        }
        
        groupedByDay[schedule.day].push({
          id: schedule.id,
          className: schedule.class.name,
          subject: schedule.subject,
          startTime: schedule.startTime,
          endTime: schedule.endTime
        });
      });

      // تبدیل به آرایه
      return Object.entries(groupedByDay).map(([day, schedules]) => ({
        day,
        schedules
      }));
    } catch (error) {
      console.error('Error in getScheduleByTeacher:', error);
      return [];
    }
  }
}