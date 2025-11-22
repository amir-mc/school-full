// app/(admin)/dashboard/users/page.tsx (قسمت‌های اضافه شده)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  UserPlus, 
  Filter,
  Users,
  X,
} from 'lucide-react';
import { getUsers } from '@/services/adminService';
import UsersTable from '../components/users/UsersTable';
import UsersStats from '../components/users/UsersStats';
import ConnectStudentToParentModal from '../components/users/ConnectStudentToParentModal';


interface User {
  id: string;
  name: string;
  username: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  isConfirmed: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // stateهای مربوط به مودال اتصال
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
  
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const params: any = {};
      if (searchQuery) params.query = searchQuery;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.isConfirmed = statusFilter === 'confirmed';

      const response = await getUsers(params);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // تابع باز کردن مودال اتصال
  const handleConnectStudentToParent = (studentId: string) => {
    const student = users.find(u => u.id === studentId);
    if (student) {
      setSelectedStudent({ id: studentId, name: student.name });
      setConnectModalOpen(true);
    }
  };

  // تابع بستن مودال
  const handleCloseConnectModal = () => {
    setConnectModalOpen(false);
    setSelectedStudent(null);
  };

  // تابع موفقیت‌آمیز بودن اتصال
  const handleConnectionSuccess = () => {
    fetchUsers(); // بروزرسانی لیست
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setTimeout(() => fetchUsers(), 100);
  };

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/users/edit/${userId}`);
  };

  const activeFiltersCount = [
    searchQuery,
    roleFilter !== 'all',
    statusFilter !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مدیریت کاربران</h1>
          <p className="text-muted-foreground">
            مدیریت و مشاهده تمام کاربران سیستم
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/users/create')}>
          <UserPlus className="h-4 w-4 ml-2" />
          ایجاد کاربر جدید
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
                onClick={handleResetFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                پاک کردن فیلترها
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">جستجو</label>
                <Input
                  placeholder="نام، نام کاربری یا شناسه..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">نقش</label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="همه نقش‌ها" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه نقش‌ها</SelectItem>
                    <SelectItem value="ADMIN">مدیر</SelectItem>
                    <SelectItem value="TEACHER">معلم</SelectItem>
                    <SelectItem value="STUDENT">دانش‌آموز</SelectItem>
                    <SelectItem value="PARENT">والد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">وضعیت تأیید</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="همه وضعیت‌ها" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="confirmed">تأیید شده</SelectItem>
                    <SelectItem value="pending">در انتظار تأیید</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <Search className="h-4 w-4 ml-2" />
                اعمال فیلترها
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={fetchUsers}
                className="flex-1"
              >
                بروزرسانی لیست
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            لیست کاربران 
            <Badge variant="outline" className="mr-2">
              {users.length} کاربر
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">در حال بارگذاری کاربران...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ کاربری یافت نشد</h3>
              <p className="text-muted-foreground mb-4">
                {activeFiltersCount > 0 
                  ? 'با فیلترهای فعلی هیچ کاربری مطابقت ندارد.' 
                  : 'هنوز هیچ کاربری در سیستم ثبت نشده است.'
                }
              </p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={handleResetFilters}>
                  پاک کردن فیلترها
                </Button>
              )}
            </div>
          ) : (
            <UsersTable 
              users={users}
              onUserUpdated={fetchUsers}
              onEditUser={handleEditUser}
              onConnectStudentToParent={handleConnectStudentToParent}
            />
          )}
        </CardContent>
      </Card>

      {/* آمار */}
      {users.length > 0 && <UsersStats users={users} />}

      {/* مودال اتصال دانش‌آموز به والد */}
      {selectedStudent && (
       <ConnectStudentToParentModal
  isOpen={connectModalOpen}
  onClose={handleCloseConnectModal}
  studentUserId={selectedStudent.id} // تغییر به studentUserId
  studentName={selectedStudent.name}
  onSuccess={handleConnectionSuccess}
/>
      )}
    </div>
  );
}