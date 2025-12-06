// backend/src/teachers/teachers.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
    // چندین روش ممکن برای دریافت user ID
    console.log('Request user object:', req.user);
    console.log('Request user keys:', Object.keys(req.user));
    
    // روش‌های مختلف برای یافتن user ID
    const userId = 
      req.user?.id ||           // روش ۱: مستقیم
      req.user?.sub ||          // روش ۲: از JWT payload
      req.user?.userId ||       // روش ۳: نام متغیر متفاوت
      req.user?.user?.id ||     // روش ۴: تو در تو
      req.user?.user_id;        // روش ۵: snake_case
    
    console.log('Extracted userId:', userId);
    
    if (!userId) {
      throw new Error(`User ID not found in token. Available keys: ${JSON.stringify(req.user)}`);
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
}