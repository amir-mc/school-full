// components/UserRouteGuard.tsx (برای معلم، دانش‌آموز، والد)
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';

interface UserRouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function UserRouteGuard({ children, allowedRoles }: UserRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authCheck();
  }, [pathname]);

  const authCheck = async () => {
    setLoading(true);
    
    try {
      // بررسی احراز هویت
      if (!authService.isAuthenticated()) {
        setAuthorized(false);
        router.push('/login');
        return;
      }

      // دریافت اطلاعات کاربر
      const user = await authService.getCurrentUser();
      
      if (!user) {
        setAuthorized(false);
        router.push('/login');
        return;
      }

      // بررسی نقش کاربر
      if (!allowedRoles.includes(user.role)) {
        setAuthorized(false);
        router.push('/login');
        return;
      }

      // بررسی اینکه کاربر در مسیر درست باشد
      const basePath = `/${user.role.toLowerCase()}`;
      if (!pathname.startsWith(basePath)) {
        router.push(`${basePath}/dashboard`);
        return;
      }

      setAuthorized(true);
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthorized(false);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}