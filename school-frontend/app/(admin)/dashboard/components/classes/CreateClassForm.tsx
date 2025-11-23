// components/classes/CreateClassForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight, 
  School, 
  Users, 
  Plus,
  X,
  Search
} from 'lucide-react';

import api from '@/lib/api';
import { createClass } from '@/services/adminService';

interface Teacher {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
}

export default function CreateClassForm() {
  const [formData, setFormData] = useState({
    name: '',
    grade: 1,
    teacherIds: [] as string[],
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [teacherSelectionOpen, setTeacherSelectionOpen] = useState(false);
  const router = useRouter();

  // دریافت لیست معلمان
  const fetchTeachers = async () => {
    try {
      setTeachersLoading(true);
      const response = await api.get('/admin/teachers/list');
      setTeachers(response.data);
      setFilteredTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      alert('خطا در دریافت لیست معلمان');
    } finally {
      setTeachersLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // فیلتر معلمان بر اساس جستجو
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher =>
        teacher.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  }, [searchQuery, teachers]);

  // اضافه کردن معلم به لیست
  const handleAddTeacher = (teacherId: string) => {
    if (!formData.teacherIds.includes(teacherId)) {
      setFormData(prev => ({
        ...prev,
        teacherIds: [...prev.teacherIds, teacherId]
      }));
    }
    setSearchQuery('');
  };

  // حذف معلم از لیست
  const handleRemoveTeacher = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      teacherIds: prev.teacherIds.filter(id => id !== teacherId)
    }));
  };

  // ارسال فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('📤 Creating class:', formData);
      
      const response = await createClass(formData);
      
      console.log('✅ Class created:', response.data);
      alert('✅ کلاس با موفقیت ایجاد شد!');
      router.push('/dashboard/classes');
    } catch (error: any) {
      console.error('❌ Error creating class:', error);
      alert(`خطا در ایجاد کلاس: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // دریافت نام معلم بر اساس ID
  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.user.name : 'نامشخص';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            فرم ایجاد کلاس جدید
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اطلاعات پایه کلاس */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* نام کلاس */}
              <div className="space-y-2">
                <Label htmlFor="name">نام کلاس</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="مثلاً کلاس ۱-۱"
                />
              </div>

              {/* پایه تحصیلی */}
              <div className="space-y-2">
                <Label htmlFor="grade">پایه تحصیلی</Label>
                <Select 
                  value={formData.grade.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, grade: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب پایه" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        پایه {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* انتخاب معلمان */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>معلمان کلاس</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTeacherSelectionOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  افزودن معلم
                </Button>
              </div>

              {/* لیست معلمان انتخاب شده */}
              {formData.teacherIds.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50">
                  {formData.teacherIds.map(teacherId => (
                    <Badge 
                      key={teacherId} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getTeacherName(teacherId)}
                      <button
                        type="button"
                        onClick={() => handleRemoveTeacher(teacherId)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md bg-gray-50">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">هیچ معلمی انتخاب نشده است</p>
                </div>
              )}
            </div>

            {/* خلاصه اطلاعات */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 text-sm">خلاصه اطلاعات کلاس</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-700 space-y-2">
                <div className="flex justify-between">
                  <span>نام کلاس:</span>
                  <span className="font-medium">{formData.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>پایه تحصیلی:</span>
                  <span className="font-medium">{formData.grade ? `پایه ${formData.grade}` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>تعداد معلمان:</span>
                  <span className="font-medium">{formData.teacherIds.length} نفر</span>
                </div>
              </CardContent>
            </Card>

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
                disabled={loading || !formData.name}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    در حال ایجاد...
                  </>
                ) : (
                  <>
                    ایجاد کلاس
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* مودال انتخاب معلمان */}
      <Dialog open={teacherSelectionOpen} onOpenChange={setTeacherSelectionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              انتخاب معلمان
            </DialogTitle>
            <DialogDescription>
              معلمان مورد نظر برای تدریس در این کلاس را انتخاب کنید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* جستجوی معلمان */}
            <div className="space-y-2">
              <Label htmlFor="teacherSearch">جستجوی معلمان</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="teacherSearch"
                  placeholder="جستجو بر اساس نام یا نام کاربری..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>

            {/* لیست معلمان */}
            <div className="space-y-2">
              <Label>لیست معلمان</Label>
              {teachersLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">در حال دریافت لیست معلمان...</p>
                </div>
              ) : filteredTeachers.length === 0 ? (
                <div className="text-center py-4 border rounded-md">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'معلمی با مشخصات جستجو شده یافت نشد' : 'هیچ معلمی در سیستم ثبت نشده است'}
                  </p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {filteredTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        formData.teacherIds.includes(teacher.id) ? 'bg-green-50 border-green-200' : ''
                      }`}
                      onClick={() => {
                        if (formData.teacherIds.includes(teacher.id)) {
                          handleRemoveTeacher(teacher.id);
                        } else {
                          handleAddTeacher(teacher.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={formData.teacherIds.includes(teacher.id)}
                          onCheckedChange={() => {
                            if (formData.teacherIds.includes(teacher.id)) {
                              handleRemoveTeacher(teacher.id);
                            } else {
                              handleAddTeacher(teacher.id);
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{teacher.user.name}</p>
                          <p className="text-sm text-muted-foreground">{teacher.user.username}</p>
                        </div>
                        {formData.teacherIds.includes(teacher.id) && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            انتخاب شده
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <span className="text-sm text-muted-foreground">
              {formData.teacherIds.length} معلم انتخاب شده
            </span>
            <Button onClick={() => setTeacherSelectionOpen(false)}>
              تأیید و بستن
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}