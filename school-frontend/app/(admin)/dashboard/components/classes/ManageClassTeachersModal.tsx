// app/(admin)/dashboard/classes/components/ManageClassTeachersModal.tsx
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

interface Teacher {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  classes?: Array<{
    id: string;
    name: string;
  }>;
}

interface ManageClassTeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  onTeachersUpdate: () => void;
}

export default function ManageClassTeachersModal({
  isOpen,
  onClose,
  classId,
  className,
  onTeachersUpdate
}: ManageClassTeachersModalProps) {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [classTeachers, setClassTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // دریافت تمام معلمان و معلمان کلاس
  const fetchTeachers = async () => {
    if (!classId) return;

    try {
      setLoading(true);
      
      // دریافت تمام معلمان سیستم
      const allTeachersResponse = await api.get('/admin/teachers/list');
      setAllTeachers(allTeachersResponse.data);

      // دریافت معلمان این کلاس خاص
      const classResponse = await api.get(`/admin/classes/${classId}`);
      setClassTeachers(classResponse.data.teachers || []);

    } catch (error) {
      console.error('Error fetching teachers:', error);
      alert('خطا در دریافت اطلاعات معلمان');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && classId) {
      fetchTeachers();
      setSearchQuery('');
    }
  }, [isOpen, classId]);

  // فیلتر معلمان بر اساس جستجو
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeachers(allTeachers);
    } else {
      const filtered = allTeachers.filter(teacher =>
        teacher.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  }, [searchQuery, allTeachers]);

  // اضافه کردن معلم به کلاس
  const handleAddTeacher = async (teacherId: string) => {
    setActionLoading(`add-${teacherId}`);
    
    try {
      await api.post(`/admin/classes/${classId}/teachers/${teacherId}`);
      
      // بروزرسانی لیست‌ها
      const addedTeacher = allTeachers.find(t => t.id === teacherId);
      if (addedTeacher) {
        setClassTeachers(prev => [...prev, addedTeacher]);
      }
      
      alert('✅ معلم با موفقیت به کلاس اضافه شد');
      onTeachersUpdate();
    } catch (error: any) {
      console.error('Error adding teacher to class:', error);
      alert(`خطا در اضافه کردن معلم: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // حذف معلم از کلاس
  const handleRemoveTeacher = async (teacherId: string) => {
    if (!confirm('آیا از حذف این معلم از کلاس مطمئن هستید؟')) return;

    setActionLoading(`remove-${teacherId}`);
    
    try {
      await api.delete(`/admin/classes/${classId}/teachers/${teacherId}`);

      // بروزرسانی لیست‌ها
      setClassTeachers(prev => prev.filter(t => t.id !== teacherId));
      
      alert('✅ معلم با موفقیت از کلاس حذف شد');
      onTeachersUpdate();
    } catch (error: any) {
      console.error('Error removing teacher from class:', error);
      alert(`خطا در حذف معلم: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // بررسی اینکه معلم در این کلاس هست یا نه
  const isTeacherInClass = (teacherId: string) => {
    return classTeachers.some(t => t.id === teacherId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            مدیریت معلمان کلاس
            <Badge variant="secondary">{className}</Badge>
          </DialogTitle>
          <DialogDescription>
            اضافه کردن و حذف معلمان از کلاس {className}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلمان فعلی کلاس */}
          <div className="space-y-4">
            <Label>معلمان فعلی کلاس ({classTeachers.length} نفر)</Label>
            {classTeachers.length === 0 ? (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  هنوز معلمی به این کلاس اضافه نشده است
                </AlertDescription>
              </Alert>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام معلم</TableHead>
                      <TableHead>نام کاربری</TableHead>
                      <TableHead className="w-[100px]">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">
                          {teacher.user.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {teacher.user.username}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveTeacher(teacher.id)}
                            disabled={!!(actionLoading === `remove-${teacher.id}`)}
                          >
                            {actionLoading === `remove-${teacher.id}` ? (
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

          {/* جستجو و اضافه کردن معلمان جدید */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>جستجو و اضافه کردن معلمان</Label>
              <div className="text-sm text-muted-foreground">
                {filteredTeachers.length} معلم یافت شد
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

            {/* لیست معلمان */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">در حال دریافت معلمان...</p>
              </div>
            ) : (
              <div className="border rounded-md max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام معلم</TableHead>
                      <TableHead>نام کاربری</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="w-[100px]">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => {
                      const inThisClass = isTeacherInClass(teacher.id);
                      
                      return (
                        <TableRow key={teacher.id} className={inThisClass ? 'bg-green-50' : ''}>
                          <TableCell className="font-medium">
                            {teacher.user.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {teacher.user.username}
                          </TableCell>
                          <TableCell>
                            {inThisClass ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 ml-1" />
                                تدریس در این کلاس
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
                                  ? handleRemoveTeacher(teacher.id)
                                  : handleAddTeacher(teacher.id)
                              }
                              disabled={!!(
                                actionLoading === `add-${teacher.id}` ||
                                actionLoading === `remove-${teacher.id}`
                              )}
                            >
                              {(actionLoading === `add-${teacher.id}` || actionLoading === `remove-${teacher.id}`) ? (
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
                
                {filteredTeachers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'معلمی با مشخصات جستجو شده یافت نشد' : 'هیچ معلمی در سیستم ثبت نشده است'}
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