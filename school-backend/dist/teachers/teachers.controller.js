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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersController = void 0;
const common_1 = require("@nestjs/common");
const teachers_service_1 = require("./teachers.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let TeachersController = class TeachersController {
    teachersService;
    constructor(teachersService) {
        this.teachersService = teachersService;
    }
    extractUserId(req) {
        const userId = req.user?.id ||
            req.user?.sub ||
            req.user?.userId ||
            req.user?.user?.id;
        if (!userId) {
            throw new Error('User ID not found in request');
        }
        return userId;
    }
    async getDashboardStats(req) {
        const userId = this.extractUserId(req);
        return this.teachersService.getDashboardStats(userId);
    }
    async getMyClasses(req) {
        const userId = this.extractUserId(req);
        return this.teachersService.getClassesByTeacherUserId(userId);
    }
    async getClassStudents(req) {
        const userId = this.extractUserId(req);
        const classId = req.params.id;
        return this.teachersService.getClassStudents(classId, userId);
    }
    async getMyGrades(req) {
        const userId = this.extractUserId(req);
        return this.teachersService.getGradesByTeacher(userId);
    }
    async getMySchedule(req) {
        const userId = this.extractUserId(req);
        return this.teachersService.getScheduleByTeacher(userId);
    }
    async createGrade(gradeData, req) {
        const userId = this.extractUserId(req);
        return this.teachersService.createGrade(gradeData, userId);
    }
    async updateGrade(gradeId, gradeData, req) {
        const userId = this.extractUserId(req);
        return this.teachersService.updateGrade(gradeId, gradeData, userId);
    }
    async deleteGrade(gradeId, req) {
        const userId = this.extractUserId(req);
        return this.teachersService.deleteGrade(gradeId, userId);
    }
    async getMessages(req) {
        const userId = this.extractUserId(req);
        return this.teachersService.getMessages(userId);
    }
    async sendMessage(messageData, req) {
        const userId = this.extractUserId(req);
        return this.teachersService.sendMessage(messageData, userId);
    }
    async getClassGrades(classId, req) {
        const userId = this.extractUserId(req);
        return this.teachersService.getClassGrades(classId, userId);
    }
};
exports.TeachersController = TeachersController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('classes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getMyClasses", null);
__decorate([
    (0, common_1.Get)('classes/:id/students'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getClassStudents", null);
__decorate([
    (0, common_1.Get)('grades'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getMyGrades", null);
__decorate([
    (0, common_1.Get)('schedule'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getMySchedule", null);
__decorate([
    (0, common_1.Post)('grades'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "createGrade", null);
__decorate([
    (0, common_1.Put)('grades/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "updateGrade", null);
__decorate([
    (0, common_1.Delete)('grades/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "deleteGrade", null);
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('classes/:id/grades'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getClassGrades", null);
exports.TeachersController = TeachersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER'),
    (0, common_1.Controller)('teacher'),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService])
], TeachersController);
//# sourceMappingURL=teachers.controller.js.map