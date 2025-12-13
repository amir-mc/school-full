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
    getClassStudents(classId: string, userId: string): Promise<{
        id: string;
        name: string;
        username: string;
        gradeCount: number;
        lastGrades: {
            subject: string;
            value: number;
            date: Date;
        }[];
    }[]>;
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
    createGrade(gradeData: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        subject: string;
        value: number;
    }>;
    updateGrade(gradeId: string, gradeData: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        subject: string;
        value: number;
    }>;
    deleteGrade(gradeId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        subject: string;
        value: number;
    }>;
    sendMessage(messageData: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        fromId: string;
        toId: string | null;
        isPublic: boolean;
        isRead: boolean;
    }>;
    getMessages(userId: string): Promise<({
        sender: {
            id: string;
            name: string;
            role: import("generated/prisma").$Enums.Role;
        };
        receiver: {
            id: string;
            name: string;
            role: import("generated/prisma").$Enums.Role;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        content: string;
        fromId: string;
        toId: string | null;
        isPublic: boolean;
        isRead: boolean;
    })[]>;
    private teacherHasAccessToStudent;
    getClassGrades(classId: string, userId: string): Promise<{
        id: string;
        studentId: string;
        studentName: string;
        subject: string;
        value: number;
        date: Date;
    }[]>;
}
