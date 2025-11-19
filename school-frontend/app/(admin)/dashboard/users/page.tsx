// app/(admin)/dashboard/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
  Edit, 
  Trash2, 
  Filter,
  Users,
  X
} from 'lucide-react';
import { getUsers, deleteUser } from '@/services/adminService';

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
  const [roleFilter, setRoleFilter] = useState('all'); // مقدار پیش‌فرض غیرخالی
  const [statusFilter, setStatusFilter] = useState('all'); // فیلتر وضعیت تأیید
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // ساخت پارامترهای جستجو
      const params: any = {};
      if (searchQuery) params.query = searchQuery;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.isConfirmed = statusFilter === 'confirmed';

      console.log('🔄 Fetching users with params:', params);
      
      const response = await getUsers(params);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    // بعد از ریست، کاربران رو دوباره بگیر
    setTimeout(() => fetchUsers(), 100);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('آیا از حذف این کاربر مطمئن هستید؟')) return;

    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      alert('✅ کاربر با موفقیت حذف شد');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('خطا در حذف کاربر');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'TEACHER': return 'default';
      case 'STUDENT': return 'secondary';
      case 'PARENT': return 'outline';
      default: return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      'ADMIN': 'مدیر',
      'TEACHER': 'معلم',
      'STUDENT': 'دانش‌آموز',
      'PARENT': 'والد'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getStatusLabel = (isConfirmed: boolean) => {
    return isConfirmed ? 'تأیید شده' : 'در انتظار تأیید';
  };

  const getStatusVariant = (isConfirmed: boolean) => {
    return isConfirmed ? "default" : "secondary";
  };

  // محاسبه تعداد فیلترهای فعال
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
              {/* جستجو */}
              <div className="space-y-2">
                <label className="text-sm font-medium">جستجو</label>
                <Input
                  placeholder="نام، نام کاربری یا شناسه..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* فیلتر نقش */}
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

              {/* فیلتر وضعیت */}
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نام کاربر</TableHead>
                    <TableHead>نام کاربری</TableHead>
                    <TableHead>نقش</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>تاریخ ایجاد</TableHead>
                    <TableHead>عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-mono text-sm">{user.username}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(user.isConfirmed)}>
                          {getStatusLabel(user.isConfirmed)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
                            title="ویرایش کاربر"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            title="حذف کاربر"
                            disabled={user.role === 'ADMIN'} // جلوگیری از حذف ادمین
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {user.role === 'ADMIN' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            امکان حذف مدیر وجود ندارد
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* آمار سریع */}
      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>آمار کاربران</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-blue-800">کل کاربران</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.isConfirmed).length}
                </div>
                <div className="text-sm text-green-800">تأیید شده</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => !u.isConfirmed).length}
                </div>
                <div className="text-sm text-yellow-800">در انتظار تأیید</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'ADMIN').length}
                </div>
                <div className="text-sm text-purple-800">مدیر سیستم</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}