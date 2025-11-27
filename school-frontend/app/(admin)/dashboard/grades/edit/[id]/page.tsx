// app/(admin)/dashboard/grades/edit/[id]/page.tsx - اصلاح شده
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
  BookOpen, 
  User,
  School,
  AlertCircle,
  CheckCircle2,
  Save,
  RotateCcw
} from 'lucide-react';
import api from '@/lib/api';

interface Grade {
  id: string;
  studentId: string;
  subject: string;
  value: number;
  createdAt: string;
  student: {
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
  };
}

export default function EditGradePage() {
  const params = useParams();
  const gradeId = params.id as string;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    subject: '',
    value: ''
  });
  const [originalGrade, setOriginalGrade] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

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
    if (gradeId) {
      fetchGradeData();
    }
  }, [gradeId]);

  const fetchGradeData = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Fetching grade with ID:', gradeId);
      
      // روش ۱: ابتدا همه نمرات رو بگیر و فیلتر کن
      const allGradesResponse = await api.get('/grades');
      console.log('📋 All grades response:', allGradesResponse.data);
      
      const allGrades = Array.isArray(allGradesResponse.data) ? allGradesResponse.data : [];
      const specificGrade = allGrades.find((g: Grade) => g.id === gradeId);
      
      if (!specificGrade) {
        // روش ۲: اگر پیدا نشد، از endpoint دانش‌آموز استفاده کن
        console.log('🔍 Grade not found in all grades, trying alternative method...');
        throw new Error('نمره مورد نظر یافت نشد');
      }

      console.log('✅ Found grade:', specificGrade);
      
      setOriginalGrade(specificGrade);
      setFormData({
        subject: specificGrade.subject,
        value: specificGrade.value.toString()
      });

      setAvailableSubjects(defaultSubjects);

    } catch (error: any) {
      console.error('❌ Error fetching grade data:', error);
      
      // نمایش اطلاعات بیشتر برای دیباگ
      console.log('🔍 Debug info:', {
        gradeId,
        errorMessage: error.message,
        response: error.response?.data
      });
      
      alert(`خطا در دریافت اطلاعات نمره: ${error.message}`);
      router.push('/dashboard/grades');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.value) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    const gradeValue = parseFloat(formData.value);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 20) {
      alert('نمره باید بین 0 تا 20 باشد');
      return;
    }

    setUpdating(true);

    try {
      console.log('📤 Updating grade:', {
        gradeId,
        subject: formData.subject,
        value: gradeValue
      });

      const response = await api.patch(`/grades/${gradeId}`, {
        subject: formData.subject,
        value: gradeValue
      });

      console.log('✅ Grade updated:', response.data);
      
      alert('✅ نمره با موفقیت ویرایش شد!');
      router.push('/dashboard/grades');
      
    } catch (error: any) {
      console.error('❌ Error updating grade:', error);
      alert(`خطا در ویرایش نمره: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleReset = () => {
    if (originalGrade) {
      setFormData({
        subject: originalGrade.subject,
        value: originalGrade.value.toString()
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getGradeColor = (value: number) => {
    if (value >= 17) return 'bg-green-100 text-green-800';
    if (value >= 14) return 'bg-blue-100 text-blue-800';
    if (value >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const hasChanges = () => {
    if (!originalGrade) return false;
    
    return (
      formData.subject !== originalGrade.subject ||
      parseFloat(formData.value) !== originalGrade.value
    );
  };

  // روش جایگزین: استفاده از endpoint مستقیم
  const fetchGradeDirectly = async () => {
    try {
      // این متد رو امتحان کن اگر endpoint مستقیم داریم
      const response = await api.get(`/grades/${gradeId}`);
      return response.data;
    } catch (error) {
      console.log('Direct endpoint not available');
      return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">در حال دریافت اطلاعات نمره...</p>
        </div>
      </div>
    );
  }

  if (!originalGrade) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            نمره مورد نظر یافت نشد. ممکن است حذف شده باشد یا شناسه نامعتبر باشد.
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/dashboard/grades')}>
            بازگشت به لیست نمرات
          </Button>
          <Button variant="outline" onClick={fetchGradeData}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ویرایش نمره</h1>
        <p className="text-muted-foreground">
          اطلاعات نمره را ویرایش کنید
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            فرم ویرایش نمره
            {hasChanges() && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                تغییرات ذخیره نشده
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اطلاعات ثابت (غیرقابل ویرایش) */}
            <div className="space-y-4">
              <Label>اطلاعات ثابت</Label>
              
              {/* دانش‌آموز */}
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">دانش‌آموز:</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{originalGrade.student.user.name}</span>
                  <Badge variant="outline">
                    {originalGrade.student.user.username}
                  </Badge>
                </div>
              </div>

              {/* کلاس */}
              {originalGrade.student.class && (
                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <School className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">کلاس:</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{originalGrade.student.class.name}</span>
                    <Badge variant="outline">
                      پایه {originalGrade.student.class.grade}
                    </Badge>
                  </div>
                </div>
              )}

              {/* تاریخ ثبت */}
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">تاریخ ثبت:</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{new Date(originalGrade.createdAt).toLocaleDateString('fa-IR')}</span>
                  <Badge variant="outline">
                    {new Date(originalGrade.createdAt).toLocaleTimeString('fa-IR')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* اطلاعات قابل ویرایش */}
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

            {/* مقایسه تغییرات به وجود اومده */}
            {hasChanges() && originalGrade && (
              <Alert className="bg-blue-50 border-blue-200">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>درس:</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="line-through text-red-600">
                          {originalGrade.subject}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-blue-600" />
                        <Badge variant="default">
                          {formData.subject}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>نمره:</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`line-through text-red-600 ${getGradeColor(originalGrade.value)}`}
                        >
                          {originalGrade.value.toFixed(1)}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-blue-600" />
                        <Badge className={getGradeColor(parseFloat(formData.value))}>
                          {parseFloat(formData.value).toFixed(1)}
                        </Badge>
                      </div>
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
                  !formData.subject || 
                  !formData.value ||
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