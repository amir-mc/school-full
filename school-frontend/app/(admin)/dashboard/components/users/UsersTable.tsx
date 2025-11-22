// components/users/UsersTable.tsx (آپدیت شده)
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import UserActions from './UserActions';

interface User {
  id: string;
  name: string;
  username: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  isConfirmed: boolean;
  createdAt: string;
  // برای دانش‌آموزان
  student?: {
    parent?: {
      user: {
        name: string;
      };
    };
  };
}

interface UsersTableProps {
  users: User[];
  onUserUpdated: () => void;
  onEditUser: (userId: string) => void;
  onConnectStudentToParent?: (studentId: string) => void;
}

export default function UsersTable({ users, onUserUpdated, onEditUser, onConnectStudentToParent }: UsersTableProps) {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام کاربر</TableHead>
            <TableHead>نام کاربری</TableHead>
            <TableHead>نقش</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>والد متصل</TableHead>
            <TableHead>تاریخ ایجاد</TableHead>
            <TableHead className="w-[200px]">عملیات</TableHead>
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
              <TableCell>
                {user.role === 'STUDENT' && user.student?.parent ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {user.student.parent.user.name}
                  </Badge>
                ) : user.role === 'STUDENT' ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    بدون والد
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString('fa-IR')}
              </TableCell>
              <TableCell>
                <UserActions 
                  user={user}
                  onUserUpdated={onUserUpdated}
                  onEdit={onEditUser}
                  onConnectStudentToParent={onConnectStudentToParent}
                />
                
                {/* پیام برای کاربران ادمین */}
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
  );
}