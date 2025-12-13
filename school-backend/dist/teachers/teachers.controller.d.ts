import { TeachersService } from './teachers.service';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    private extractUserId;
    getDashboardStats(req: any): Promise<{
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
    getMyClasses(req: any): Promise<{
        id: string;
        name: string;
        grade: number;
        studentCount: number;
        scheduleCount: number;
        hasSchedule: boolean;
    }[]>;
    getClassStudents(req: any): Promise<{
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
    getMyGrades(req: any): Promise<{
        id: string;
        studentId: string;
        studentName: string;
        className: string;
        subject: string;
        value: number;
        createdAt: Date;
    }[]>;
    getMySchedule(req: any): Promise<{
        day: string;
        schedules: any[];
    }[]>;
    createGrade(gradeData: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        subject: string;
        value: number;
    }>;
    updateGrade(gradeId: string, gradeData: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        subject: string;
        value: number;
    }>;
    deleteGrade(gradeId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        subject: string;
        value: number;
    }>;
    getMessages(req: any): Promise<({
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
    sendMessage(messageData: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        fromId: string;
        toId: string | null;
        isPublic: boolean;
        isRead: boolean;
    }>;
    getClassGrades(classId: string, req: any): Promise<{
        id: string;
        studentId: string;
        studentName: string;
        subject: string;
        value: number;
        date: Date;
    }[]>;
}
