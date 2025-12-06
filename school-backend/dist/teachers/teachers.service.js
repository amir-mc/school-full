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
        console.log('📊 getDashboardStats called with userId:', userId);
        try {
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
        }
        catch (error) {
            console.error('❌ Error in getDashboardStats:', error);
            throw error;
        }
    }
    async getClassesByTeacherUserId(userId) {
        console.log('🏫 getClassesByTeacherUserId called with userId:', userId);
        try {
            const teacher = await this.prisma.teacher.findUnique({
                where: { userId },
                select: { id: true }
            });
            if (!teacher) {
                console.log('❌ Teacher not found');
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
        }
        catch (error) {
            console.error('❌ Error in getClassesByTeacherUserId:', error);
            return [];
        }
    }
    async getClassStudents(classId, userId) {
        console.log('👨‍🎓 getClassStudents called:', { classId, userId });
        return [];
    }
    async getGradesByTeacher(userId) {
        console.log('📝 getGradesByTeacher called with userId:', userId);
        try {
            const teacher = await this.prisma.teacher.findUnique({
                where: { userId },
                select: { id: true }
            });
            if (!teacher) {
                console.log('❌ Teacher not found');
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
            console.log(`📚 Teacher has ${classIds.length} classes`);
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
        }
        catch (error) {
            console.error('❌ Error in getGradesByTeacher:', error);
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
            console.error('Error in getScheduleByTeacher:', error);
            return [];
        }
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map