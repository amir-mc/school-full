// app/(admin)/dashboard/components/QuickActions.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  School, 
  Users, 
  BookOpen,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const actions = [
  {
    title: 'ایجاد کاربر',
    description: 'افزودن کاربر جدید به سیستم',
    icon: UserPlus,
    href: '/dashboard/users/create',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'ایجاد کلاس',
    description: 'ساخت کلاس جدید',
    icon: School,
    href: '/dashboard/classes/create',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: 'تأیید کاربران',
    description: 'مدیریت درخواست‌های ثبت‌نام',
    icon: UserCheck,
    href: '/dashboard/confirmation',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    title: 'اتصالات',
    description: 'اتصال والدین و معلمان',
    icon: Users,
    href: '/dashboard/connections',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          اقدامات سریع
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => router.push(action.href)}
              className={`h-auto p-4 flex flex-col items-center justify-center gap-2 text-white ${action.color} transition-all duration-200 hover:scale-105`}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}