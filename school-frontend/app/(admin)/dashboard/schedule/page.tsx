// app/(admin)/dashboard/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  School,
  BookOpen,
  X
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
    teachers?: Array<{
      id: string;
      user: {
        id: string;
        name: string;
      };
    }>;
  };
}

interface Class {
  id: string;
  name: string;
  grade: number;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  
  // فیلترها
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');

  const daysOfWeek = [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سه‌شنبه',
    'چهارشنبه',
    'پنجشنبه',
    'جمعه'
  ];

  useEffect(() => {
    fetchSchedules();
    fetchClasses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [schedules, searchQuery, selectedClass, selectedDay]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      alert('خطا در دریافت برنامه‌ریزی');
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

  const applyFilters = () => {
    let filtered = [...schedules];

    // فیلتر جستجو
    if (searchQuery) {
      filtered = filtered.filter(schedule =>
        schedule.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.class.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فیلتر کلاس
    if (selectedClass !== 'all') {
      filtered = filtered.filter(schedule => schedule.classId === selectedClass);
    }

    // فیلتر روز
    if (selectedDay !== 'all') {
      filtered = filtered.filter(schedule => schedule.day === selectedDay);
    }

    setFilteredSchedules(filtered);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('آیا از حذف این برنامه مطمئن هستید؟')) return;

    try {
      await api.delete(`/schedules/${scheduleId}`);
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
      alert('✅ برنامه با موفقیت حذف شد');
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      alert(`خطا در حذف برنامه: ${error.response?.data?.message || error.message}`);
    }
  };

  const activeFiltersCount = [
    searchQuery,
    selectedClass !== 'all',
    selectedDay !== 'all'
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedClass('all');
    setSelectedDay('all');
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

  const formatTime = (time: string) => {
    // تبدیل زمان از فرمت 24 ساعته به 12 ساعته
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'ب.ظ' : 'ق.ظ';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">برنامه‌ریزی درسی</h1>
          <p className="text-muted-foreground">
            مدیریت برنامه هفتگی کلاس‌ها
          </p>
        </div>
        <Button onClick={() => window.open('/dashboard/schedule/create', '_blank')}>
          <Plus className="h-4 w-4 ml-2" />
          افزودن برنامه جدید
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فیلتر و جستجو
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="mr-2">
                  {activeFiltersCount} فیلتر فعال
                </Badge>
              )}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                پاک کردن فیلترها
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* جستجو */}
            <div className="space-y-2">
              <Label>جستجو</Label>
              <Input
                placeholder="درس یا کلاس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* فیلتر کلاس */}
            <div className="space-y-2">
              <Label>کلاس</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="همه کلاس‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه کلاس‌ها</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} (پایه {cls.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* فیلتر روز */}
            <div className="space-y-2">
              <Label>روز هفته</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="همه روزها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه روزها</SelectItem>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            برنامه هفتگی
            <Badge variant="outline" className="mr-2">
              {filteredSchedules.length} برنامه
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">در حال بارگذاری برنامه‌ها...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ برنامه‌ای یافت نشد</h3>
              <p className="text-muted-foreground mb-4">
                {activeFiltersCount > 0 
                  ? 'با فیلترهای فعلی هیچ برنامه‌ای مطابقت ندارد.' 
                  : 'هنوز هیچ برنامه‌ای در سیستم ثبت نشده است.'
                }
              </p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={resetFilters}>
                  پاک کردن فیلترها
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>کلاس</TableHead>
                    <TableHead>روز</TableHead>
                    <TableHead>درس</TableHead>
                    <TableHead>ساعت</TableHead>
                    <TableHead>مدت زمان</TableHead>
                    <TableHead className="w-[120px]">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => {
                    const startTime = new Date(`2000-01-01T${schedule.startTime}`);
                    const endTime = new Date(`2000-01-01T${schedule.endTime}`);
                    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // مدت به دقیقه
                    
                    return (
                      <TableRow key={schedule.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <School className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{schedule.class.name}</div>
                              <div className="text-sm text-muted-foreground">
                                پایه {schedule.class.grade}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDayBadgeVariant(schedule.day)}>
                            {schedule.day}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline">
                              {schedule.subject}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {duration} دقیقه
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/dashboard/schedule/edit/${schedule.id}`, '_blank')}
                              title="ویرایش برنامه"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              title="حذف برنامه"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View by Day */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            نمای روزانه
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daysOfWeek.map(day => {
              const daySchedules = filteredSchedules.filter(s => s.day === day);
              
              return (
                <Card key={day} className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{day}</span>
                      <Badge variant={getDayBadgeVariant(day)}>
                        {daySchedules.length} کلاس
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {daySchedules.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        هیچ برنامه‌ای برای این روز ثبت نشده است
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {daySchedules
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map(schedule => (
                            <div key={schedule.id} className="p-3 border rounded-lg bg-gray-50">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium">{schedule.class.name}</div>
                                <Badge variant="outline" className="text-xs">
                                  پایه {schedule.class.grade}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mb-1">
                                {schedule.subject}
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                                <Badge variant="secondary">
                                  {((new Date(`2000-01-01T${schedule.endTime}`).getTime() - new Date(`2000-01-01T${schedule.startTime}`).getTime()) / (1000 * 60))} دقیقه
                                </Badge>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}