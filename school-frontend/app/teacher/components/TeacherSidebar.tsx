// components/teacher/TeacherSidebar.tsx
'use client';

import {
  Home,
  BookOpen,
  FileText,
  Calendar,
  MessageSquare,
  Users,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  {
    title: 'داشبورد',
    href: '/teacher/dashboard',
    icon: Home,
  },
  {
    title: 'کلاس‌های من',
    href: '/teacher/classes',
    icon: BookOpen,
  },
  {
    title: 'مدیریت نمرات',
    href: '/teacher/grades',
    icon: FileText,
  },
  {
    title: 'برنامه هفتگی',
    href: '/teacher/schedule',
    icon: Calendar,
  },
  {
    title: 'پیام‌رسانی',
    href: '/teacher/messages',
    icon: MessageSquare,
  },
  {
    title: 'دانش‌آموزان',
    href: '/teacher/students',
    icon: Users,
  },
  {
    title: 'پروفایل',
    href: '/teacher/profile',
    icon: User,
  },
  {
    title: 'تنظیمات',
    href: '/teacher/settings',
    icon: Settings,
  },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex h-full w-64 flex-col border-l bg-white">
      {/* لوگو */}
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">پنل معلم</h2>
            <p className="text-xs text-gray-500">سیستم مدیریت مدرسه</p>
          </div>
        </div>
      </div>

      {/* منوی ناوبری */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </a>
          );
        })}
      </nav>

      {/* بخش خروج */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          خروج از سیستم
        </Button>
      </div>
    </div>
  );
}