// components/users/UsersStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  isConfirmed: boolean;
}

interface UsersStatsProps {
  users: User[];
}

export default function UsersStats({ users }: UsersStatsProps) {
  const stats = {
    total: users.length,
    confirmed: users.filter(u => u.isConfirmed).length,
    pending: users.filter(u => !u.isConfirmed).length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    teachers: users.filter(u => u.role === 'TEACHER').length,
    students: users.filter(u => u.role === 'STUDENT').length,
    parents: users.filter(u => u.role === 'PARENT').length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>آمار کاربران</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">کل کاربران</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-green-800">تأیید شده</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-yellow-800">در انتظار تأیید</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
            <div className="text-sm text-purple-800">مدیر سیستم</div>
          </div>
        </div>

        {/* آمار نقش‌ها */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{stats.teachers}</div>
            <div className="text-sm text-orange-800">معلم</div>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-lg font-bold text-indigo-600">{stats.students}</div>
            <div className="text-sm text-indigo-800">دانش‌آموز</div>
          </div>
          <div className="text-center p-3 bg-pink-50 rounded-lg">
            <div className="text-lg font-bold text-pink-600">{stats.parents}</div>
            <div className="text-sm text-pink-800">والد</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}