// app/(admin)/dashboard/classes/page.tsx (نسخه جدید)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  School, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  User,
  UserPlus,
  UserMinus,
  GraduationCap
} from 'lucide-react';
import { deleteClass, getClasses } from '@/services/adminService';
import ManageClassStudentsModal from '../components/classes/ManageClassStudentsModal';
import ManageClassTeachersModal from '../components/classes/ManageClassTeachersModal';


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
  students?: Array<{
    id: string;
    user: {
      id: string;
      name: string;
    };
  }>;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [manageStudentsModal, setManageStudentsModal] = useState({
    isOpen: false,
    classId: '',
    className: ''
  });
  const [manageTeachersModal, setManageTeachersModal] = useState({
  isOpen: false,
  classId: '',
  className: ''
});

  const router = useRouter();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('خطا در دریافت لیست کلاس‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId: string) => {
    if (!confirm('آیا از حذف این کلاس مطمئن هستید؟ این عمل تمام ارتباطات کلاس را حذف خواهد کرد.')) return;

    try {
      await deleteClass(classId);
      setClasses(classes.filter(cls => cls.id !== classId));
      alert('✅ کلاس با موفقیت حذف شد');
    } catch (error: any) {
      console.error('Error deleting class:', error);
      alert(`خطا در حذف کلاس: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleManageTeachers = (classId: string, className: string) => {
  setManageTeachersModal({
    isOpen: true,
    classId,
    className
  });
};
const handleTeachersUpdate = () => {
  fetchClasses(); // بروزرسانی لیست کلاس‌ها
};

  const handleManageStudents = (classId: string, className: string) => {
    setManageStudentsModal({
      isOpen: true,
      classId,
      className
    });
  };

  const handleStudentsUpdate = () => {
    fetchClasses(); // بروزرسانی لیست کلاس‌ها
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مدیریت کلاس‌ها</h1>
          <p className="text-muted-foreground">
            مشاهده و مدیریت تمام کلاس‌های آموزشی
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/classes/create')}>
          <Plus className="h-4 w-4 ml-2" />
          ایجاد کلاس جدید
        </Button>
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            لیست کلاس‌ها
            <Badge variant="outline" className="mr-2">
              {classes.length} کلاس
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">در حال بارگذاری کلاس‌ها...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-8">
              <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ کلاسی یافت نشد</h3>
              <p className="text-muted-foreground mb-4">
                هنوز هیچ کلاسی در سیستم ثبت نشده است
              </p>
              <Button onClick={() => router.push('/dashboard/classes/create')}>
                ایجاد اولین کلاس
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نام کلاس</TableHead>
                    <TableHead>پایه تحصیلی</TableHead>
                    <TableHead>معلمان</TableHead>
                    <TableHead>دانش‌آموزان</TableHead>
                    <TableHead className="w-[300px]">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          پایه {cls.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cls.teachers && cls.teachers.length > 0 ? (
                            cls.teachers.map(teacher => (
                              <Badge key={teacher.id} variant="outline" className="text-xs">
                                <User className="h-3 w-3 ml-1" />
                                {teacher.user.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">بدون معلم</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {cls.students?.length || 0} دانش‌آموز
                          </span>
                        </div>
                      </TableCell>
                            <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleManageStudents(cls.id, cls.name)}
            className="flex items-center gap-1"
            title="مدیریت دانش‌آموزان"
          >
            <UserPlus className="h-4 w-4" />
            دانش‌آموزان
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleManageTeachers(cls.id, cls.name)}
            className="flex items-center gap-1"
            title="مدیریت معلمان"
          >
            <GraduationCap className="h-4 w-4" />
            معلمان
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/classes/edit/${cls.id}`)}
            title="ویرایش کلاس"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(cls.id)}
            title="حذف کلاس"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* مودال مدیریت دانش‌آموزان */}
      <ManageClassStudentsModal
        isOpen={manageStudentsModal.isOpen}
        onClose={() => setManageStudentsModal({ isOpen: false, classId: '', className: '' })}
        classId={manageStudentsModal.classId}
        className={manageStudentsModal.className}
        onStudentsUpdate={handleStudentsUpdate}
      />
      <ManageClassTeachersModal
  isOpen={manageTeachersModal.isOpen}
  onClose={() => setManageTeachersModal({ isOpen: false, classId: '', className: '' })}
  classId={manageTeachersModal.classId}
  className={manageTeachersModal.className}
  onTeachersUpdate={handleTeachersUpdate}
/>
    </div>
  );
}