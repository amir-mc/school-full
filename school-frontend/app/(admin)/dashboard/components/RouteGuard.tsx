// components/RouteGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authCheck();
  }, [pathname]);

  const authCheck = () => {
    const token = localStorage.getItem('token');
    
    // اگر توکن نداریم و در صفحه لاگین نیستیم، به لاگین redirect کنیم
    if (!token && !pathname.includes('/login')) {
      setAuthorized(false);
      router.push('/login');
      return;
    }

    // اگر توکن داریم و در صفحه لاگین هستیم، به داشبورد redirect کنیم
    if (token && pathname.includes('/login')) {
      setAuthorized(false);
      router.push('/dashboard');
      return;
    }

    setAuthorized(true);
  };

  // اگر در حال بررسی احراز هویت هستیم، loading نمایش بده
  if (!authorized && !pathname.includes('/login')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}