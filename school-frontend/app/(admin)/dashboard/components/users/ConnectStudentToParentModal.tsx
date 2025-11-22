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
import { Link, User, Search } from 'lucide-react';
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
  id: string; // این id رکورد Student هست
  userId: string;
  user: {
    id: string;
    name: string;
  };
}

interface ConnectStudentToParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentUserId: string; // تغییر نام به studentUserId
  studentName: string;
  onSuccess: () => void;
}

export default function ConnectStudentToParentModal({
  isOpen,
  onClose,
  studentUserId, // حالا userId دانش‌آموز رو دریافت می‌کنه
  studentName,
  onSuccess
}: ConnectStudentToParentModalProps) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [studentRecordId, setStudentRecordId] = useState(''); // id رکورد Student
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

      // دریافت دانش‌آموزان برای پیدا کردن studentId
      const studentsResponse = await api.get('/admin/students');
      setStudents(studentsResponse.data);

      // پیدا کردن studentId بر اساس userId
      const studentRecord = studentsResponse.data.find(
        (s: Student) => s.userId === studentUserId
      );
      
      if (studentRecord) {
        setStudentRecordId(studentRecord.id);
        console.log('🎯 Found student record:', studentRecord);
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

    setSubmitting(true);
    
    try {
      console.log('📤 Connecting student to parent:', {
        studentId: studentRecordId, // حالا studentId واقعی رو می‌فرستیم
        parentId: selectedParentId
      });

      const response = await api.post('/admin/students/assign-parent', {
        studentId: studentRecordId,
        parentId: selectedParentId
      });

      console.log('✅ Connection response:', response);

      if (response.status === 200 || response.status === 201) {
        alert('✅ دانش‌آموز با موفقیت به والد متصل شد');
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
            <Label>انتخاب والد</Label>
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
                    }`}
                    onClick={() => setSelectedParentId(parent.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{parent.user.name}</p>
                        <p className="text-sm text-muted-foreground">{parent.user.username}</p>
                      </div>
                      {selectedParentId === parent.id && (
                        <Badge variant="default">انتخاب شده</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* والد انتخاب شده */}
          {selectedParentId && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm font-medium text-green-800">والد انتخاب شده:</p>
              <p className="text-green-700">
                {filteredParents.find(p => p.id === selectedParentId)?.user.name}
              </p>
            </div>
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
            disabled={!selectedParentId || !studentRecordId || submitting}
            className="flex items-center gap-2"
          >
            {submitting ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Link className="h-4 w-4" />
            )}
            اتصال دانش‌آموز
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}