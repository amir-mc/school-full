// app/teacher/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Loader2 } from 'lucide-react';
import TeacherSidebar from './components/TeacherSidebar';
import TeacherHeader from './components/TeacherHeader';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token) {
        router.push('/login');
        return;
      }

      if (userData) {
        const parsedUser = JSON.parse(userData);
        
        // بررسی نقش معلم
        if (parsedUser.role !== 'TEACHER') {
          router.push('/login');
          return;
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">در حال بارگذاری پنل معلم...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="flex flex-1 flex-col">
        <TeacherHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}