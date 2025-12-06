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
    getClassStudents(req: any): Promise<never[]>;
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
}
