// app/(admin)/dashboard/schedule/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowRight, 
  Calendar,
  Clock,
  School,
  BookOpen,
  Save,
  RotateCcw
} from 'lucide-react';
import api from '@/lib/api';

interface Schedule {
  id: string;
  classId: string;
  day: string;
  subject: string;
  startTime: string;
  endTime: string;
  class: {
    id: string;
    name: string;
    grade: number;
  };
}

interface Class {
  id: string;
  name: string;
  grade: number;
}

export default function EditSchedulePage() {
  const params = useParams();
  const scheduleId = params.id as string;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    classId: '',
    day: '',
    subject: '',
    startTime: '',
    endTime: ''
  });
  const [originalSchedule, setOriginalSchedule] = useState<Schedule | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const daysOfWeek = [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سه‌شنبه',
    'چهارشنبه',
    'پنجشنبه',
    'جمعه'
  ];

  const defaultSubjects = [
    'ریاضی',
    'علوم',
    'ادبیات فارسی',
    'زبان انگلیسی',
    'دینی',
    'عربی',
    'فیزیک',
    'شیمی',
    'زیست‌شناسی',
    'تاریخ',
    'جغرافیا',
    'هنر',
    'ورزش',
    'مشاوره',
    'آزمون'
  ];

  useEffect(() => {
    if (scheduleId) {
      fetchScheduleData();
      fetchClasses();
    }
  }, [scheduleId]);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      
      // دریافت همه برنامه‌ها و پیدا کردن برنامه مورد نظر
      const response = await api.get('/schedules');
      const allSchedules = Array.isArray(response.data) ? response.data : [];
      const specificSchedule = allSchedules.find((s: Schedule) => s.id === scheduleId);
      
      if (!specificSchedule) {
        throw new Error('برنامه مورد نظر یافت نشد');
      }

      setOriginalSchedule(specificSchedule);
      setFormData({
        classId: specificSchedule.classId,
        day: specificSchedule.day,
        subject: specificSchedule.subject,
        startTime: specificSchedule.startTime,
        endTime: specificSchedule.endTime
      });

    } catch (error: any) {
      console.error('Error fetching schedule data:', error);
      alert(`خطا در دریافت اطلاعات برنامه: ${error.response?.data?.message || error.message}`);
      router.push('/dashboard/schedule');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.day || !formData.subject || !formData.startTime || !formData.endTime) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert('زمان پایان باید بعد از زمان شروع باشد');
      return;
    }

    setUpdating(true);

    try {
      console.log('📤 Updating schedule:', {
        scheduleId,
        ...formData
      });

      const response = await api.patch(`/schedules/${scheduleId}`, formData);

      console.log('✅ Schedule updated:', response.data);
      
      alert('✅ برنامه با موفقیت ویرایش شد!');
      router.push('/dashboard/schedule');
      
    } catch (error: any) {
      console.error('❌ Error updating schedule:', error);
      alert(`خطا در ویرایش برنامه: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleReset = () => {
    if (originalSchedule) {
      setFormData({
        classId: originalSchedule.classId,
        day: originalSchedule.day,
        subject: originalSchedule.subject,
        startTime: originalSchedule.startTime,
        endTime: originalSchedule.endTime
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'ب.ظ' : 'ق.ظ';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const hasChanges = () => {
    if (!originalSchedule) return false;
    
    return (
      formData.classId !== originalSchedule.classId ||
      formData.day !== originalSchedule.day ||
      formData.subject !== originalSchedule.subject ||
      formData.startTime !== originalSchedule.startTime ||
      formData.endTime !== originalSchedule.endTime
    );
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">در حال دریافت اطلاعات برنامه...</p>
        </div>
      </div>
    );
  }

  if (!originalSchedule) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Alert className="bg-red-50 border-red-200">
          برنامه مورد نظر یافت نشد
        </Alert>
        <Button onClick={() => router.push('/dashboard/schedule')}>
          بازگشت به لیست برنامه‌ها
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ویرایش برنامه</h1>
        <p className="text-muted-foreground">
          اطلاعات برنامه را ویرایش کنید
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            فرم ویرایش برنامه
            {hasChanges() && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                تغییرات ذخیره نشده
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* انتخاب کلاس */}
            <div className="space-y-2">
              <Label htmlFor="class">کلاس *</Label>
              <Select 
                value={formData.classId} 
                onValueChange={(value) => handleChange('classId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کلاس" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        {cls.name}
                        <Badge variant="outline" className="text-xs">
                          پایه {cls.grade}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* روز و درس */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* روز هفته */}
              <div className="space-y-2">
                <Label htmlFor="day">روز هفته *</Label>
                <Select 
                  value={formData.day} 
                  onValueChange={(value) => handleChange('day', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب روز" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* درس */}
              <div className="space-y-2">
                <Label htmlFor="subject">درس *</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => handleChange('subject', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب درس" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* زمان‌بندی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* زمان شروع */}
              <div className="space-y-2">
                <Label htmlFor="startTime">زمان شروع *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />
              </div>

              {/* زمان پایان */}
              <div className="space-y-2">
                <Label htmlFor="endTime">زمان پایان *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* اطلاعات زمان‌بندی */}
            {(formData.startTime && formData.endTime) && (
              <Alert className={
                formData.startTime >= formData.endTime 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-green-50 border-green-200'
              }>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>بازه زمانی:</span>
                      <span className="font-medium">
                        {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>مدت زمان:</span>
                      <Badge variant={
                        formData.startTime >= formData.endTime 
                          ? 'destructive' 
                          : 'default'
                      }>
                        {calculateDuration()} دقیقه
                      </Badge>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* دکمه‌های اقدام */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={updating}
              >
                بازگشت
              </Button>
              
              {hasChanges() && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={updating}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  بازنشانی
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={
                  updating || 
                  !formData.classId || 
                  !formData.day || 
                  !formData.subject || 
                  !formData.startTime || 
                  !formData.endTime ||
                  formData.startTime >= formData.endTime ||
                  !hasChanges()
                }
                className="flex-1"
              >
                {updating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    در حال ویرایش...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    ذخیره تغییرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}