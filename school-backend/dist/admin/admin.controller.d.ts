import { UsersService } from 'src/users/users.service';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly usersService;
    private readonly adminService;
    constructor(usersService: UsersService, adminService: AdminService);
    createUser(dto: {
        name: string;
        username: string;
        password: string;
        role: string;
        classId?: string;
    }): Promise<{
        id: string;
        name: string;
        username: string;
        password: string;
        role: import("generated/prisma").$Enums.Role;
        createdAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        name: string;
        username: string;
        password: string;
        role: import("generated/prisma").$Enums.Role;
        createdAt: Date;
    }>;
    getUserById(id: string): Promise<{
        id: string;
        name: string;
        username: string;
        password: string;
        role: import("generated/prisma").$Enums.Role;
        createdAt: Date;
    }>;
    updateUser(id: string, dto: {
        name?: string;
        username?: string;
        password?: string;
        role?: string;
    }): Promise<{
        id: string;
        name: string;
        username: string;
        password: string;
        role: import("generated/prisma").$Enums.Role;
        createdAt: Date;
    }>;
    findAll(query: string, role: string, classId: string): Promise<({
        student: {
            id: string;
            classId: string;
            parentId: string | null;
            userId: string;
        } | null;
    } & {
        id: string;
        name: string;
        username: string;
        password: string;
        role: import("generated/prisma").$Enums.Role;
        createdAt: Date;
    })[]>;
    findAllClasses(): import("generated/prisma").Prisma.PrismaPromise<{
        id: string;
        name: string;
    }[]>;
    countStudents(): Promise<{
        count: number;
    }>;
    countTeachers(): Promise<{
        count: number;
    }>;
    countParents(): Promise<{
        count: number;
    }>;
    countAllUsers(): Promise<{
        count: number;
    }>;
    countClasses(): Promise<{
        count: number;
    }>;
}
