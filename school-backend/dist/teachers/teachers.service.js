"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeachersService = class TeachersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(userId) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async getClassesByTeacherUserId(userId) {
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
        }
        catch (error) {
            return [];
        }
    }
    async getClassStudents(classId, userId) {
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
        }
        catch (error) {
            return [];
        }
    }
    async getGradesByTeacher(userId) {
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
        }
        catch (error) {
            return [];
        }
    }
    async getScheduleByTeacher(userId) {
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
            const groupedByDay = {};
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
        }
        catch (error) {
            return [];
        }
    }
    async createGrade(gradeData, userId) {
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
    async updateGrade(gradeId, gradeData, userId) {
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
    async deleteGrade(gradeId, userId) {
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
    async sendMessage(messageData, userId) {
        return this.prisma.message.create({
            data: {
                content: messageData.content,
                fromId: userId,
                toId: messageData.toId || null,
                isPublic: messageData.isPublic || false
            }
        });
    }
    async getMessages(userId) {
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
    async teacherHasAccessToStudent(teacherUserId, studentId) {
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
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map