// app/(admin)/dashboard/grades/create/page.tsx
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
  BookOpen, 
  User,
  School,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';

interface Student {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  class?: {
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
  students?: Student[];
  teachers?: Array<{
    id: string;
    user: {
      id: string;
      name: string;
    };
  }>;
}

export default function CreateGradePage() {
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    value: ''
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const router = useRouter();

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
    'ورزش'
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('خطا در دریافت لیست کلاس‌ها');
    }
  };

  const fetchClassStudents = async (classId: string) => {
    try {
      setStudentsLoading(true);
      const response = await api.get(`/admin/classes/${classId}`);
      const classData = response.data;
      
      setStudents(classData.students || []);
      setFilteredStudents(classData.students || []);
      
      // تنظیم دروس بر اساس معلمان کلاس
      updateAvailableSubjects(classData);
      
    } catch (error) {
      console.error('Error fetching class students:', error);
      alert('خطا در دریافت دانش‌آموزان کلاس');
    } finally {
      setStudentsLoading(false);
    }
  };

  const updateAvailableSubjects = (classData: Class) => {
    // اگر کلاس معلم دارد، از دروس تخصصی آنها استفاده کن
    if (classData.teachers && classData.teachers.length > 0) {
      // می‌توانید این منطق را بر اساس معلمان توسعه دهید
      setAvailableSubjects(defaultSubjects);
    } else {
      setAvailableSubjects(defaultSubjects);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.subject || !formData.value) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    const gradeValue = parseFloat(formData.value);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 20) {
      alert('نمره باید بین 0 تا 20 باشد');
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Creating grade:', {
        studentId: formData.studentId,
        subject: formData.subject,
        value: gradeValue
      });

      const response = await api.post('/grades', {
        studentId: formData.studentId,
        subject: formData.subject,
        value: gradeValue
      });

      console.log('✅ Grade created:', response.data);
      
      alert('✅ نمره با موفقیت ثبت شد!');
      
      // بازگشت به صفحه قبل یا پاک کردن فرم
      router.push('/dashboard/grades');
      
    } catch (error: any) {
      console.error('❌ Error creating grade:', error);
      alert(`خطا در ثبت نمره: ${error.response?.data?.message || error.message}`);
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

  const getSelectedStudent = () => {
    return students.find(s => s.id === formData.studentId);
  };

  const getSelectedClass = () => {
    return classes.find(c => c.id === selectedClass);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ثبت نمره جدید</h1>
        <p className="text-muted-foreground">
          اطلاعات نمره جدید را وارد کنید
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            فرم ثبت نمره
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* انتخاب کلاس */}
            <div className="space-y-2">
              <Label htmlFor="class">کلاس *</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
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
            {selectedClass && (
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

            {/* انتخاب دانش‌آموز */}
            <div className="space-y-2">
              <Label htmlFor="student">دانش‌آموز *</Label>
              {!selectedClass ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    لطفاً ابتدا یک کلاس انتخاب کنید
                  </AlertDescription>
                </Alert>
              ) : studentsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">در حال دریافت دانش‌آموزان...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <User className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    این کلاس هیچ دانش‌آموزی ندارد
                  </AlertDescription>
                </Alert>
              ) : (
                <Select 
                  value={formData.studentId} 
                  onValueChange={(value) => handleChange('studentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دانش‌آموز" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {student.user.name}
                          <span className="text-xs text-muted-foreground">
                            ({student.user.username})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* اطلاعات دانش‌آموز انتخاب شده */}
            {formData.studentId && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  دانش‌آموز انتخاب شده: <strong>{getSelectedStudent()?.user.name}</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* درس و نمره */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* نمره */}
              <div className="space-y-2">
                <Label htmlFor="value">نمره *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                  required
                  placeholder="مثلاً ۱۷.۵"
                />
                <p className="text-xs text-muted-foreground">
                  عدد بین ۰ تا ۲۰ (می‌توانید از اعشار استفاده کنید)
                </p>
              </div>
            </div>

            {/* پیش‌نمایش نمره */}
            {(formData.value && !isNaN(parseFloat(formData.value))) && (
              <Alert className={
                parseFloat(formData.value) >= 17 ? 'bg-green-50 border-green-200' :
                parseFloat(formData.value) >= 14 ? 'bg-blue-50 border-blue-200' :
                parseFloat(formData.value) >= 10 ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <span>نمره پیش‌نمایش:</span>
                    <Badge className={
                      parseFloat(formData.value) >= 17 ? 'bg-green-100 text-green-800' :
                      parseFloat(formData.value) >= 14 ? 'bg-blue-100 text-blue-800' :
                      parseFloat(formData.value) >= 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {parseFloat(formData.value).toFixed(1)}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* خلاصه اطلاعات */}
            {(selectedClass && formData.studentId && formData.subject && formData.value) && (
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm">خلاصه اطلاعات نمره</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>کلاس:</span>
                    <span className="font-medium">{getSelectedClass()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>دانش‌آموز:</span>
                    <span className="font-medium">{getSelectedStudent()?.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>درس:</span>
                    <span className="font-medium">{formData.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>نمره:</span>
                    <span className="font-medium">{parseFloat(formData.value).toFixed(1)}</span>
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
                  !selectedClass || 
                  !formData.studentId || 
                  !formData.subject || 
                  !formData.value
                }
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    در حال ثبت...
                  </>
                ) : (
                  <>
                    ثبت نمره
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