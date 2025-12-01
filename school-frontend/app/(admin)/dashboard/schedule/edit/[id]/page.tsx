// app/(admin)/dashboard/schedule/edit/[id]/page.tsx - آپدیت شده
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Save,
  RotateCcw,
  Calendar,
  Clock,
  School,
  BookOpen,
  Bell
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

// سیستم زنگ‌های کلاسی
const classBells = [
  {
    id: 'bell-1',
    name: 'زنگ اول',
    startTime: '07:30',
    endTime: '09:00',
    duration: 90,
    label: '7:30 - 9:00'
  },
  {
    id: 'bell-2',
    name: 'زنگ دوم',
    startTime: '09:15',
    endTime: '10:45',
    duration: 90,
    label: '9:15 - 10:45'
  },
  {
    id: 'bell-3',
    name: 'زنگ سوم',
    startTime: '10:55',
    endTime: '12:20',
    duration: 85,
    label: '10:55 - 12:20'
  },
  {
    id: 'bell-4',
    name: 'زنگ چهارم',
    startTime: '12:30',
    endTime: '14:00',
    duration: 90,
    label: '12:30 - 14:00'
  },
  {
    id: 'custom',
    name: 'زنگ سفارشی',
    startTime: '',
    endTime: '',
    duration: 0,
    label: 'سفارشی'
  },
  {
    id: 'double',
    name: 'دو زنگ متوالی',
    startTime: '07:30',
    endTime: '10:45',
    duration: 180,
    label: 'دو زنگ'
  },
  {
    id: 'extra',
    name: 'کلاس فوق‌العاده',
    startTime: '14:30',
    endTime: '16:30',
    duration: 120,
    label: 'فوق‌العاده'
  }
];

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
  const [selectedBell, setSelectedBell] = useState('');
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
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
    'آزمون',
    'کارگاه',
    'پژوهش',
    'کلاس فوق‌العاده'
  ];

  useEffect(() => {
    if (scheduleId) {
      fetchScheduleData();
      fetchClasses();
    }
  }, [scheduleId]);

  useEffect(() => {
    // تعیین زنگ بر اساس زمان‌های فعلی
    if (formData.startTime && formData.endTime) {
      detectBellType();
    }
  }, [formData.startTime, formData.endTime]);

  useEffect(() => {
    // وقتی زنگ انتخاب شد، زمان‌ها رو تنظیم کن
    if (selectedBell) {
      const bell = classBells.find(b => b.id === selectedBell);
      if (bell && selectedBell !== 'custom') {
        setFormData(prev => ({
          ...prev,
          startTime: bell.startTime,
          endTime: bell.endTime
        }));
      } else if (selectedBell === 'custom') {
        setFormData(prev => ({
          ...prev,
          startTime: customStartTime,
          endTime: customEndTime
        }));
      }
    }
  }, [selectedBell, customStartTime, customEndTime]);

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

      // تنظیم زمان‌های سفارشی
      setCustomStartTime(specificSchedule.startTime);
      setCustomEndTime(specificSchedule.endTime);

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

  const detectBellType = () => {
    const { startTime, endTime } = formData;
    
    // بررسی زنگ‌های استاندارد
    const matchedBell = classBells.find(bell => 
      bell.id !== 'custom' && bell.id !== 'double' && bell.id !== 'extra' &&
      bell.startTime === startTime && bell.endTime === endTime
    );
    
    if (matchedBell) {
      setSelectedBell(matchedBell.id);
      return;
    }

    // بررسی دو زنگ متوالی
    if (startTime === '07:30' && endTime === '10:45') {
      setSelectedBell('double');
      return;
    }

    // بررسی کلاس فوق‌العاده
    if (startTime === '14:30' && endTime === '16:30') {
      setSelectedBell('extra');
      return;
    }

    // اگر هیچکدام نبود، سفارشی
    setSelectedBell('custom');
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

    // بررسی تداخل زمانی (به جز برنامه فعلی)
    const hasConflict = await checkTimeConflict();
    if (hasConflict) {
      alert('❌ تداخل زمانی: در این بازه زمانی برای کلاس انتخاب شده برنامه دیگری وجود دارد');
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

  const checkTimeConflict = async (): Promise<boolean> => {
    try {
      const response = await api.get('/schedules');
      const existingSchedules = response.data;

      const conflicts = existingSchedules.filter((schedule: any) => 
        schedule.id !== scheduleId && // برنامه فعلی رو نادیده بگیر
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

  const handleReset = () => {
    if (originalSchedule) {
      setFormData({
        classId: originalSchedule.classId,
        day: originalSchedule.day,
        subject: originalSchedule.subject,
        startTime: originalSchedule.startTime,
        endTime: originalSchedule.endTime
      });
      setCustomStartTime(originalSchedule.startTime);
      setCustomEndTime(originalSchedule.endTime);
      detectBellType();
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

  const getBellDurationLabel = () => {
    const duration = calculateDuration();
    if (duration <= 0) return '';
    
    if (duration <= 60) return `${duration} دقیقه`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} ساعت و ${minutes} دقیقه`;
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

  const getSelectedClass = () => {
    return classes.find(c => c.id === formData.classId);
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
            {/* اطلاعات اصلی برنامه */}
            <div className="p-4 border rounded-md bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">کلاس:</span>
                <Badge variant="outline">{originalSchedule.class.name}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">روز:</span>
                <Badge variant="secondary">{originalSchedule.day}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">زمان فعلی:</span>
                <span>{formatTime(originalSchedule.startTime)} - {formatTime(originalSchedule.endTime)}</span>
              </div>
            </div>

            {/* انتخاب کلاس */}
            <div className="space-y-2">
              <Label htmlFor="class">کلاس جدید</Label>
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
                <Label htmlFor="day">روز هفته</Label>
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
                <Label htmlFor="subject">درس</Label>
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

            {/* سیستم زنگ‌های کلاسی */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                انتخاب زنگ کلاسی
              </Label>
              
              <RadioGroup 
                value={selectedBell} 
                onValueChange={setSelectedBell}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {classBells.map((bell) => (
                  <div key={bell.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={bell.id} id={bell.id} />
                    <Label 
                      htmlFor={bell.id} 
                      className={`flex-1 cursor-pointer p-3 rounded-md border-2 transition-all ${
                        selectedBell === bell.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <span className="font-medium text-sm">{bell.name}</span>
                        {bell.label && (
                          <span className="text-xs text-muted-foreground mt-1">
                            {bell.label}
                          </span>
                        )}
                        {bell.duration > 0 && bell.id !== 'custom' && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {bell.duration} دقیقه
                          </Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* زمان‌بندی سفارشی */}
            {selectedBell === 'custom' && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <Label className="text-sm font-medium">زمان‌بندی سفارشی</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customStartTime">زمان شروع *</Label>
                    <Input
                      id="customStartTime"
                      type="time"
                      value={customStartTime}
                      onChange={(e) => {
                        setCustomStartTime(e.target.value);
                        handleChange('startTime', e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customEndTime">زمان پایان *</Label>
                    <Input
                      id="customEndTime"
                      type="time"
                      value={customEndTime}
                      onChange={(e) => {
                        setCustomEndTime(e.target.value);
                        handleChange('endTime', e.target.value);
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

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
                      <span>بازه زمانی جدید:</span>
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
                        {getBellDurationLabel()}
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

            {/* مقایسه تغییرات */}
            {hasChanges() && originalSchedule && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>زمان:</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="line-through text-red-600">
                          {formatTime(originalSchedule.startTime)} - {formatTime(originalSchedule.endTime)}
                        </Badge>
                        <span className="text-blue-600">→</span>
                        <Badge variant="default">
                          {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                        </Badge>
                      </div>
                    </div>
                    {formData.day !== originalSchedule.day && (
                      <div className="flex justify-between items-center">
                        <span>روز:</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="line-through text-red-600">
                            {originalSchedule.day}
                          </Badge>
                          <span className="text-blue-600">→</span>
                          <Badge variant="default">
                            {formData.day}
                          </Badge>
                        </div>
                      </div>
                    )}
                    {formData.subject !== originalSchedule.subject && (
                      <div className="flex justify-between items-center">
                        <span>درس:</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="line-through text-red-600">
                            {originalSchedule.subject}
                          </Badge>
                          <span className="text-blue-600">→</span>
                          <Badge variant="default">
                            {formData.subject}
                          </Badge>
                        </div>
                      </div>
                    )}
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
                  !selectedBell ||
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