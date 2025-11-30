// app/(admin)/dashboard/schedule/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';

interface Class {
  id: string;
  name: string;
  grade: number;
  teachers?: Array<{
    id: string;
    user: {
      id: string;
      name: string;
    };
  }>;
}

export default function CreateSchedulePage() {
  const [formData, setFormData] = useState({
    classId: '',
    day: '',
    subject: '',
    startTime: '',
    endTime: ''
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const router = useRouter();

  // روزهای هفته
  const daysOfWeek = [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سه‌شنبه',
    'چهارشنبه',
    'پنجشنبه',
    'جمعه'
  ];

  // دروس پیش‌فرض
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
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('خطا در دریافت لیست کلاس‌ها');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی
    if (!formData.classId || !formData.day || !formData.subject || !formData.startTime || !formData.endTime) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    // اعتبارسنجی زمان
    if (formData.startTime >= formData.endTime) {
      alert('زمان پایان باید بعد از زمان شروع باشد');
      return;
    }

    // بررسی تداخل زمانی
    const hasConflict = await checkTimeConflict();
    if (hasConflict) {
      alert('❌ تداخل زمانی: در این بازه زمانی برای کلاس انتخاب شده برنامه دیگری وجود دارد');
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Creating schedule:', formData);

      const response = await api.post('/schedules', formData);

      console.log('✅ Schedule created:', response.data);
      
      alert('✅ برنامه با موفقیت ایجاد شد!');
      router.push('/dashboard/schedule');
      
    } catch (error: any) {
      console.error('❌ Error creating schedule:', error);
      alert(`خطا در ایجاد برنامه: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkTimeConflict = async (): Promise<boolean> => {
    try {
      const response = await api.get('/schedules');
      const existingSchedules = response.data;

      const conflicts = existingSchedules.filter((schedule: any) => 
        schedule.classId === formData.classId &&
        schedule.day === formData.day &&
        (
          (formData.startTime >= schedule.startTime && formData.startTime < schedule.endTime) ||
          (formData.endTime > schedule.startTime && formData.endTime <= schedule.endTime) ||
          (formData.startTime <= schedule.startTime && formData.endTime >= schedule.endTime)
        )
      );

      return conflicts.length > 0;
    } catch (error) {
      console.error('Error checking time conflict:', error);
      return false;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedClass = () => {
    return classes.find(c => c.id === formData.classId);
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60); // مدت به دقیقه
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'ب.ظ' : 'ق.ظ';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const getDayBadgeVariant = (day: string) => {
    const variants: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
      'شنبه': 'default',
      'یکشنبه': 'secondary',
      'دوشنبه': 'outline',
      'سه‌شنبه': 'default',
      'چهارشنبه': 'secondary',
      'پنجشنبه': 'outline',
      'جمعه': 'destructive'
    };
    return variants[day] || 'outline';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ایجاد برنامه جدید</h1>
        <p className="text-muted-foreground">
          اطلاعات برنامه جدید را وارد کنید
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            فرم ایجاد برنامه
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

            {/* اطلاعات کلاس انتخاب شده */}
            {formData.classId && (
              <Alert className="bg-blue-50 border-blue-200">
                <School className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="flex flex-wrap gap-4">
                    <span>
                      <strong>کلاس:</strong> {getSelectedClass()?.name}
                    </span>
                    <span>
                      <strong>پایه:</strong> {getSelectedClass()?.grade}
                    </span>
                    <span>
                      <strong>معلمان:</strong> 
                      {getSelectedClass()?.teachers && getSelectedClass()!.teachers!.length > 0 ? (
                        getSelectedClass()!.teachers!.map(teacher => (
                          <Badge key={teacher.id} variant="outline" className="mr-1 text-xs">
                            {teacher.user.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">بدون معلم</span>
                      )}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            )}

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
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {day}
                        </div>
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
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {subject}
                        </div>
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
                <p className="text-xs text-muted-foreground">
                  زمان شروع کلاس
                </p>
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
                <p className="text-xs text-muted-foreground">
                  زمان پایان کلاس
                </p>
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
                    {formData.startTime >= formData.endTime && (
                      <div className="text-red-600 text-sm font-medium">
                        ⚠️ زمان پایان باید بعد از زمان شروع باشد
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* خلاصه اطلاعات */}
            {(formData.classId && formData.day && formData.subject && formData.startTime && formData.endTime && formData.startTime < formData.endTime) && (
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm">خلاصه اطلاعات برنامه</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>کلاس:</span>
                    <span className="font-medium">{getSelectedClass()?.name}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>روز:</span>
                    <Badge variant={getDayBadgeVariant(formData.day)}>
                      {formData.day}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>درس:</span>
                    <Badge variant="outline">{formData.subject}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>زمان:</span>
                    <span className="font-medium">
                      {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>مدت:</span>
                    <Badge variant="secondary">{calculateDuration()} دقیقه</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* دکمه‌های اقدام */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={loading}
              >
                بازگشت
              </Button>
              <Button
                type="submit"
                disabled={
                  loading || 
                  !formData.classId || 
                  !formData.day || 
                  !formData.subject || 
                  !formData.startTime || 
                  !formData.endTime ||
                  formData.startTime >= formData.endTime
                }
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    در حال ایجاد...
                  </>
                ) : (
                  <>
                    ایجاد برنامه
                    <ArrowRight className="h-4 w-4 mr-2" />
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