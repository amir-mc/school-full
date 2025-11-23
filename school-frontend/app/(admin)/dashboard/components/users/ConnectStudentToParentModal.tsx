// components/users/ConnectStudentToParentModal.tsx (آپدیت شده)
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
import { Badge } from '@/components/ui/badge';
import { Link, User, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';

interface Parent {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
}

interface Student {
  id: string;
  userId: string;
  parentId: string | null;
  parent?: {
    id: string;
    user: {
      name: string;
      username: string;
    };
  };
  user: {
    id: string;
    name: string;
  };
}

interface ConnectStudentToParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentUserId: string;
  studentName: string;
  onSuccess: () => void;
}

export default function ConnectStudentToParentModal({
  isOpen,
  onClose,
  studentUserId,
  studentName,
  onSuccess
}: ConnectStudentToParentModalProps) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [studentRecordId, setStudentRecordId] = useState('');
  const [currentParent, setCurrentParent] = useState<Parent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // دریافت لیست والدین و دانش‌آموزان
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // دریافت والدین
      const parentsResponse = await api.get('/admin/parents/list');
      setParents(parentsResponse.data);
      setFilteredParents(parentsResponse.data);

      // دریافت دانش‌آموزان برای پیدا کردن studentId و والد فعلی
      const studentsResponse = await api.get('/admin/students');
      setStudents(studentsResponse.data);

      // پیدا کردن studentId بر اساس userId
      const studentRecord = studentsResponse.data.find(
        (s: Student) => s.userId === studentUserId
      );
      
      if (studentRecord) {
        setStudentRecordId(studentRecord.id);
        console.log('🎯 Found student record:', studentRecord);

        // اگر دانش‌آموز قبلاً به والدی متصل شده
        if (studentRecord.parentId) {
          const connectedParent = parentsResponse.data.find(
            (p: Parent) => p.id === studentRecord.parentId
          );
          if (connectedParent) {
            setCurrentParent(connectedParent);
            console.log('🔗 Student already connected to parent:', connectedParent);
          }
        }
      } else {
        console.error('❌ Student record not found for userId:', studentUserId);
        alert('رکورد دانش‌آموز یافت نشد');
        onClose();
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setSelectedParentId('');
      setSearchQuery('');
      setCurrentParent(null);
    }
  }, [isOpen]);

  // فیلتر والدین بر اساس جستجو
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredParents(parents);
    } else {
      const filtered = parents.filter(parent =>
        parent.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredParents(filtered);
    }
  }, [searchQuery, parents]);

  // تابع اتصال دانش‌آموز به والد
  const handleConnect = async () => {
    if (!selectedParentId) {
      alert('لطفاً یک والد انتخاب کنید');
      return;
    }

    if (!studentRecordId) {
      alert('رکورد دانش‌آموز یافت نشد');
      return;
    }

    // اگر دانش‌آموز قبلاً به والدی متصل شده، confirm بگیر
    if (currentParent) {
      const confirmed = confirm(
        `این دانش‌آموز قبلاً به والد "${currentParent.user.name}" متصل شده است. آیا می‌خواهید آن را به والد جدید تغییر دهید؟`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    
    try {
      console.log('📤 Connecting student to parent:', {
        studentId: studentRecordId,
        parentId: selectedParentId
      });

      const response = await api.post('/admin/students/assign-parent', {
        studentId: studentRecordId,
        parentId: selectedParentId
      });

      console.log('✅ Connection response:', response);

      if (response.status === 200 || response.status === 201) {
        const newParentName = parents.find(p => p.id === selectedParentId)?.user.name;
        alert(`✅ دانش‌آموز با موفقیت به والد "${newParentName}" متصل شد`);
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('❌ Error connecting student to parent:', error);
      
      if (error.response) {
        console.error('Error response details:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url,
          method: error.config?.method
        });
      }
      
      alert(`خطا در اتصال: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // تابع قطع اتصال
  const handleDisconnect = async () => {
    if (!currentParent || !studentRecordId) return;

    const confirmed = confirm(
      `آیا از قطع اتصال دانش‌آموز از والد "${currentParent.user.name}" مطمئن هستید؟`
    );
    if (!confirmed) return;

    setSubmitting(true);
    
    try {
      console.log('📤 Disconnecting student from parent:', {
        studentId: studentRecordId
      });

      // استفاده از endpoint آپدیت برای تنظیم parentId به null
      const response = await api.patch(`/admin/students/${studentRecordId}`, {
        parentId: null
      });

      console.log('✅ Disconnection response:', response);

      if (response.status === 200) {
        alert('✅ اتصال دانش‌آموز با موفقیت قطع شد');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('❌ Error disconnecting student:', error);
      alert(`خطا در قطع اتصال: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            اتصال دانش‌آموز به والد
          </DialogTitle>
          <DialogDescription>
            دانش‌آموز: <Badge variant="secondary">{studentName}</Badge>
            {studentRecordId && (
              <span className="text-xs text-muted-foreground block mt-1">
                شناسه دانش‌آموز: {studentRecordId}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* وضعیت اتصال فعلی */}
          {currentParent && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">اتصال فعلی:</span>
                    <div className="text-sm text-yellow-700 mt-1">
                      <Badge variant="outline" className="mr-2">
                        {currentParent.user.name}
                      </Badge>
                      <span>({currentParent.user.username})</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={submitting}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    قطع اتصال
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* جستجوی والدین */}
          <div className="space-y-2">
            <Label htmlFor="search">جستجوی والدین</Label>
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="جستجو بر اساس نام یا نام کاربری..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          {/* انتخاب والد */}
          <div className="space-y-2">
            <Label>
              انتخاب والد جدید
              {currentParent && (
                <span className="text-sm text-muted-foreground mr-2">
                  (برای تغییر والد فعلی)
                </span>
              )}
            </Label>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">در حال دریافت لیست والدین...</p>
              </div>
            ) : filteredParents.length === 0 ? (
              <div className="text-center py-4 border rounded-md">
                <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'والدی با مشخصات جستجو شده یافت نشد' : 'هیچ والدی در سیستم ثبت نشده است'}
                </p>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {filteredParents.map((parent) => (
                  <div
                    key={parent.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedParentId === parent.id ? 'bg-blue-50 border-blue-200' : ''
                    } ${
                      currentParent?.id === parent.id ? 'bg-green-50 border-green-200' : ''
                    }`}
                    onClick={() => {
                      if (currentParent?.id !== parent.id) {
                        setSelectedParentId(parent.id);
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {parent.user.name}
                          {currentParent?.id === parent.id && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{parent.user.username}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentParent?.id === parent.id && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            متصل شده
                          </Badge>
                        )}
                        {selectedParentId === parent.id && currentParent?.id !== parent.id && (
                          <Badge variant="default">انتخاب شده</Badge>
                        )}
                      </div>
                    </div>
                    {currentParent?.id === parent.id && (
                      <p className="text-xs text-green-600 mt-1">
                        این دانش‌آموز قبلاً به این والد متصل شده است
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* والد انتخاب شده */}
          {selectedParentId && currentParent?.id !== selectedParentId && (
            <Alert className="bg-blue-50 border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <span className="font-medium">والد انتخاب شده:</span>
                <div className="text-sm text-blue-700 mt-1">
                  <Badge variant="outline" className="mr-2">
                    {filteredParents.find(p => p.id === selectedParentId)?.user.name}
                  </Badge>
                  <span>({filteredParents.find(p => p.id === selectedParentId)?.user.username})</span>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            انصراف
          </Button>
          <Button
            onClick={handleConnect}
            disabled={!selectedParentId || !studentRecordId || submitting || currentParent?.id === selectedParentId}
            className="flex items-center gap-2"
          >
            {submitting ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Link className="h-4 w-4" />
            )}
            {currentParent ? 'تغییر والد' : 'اتصال دانش‌آموز'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}