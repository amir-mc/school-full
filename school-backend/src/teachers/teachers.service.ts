// backend/src/teachers/teachers.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  // آمار داشبورد
  async getDashboardStats(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, role: true }
      });

      if (!user) {
        return {
          teacherName: 'کاربر یافت نشد',
          activeClasses: 0,
          totalStudents: 0,
          totalGrades: 0,
          averageGrade: 0,
          recentGrades: []
        };
      }

      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!teacher) {
        return {
          teacherName: user.name,
          activeClasses: 0,
          totalStudents: 0,
          totalGrades: 0,
          averageGrade: 0,
          recentGrades: []
        };
      }

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

      const totalStudents = classes.reduce((sum, cls) => sum + cls.students.length, 0);
      const grades = await this.getGradesByTeacher(userId);
      
      const averageGrade = grades.length > 0 
        ? grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length 
        : 0;

      const recentGrades = grades.slice(0, 5).map(grade => ({
        id: grade.id,
        studentName: grade.studentName,
        subject: grade.subject,
        value: grade.value,
        date: grade.createdAt
      }));

      return {
        teacherName: user.name,
        activeClasses: classes.length,
        totalStudents,
        totalGrades: grades.length,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        recentGrades
      };

    } catch (error) {
      throw error;
    }
  }

  // کلاس‌های معلم
  async getClassesByTeacherUserId(userId: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!teacher) {
        return [];
      }

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

      return classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        grade: cls.grade,
        studentCount: cls.students.length,
        scheduleCount: cls.schedules.length,
        hasSchedule: cls.schedules.length > 0
      }));

    } catch (error) {
      return [];
    }
  }

  // دانش‌آموزان یک کلاس خاص
  async getClassStudents(classId: string, userId: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!teacher) {
        return [];
      }

      const classExists = await this.prisma.class.findFirst({
        where: {
          id: classId,
          teachers: {
            some: {
              id: teacher.id
            }
          }
        }
      });

      if (!classExists) {
        return [];
      }

      const students = await this.prisma.student.findMany({
        where: {
          classId: classId
        },
        include: {
          user: {
            select: {
              name: true,
              username: true
            }
          },
          grades: {
            select: {
              value: true,
              subject: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 5
          }
        },
        orderBy: {
          user: {
            name: 'asc'
          }
        }
      });

      return students.map(student => ({
        id: student.id,
        name: student.user.name,
        username: student.user.username,
        gradeCount: student.grades.length,
        lastGrades: student.grades.map(g => ({
          subject: g.subject,
          value: g.value,
          date: g.createdAt
        }))
      }));
    } catch (error) {
      return [];
    }
  }

  // نمرات معلم
  async getGradesByTeacher(userId: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!teacher) {
        return [];
      }

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

      return grades.map(grade => ({
        id: grade.id,
        studentId: grade.studentId,
        studentName: grade.student.user.name,
        className: grade.student.class.name,
        subject: grade.subject,
        value: grade.value,
        createdAt: grade.createdAt
      }));

    } catch (error) {
      return [];
    }
  }

  // برنامه درسی معلم
  async getScheduleByTeacher(userId: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!teacher) {
        return [];
      }

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

      return Object.entries(groupedByDay).map(([day, schedules]) => ({
        day,
        schedules
      }));
    } catch (error) {
      return [];
    }
  }

  // ثبت نمره جدید
  async createGrade(gradeData: any, userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const hasAccess = await this.teacherHasAccessToStudent(userId, gradeData.studentId);
    if (!hasAccess) {
      throw new Error('دسترسی غیرمجاز به این دانش‌آموز');
    }

    return this.prisma.grade.create({
      data: {
        studentId: gradeData.studentId,
        subject: gradeData.subject,
        value: gradeData.value
      }
    });
  }

  // ویرایش نمره
  async updateGrade(gradeId: string, gradeData: any, userId: string) {
    const grade = await this.prisma.grade.findUnique({
      where: { id: gradeId },
      include: {
        student: {
          include: {
            class: {
              include: {
                teachers: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });

    if (!grade || grade.student.class.teachers.length === 0) {
      throw new Error('دسترسی غیرمجاز یا نمره یافت نشد');
    }

    return this.prisma.grade.update({
      where: { id: gradeId },
      data: {
        subject: gradeData.subject,
        value: gradeData.value
      }
    });
  }

  // حذف نمره
  async deleteGrade(gradeId: string, userId: string) {
    const grade = await this.prisma.grade.findUnique({
      where: { id: gradeId },
      include: {
        student: {
          include: {
            class: {
              include: {
                teachers: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });

    if (!grade || grade.student.class.teachers.length === 0) {
      throw new Error('دسترسی غیرمجاز یا نمره یافت نشد');
    }

    return this.prisma.grade.delete({
      where: { id: gradeId }
    });
  }

  // ارسال پیام
  async sendMessage(messageData: any, userId: string) {
    return this.prisma.message.create({
      data: {
        content: messageData.content,
        fromId: userId,
        toId: messageData.toId || null,
        isPublic: messageData.isPublic || false
      }
    });
  }

  // دریافت پیام‌های معلم
  async getMessages(userId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { fromId: userId },
          { toId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });
  }

  // بررسی دسترسی معلم به دانش‌آموز
  private async teacherHasAccessToStudent(teacherUserId: string, studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            teachers: {
              where: { userId: teacherUserId },
            },
          },
        },
      },
    });

    return student && student.class.teachers.length > 0;
  }
}