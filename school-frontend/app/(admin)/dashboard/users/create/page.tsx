// app/(admin)/dashboard/users/create/page.tsx
'use client';

import { useState, useEffect } from 'react'; // useEffect رو اضافه کردم
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
import { ArrowRight, UserPlus } from 'lucide-react';
import api from '@/lib/api';

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    nationalId: '',
    name: '',
    username: '',
    password: '',
    role: 'STUDENT',
    classId: '',
  });
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // استفاده از useEffect به جای useState
  useEffect(() => {
    if (formData.role === 'STUDENT') {
      fetchClasses();
    }
  }, [formData.role]); // وابسته به role

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/admin/users', {
        ...formData,
        classId: formData.role === 'STUDENT' ? formData.classId : undefined,
      });
      
      alert('✅ کاربر با موفقیت ایجاد شد!');
      router.push('/dashboard/users');
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(`❌ خطا در ایجاد کاربر: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ایجاد کاربر جدید</h1>
        <p className="text-muted-foreground">
          اطلاعات کاربر جدید را وارد کنید
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            فرم ایجاد کاربر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* کد ملی */}
              <div className="space-y-2">
                <Label htmlFor="nationalId">کد ملی</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => handleChange('nationalId', e.target.value)}
                  required
                  placeholder="مثلاً 1234567890"
                />
              </div>

              {/* نام کامل */}
              <div className="space-y-2">
                <Label htmlFor="name">نام کامل</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  placeholder="مثلاً امیر حسینی"
                />
              </div>

              {/* نام کاربری */}
              <div className="space-y-2">
                <Label htmlFor="username">نام کاربری</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                  placeholder="مثلاً amir123"
                />
              </div>

              {/* رمز عبور */}
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  placeholder="رمز دلخواه"
                />
              </div>

              {/* نقش */}
              <div className="space-y-2">
                <Label htmlFor="role">نقش کاربر</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب نقش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">دانش‌آموز</SelectItem>
                    <SelectItem value="TEACHER">معلم</SelectItem>
                    <SelectItem value="PARENT">والد</SelectItem>
                    <SelectItem value="ADMIN">مدیر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* کلاس (فقط برای دانش‌آموز) */}
              {formData.role === 'STUDENT' && (
                <div className="space-y-2">
                  <Label htmlFor="classId">کلاس</Label>
                  <Select 
                    value={formData.classId} 
                    onValueChange={(value) => handleChange('classId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کلاس" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* اضافه کردن یک آیتم خالی با value غیرخالی */}
                      <SelectItem value="not-selected">-- انتخاب کلاس --</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                بازگشت
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'در حال ایجاد...' : 'ایجاد کاربر'}
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}