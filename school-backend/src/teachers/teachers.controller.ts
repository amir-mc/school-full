// backend/src/teachers/teachers.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
@Controller('teacher')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  private extractUserId(req: any): string {
    // بررسی چندین مکان ممکن برای userId
    const userId = 
      req.user?.id ||           // روش اصلی
      req.user?.sub ||          // از JWT payload
      req.user?.userId ||       // نام متغیر جایگزین
      req.user?.user?.id;       // اگر تو در تو بود

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    return userId;
  }

  @Get('dashboard/stats')
  async getDashboardStats(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.getDashboardStats(userId);
  }

  @Get('classes')
  async getMyClasses(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.getClassesByTeacherUserId(userId);
  }

  @Get('classes/:id/students')
  async getClassStudents(@Req() req: any) {
    const userId = this.extractUserId(req);
    const classId = req.params.id;
    return this.teachersService.getClassStudents(classId, userId);
  }

  @Get('grades')
  async getMyGrades(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.getGradesByTeacher(userId);
  }

  @Get('schedule')
  async getMySchedule(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.getScheduleByTeacher(userId);
  }

  @Post('grades')
  async createGrade(@Body() gradeData: any, @Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.createGrade(gradeData, userId);
  }

  @Put('grades/:id')
  async updateGrade(@Param('id') gradeId: string, @Body() gradeData: any, @Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.updateGrade(gradeId, gradeData, userId);
  }

  @Delete('grades/:id')
  async deleteGrade(@Param('id') gradeId: string, @Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.deleteGrade(gradeId, userId);
  }

  @Get('messages')
  async getMessages(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.getMessages(userId);
  }

  @Post('messages')
  async sendMessage(@Body() messageData: any, @Req() req: any) {
    const userId = this.extractUserId(req);
    return this.teachersService.sendMessage(messageData, userId);
  }
  @Get('classes/:id/grades')
async getClassGrades(@Param('id') classId: string, @Req() req: any) {
  const userId = this.extractUserId(req);
  return this.teachersService.getClassGrades(classId, userId);
}
}