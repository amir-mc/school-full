// app/(admin)/dashboard/classes/components/ManageClassStudentsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  UserPlus, 
  UserMinus, 
  Users,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';

interface Student {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  classId: string | null;
  parent?: {
    user: {
      name: string;
    };
  };
}

interface ManageClassStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  onStudentsUpdate: () => void;
}

export default function ManageClassStudentsModal({
  isOpen,
  onClose,
  classId,
  className,
  onStudentsUpdate
}: ManageClassStudentsModalProps) {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // دریافت تمام دانش‌آموزان و دانش‌آموزان کلاس
  const fetchStudents = async () => {
    if (!classId) return;

    try {
      setLoading(true);
      
      // دریافت تمام دانش‌آموزان سیستم
      const allStudentsResponse = await api.get('/admin/students');
      setAllStudents(allStudentsResponse.data);

      // دریافت دانش‌آموزان این کلاس خاص
      const classResponse = await api.get(`/admin/classes/${classId}`);
      setClassStudents(classResponse.data.students || []);

    } catch (error) {
      console.error('Error fetching students:', error);
      alert('خطا در دریافت اطلاعات دانش‌آموزان');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && classId) {
      fetchStudents();
      setSearchQuery('');
    }
  }, [isOpen, classId]);

  // فیلتر دانش‌آموزان بر اساس جستجو
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(allStudents);
    } else {
      const filtered = allStudents.filter(student =>
        student.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, allStudents]);

  // اضافه کردن دانش‌آموز به کلاس
  const handleAddStudent = async (studentId: string) => {
    setActionLoading(`add-${studentId}`);
    
    try {
      await api.post(`/admin/classes/${classId}/students/${studentId}`);
      
      // بروزرسانی لیست‌ها
      const updatedAllStudents = allStudents.map(s => 
        s.id === studentId ? { ...s, classId } : s
      );
      setAllStudents(updatedAllStudents);
      
      const addedStudent = allStudents.find(s => s.id === studentId);
      if (addedStudent) {
        setClassStudents(prev => [...prev, addedStudent]);
      }
      
      alert('✅ دانش‌آموز با موفقیت به کلاس اضافه شد');
    } catch (error: any) {
      console.error('Error adding student to class:', error);
      alert(`خطا در اضافه کردن دانش‌آموز: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // حذف دانش‌آموز از کلاس
  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm('آیا از حذف این دانش‌آموز از کلاس مطمئن هستید؟')) return;

    setActionLoading(`remove-${studentId}`);
    
    try {
      // استفاده از API برای به‌روزرسانی classId دانش‌آموز به null
      await api.patch(`/admin/students/${studentId}`, {
        classId: null
      });

      // بروزرسانی لیست‌ها
      const updatedAllStudents = allStudents.map(s => 
        s.id === studentId ? { ...s, classId: null } : s
      );
      setAllStudents(updatedAllStudents);
      setClassStudents(prev => prev.filter(s => s.id !== studentId));
      
      alert('✅ دانش‌آموز با موفقیت از کلاس حذف شد');
      onStudentsUpdate();
    } catch (error: any) {
      console.error('Error removing student from class:', error);
      alert(`خطا در حذف دانش‌آموز: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // بررسی اینکه دانش‌آموز در این کلاس هست یا نه
  const isStudentInClass = (studentId: string) => {
    return classStudents.some(s => s.id === studentId);
  };

  // دانش‌آموزانی که در کلاس دیگری هستند
  const isStudentInOtherClass = (student: Student) => {
    return student.classId && student.classId !== classId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            مدیریت دانش‌آموزان کلاس
            <Badge variant="secondary">{className}</Badge>
          </DialogTitle>
          <DialogDescription>
            اضافه کردن و حذف دانش‌آموزان از کلاس {className}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* دانش‌آموزان فعلی کلاس */}
          <div className="space-y-4">
            <Label>دانش‌آموزان فعلی کلاس ({classStudents.length} نفر)</Label>
            {classStudents.length === 0 ? (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  هنوز دانش‌آموزی به این کلاس اضافه نشده است
                </AlertDescription>
              </Alert>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام دانش‌آموز</TableHead>
                      <TableHead>نام کاربری</TableHead>
                      <TableHead>والد</TableHead>
                      <TableHead className="w-[100px]">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.user.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {student.user.username}
                        </TableCell>
                        <TableCell>
                          {student.parent ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {student.parent.user.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              بدون والد
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveStudent(student.id)}
                            disabled={actionLoading === `remove-${student.id}`}
                          >
                            {actionLoading === `remove-${student.id}` ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              <UserMinus className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* جستجو و اضافه کردن دانش‌آموزان جدید */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>جستجو و اضافه کردن دانش‌آموزان</Label>
              <div className="text-sm text-muted-foreground">
                {filteredStudents.length} دانش‌آموز found
              </div>
            </div>

            {/* جستجو */}
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس نام یا نام کاربری..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>

            {/* لیست دانش‌آموزان */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">در حال دریافت دانش‌آموزان...</p>
              </div>
            ) : (
              <div className="border rounded-md max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام دانش‌آموز</TableHead>
                      <TableHead>نام کاربری</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="w-[100px]">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const inThisClass = isStudentInClass(student.id);
                      const inOtherClass = isStudentInOtherClass(student);
                      
                      return (
                        <TableRow key={student.id} className={
                          inThisClass ? 'bg-green-50' : 
                          inOtherClass ? 'bg-gray-100' : ''
                        }>
                          <TableCell className="font-medium">
                            {student.user.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {student.user.username}
                          </TableCell>
                          <TableCell>
                            {inThisClass ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 ml-1" />
                                عضو این کلاس
                              </Badge>
                            ) : inOtherClass ? (
                              <Badge variant="outline" className="bg-gray-100">
                                عضو کلاس دیگر
                              </Badge>
                            ) : (
                              <Badge variant="outline">بدون کلاس</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                           <Button
                                        variant={inThisClass ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => 
                                            inThisClass 
                                            ? handleRemoveStudent(student.id)
                                            : handleAddStudent(student.id)
                                        }
                                        disabled={Boolean(
                                            actionLoading === `add-${student.id}` ||
                                            actionLoading === `remove-${student.id}` ||
                                            inOtherClass
                                        )}
                                        >
                                        {(actionLoading === `add-${student.id}` || actionLoading === `remove-${student.id}`) ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                        ) : inThisClass ? (
                                            <UserMinus className="h-4 w-4" />
                                        ) : (
                                            <UserPlus className="h-4 w-4" />
                                        )}
                                        </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'دانش‌آموزی با مشخصات جستجو شده یافت نشد' : 'هیچ دانش‌آموزی در سیستم ثبت نشده است'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}