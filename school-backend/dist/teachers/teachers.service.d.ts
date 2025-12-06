import { PrismaService } from '../prisma/prisma.service';
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(userId: string): Promise<{
        teacherName: string;
        activeClasses: number;
        totalStudents: number;
        totalGrades: number;
        averageGrade: number;
        recentGrades: {
            id: string;
            studentName: string;
            subject: string;
            value: number;
            date: Date;
        }[];
    }>;
    getClassesByTeacherUserId(userId: string): Promise<{
        id: string;
        name: string;
        grade: number;
        studentCount: number;
        scheduleCount: number;
        hasSchedule: boolean;
    }[]>;
    getClassStudents(classId: string, userId: string): Promise<never[]>;
    getGradesByTeacher(userId: string): Promise<{
        id: string;
        studentId: string;
        studentName: string;
        className: string;
        subject: string;
        value: number;
        createdAt: Date;
    }[]>;
    getScheduleByTeacher(userId: string): Promise<{
        day: string;
        schedules: any[];
    }[]>;
}
