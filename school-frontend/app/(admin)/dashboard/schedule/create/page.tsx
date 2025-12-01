// app/(admin)/dashboard/schedule/create/page.tsx - آپدیت شده
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowRight, 
  Calendar,
  Clock,
  School,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Bell
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
    startTime: '',
    endTime: '',
    duration: 180,
    label: 'دو زنگ'
  },
  {
    id: 'extra',
    name: 'کلاس فوق‌العاده',
    startTime: '',
    endTime: '',
    duration: 120,
    label: 'فوق‌العاده'
  }
];

export default function CreateSchedulePage() {
  const [formData, setFormData] = useState({
    classId: '',
    day: '',
    subject: '',
    startTime: '',
    endTime: '',
    bellType: ''
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [selectedBell, setSelectedBell] = useState('');
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const router = useRouter();

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
    fetchClasses();
  }, []);

  useEffect(() => {
    // وقتی زنگ انتخاب شد، زمان‌ها رو تنظیم کن
    if (selectedBell) {
      const bell = classBells.find(b => b.id === selectedBell);
      if (bell) {
        if (selectedBell === 'custom') {
          // برای زنگ سفارشی، زمان‌های قبلی رو نگه دار
          setFormData(prev => ({
            ...prev,
            startTime: customStartTime,
            endTime: customEndTime
          }));
        } else if (selectedBell === 'double') {
          // دو زنگ متوالی - محاسبه زمان
          setFormData(prev => ({
            ...prev,
            startTime: '07:30',
            endTime: '10:45'
          }));
        } else if (selectedBell === 'extra') {
          // کلاس فوق‌العاده - زمان پیش‌فرض
          setFormData(prev => ({
            ...prev,
            startTime: '14:30',
            endTime: '16:30'
          }));
        } else {
          // زنگ‌های استاندارد
          setFormData(prev => ({
            ...prev,
            startTime: bell.startTime,
            endTime: bell.endTime
          }));
        }
      }
    }
  }, [selectedBell, customStartTime, customEndTime]);

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

      const response = await api.post('/schedules', {
        classId: formData.classId,
        day: formData.day,
        subject: formData.subject,
        startTime: formData.startTime,
        endTime: formData.endTime
      });

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

            {/* سیستم زنگ‌های کلاسی */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                انتخاب زنگ کلاسی *
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
                <p className="text-xs text-muted-foreground">
                  برای کلاس‌های ویژه، فوق‌العاده یا برنامه‌های خاص استفاده می‌شود
                </p>
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

            {/* برنامه زمان‌بندی مدرسه */}
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  برنامه زنگ‌های مدرسه
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2">
                  {classBells.filter(b => b.id !== 'custom' && b.id !== 'double' && b.id !== 'extra').map((bell) => (
                    <div key={bell.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="font-medium">{bell.name}</span>
                      <span className="text-muted-foreground">{bell.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {bell.duration} دقیقه
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                    <Badge variant="outline">{formData.day}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>درس:</span>
                    <Badge variant="outline">{formData.subject}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>نوع زنگ:</span>
                    <span className="font-medium">
                      {classBells.find(b => b.id === selectedBell)?.name || 'سفارشی'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>زمان:</span>
                    <span className="font-medium">
                      {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span>مدت:</span>
                    <Badge variant="secondary">{getBellDurationLabel()}</Badge>
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
                  formData.startTime >= formData.endTime ||
                  !selectedBell
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