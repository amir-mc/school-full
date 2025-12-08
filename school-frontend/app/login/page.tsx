// app/login/page.tsx
// import LoginForm from './form';

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">ورود به پنل</h1>
//         <LoginForm />
//       </div>
//     </div>
//   );
// }





// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, User, Lock, School, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';

// تابع برای decode کردن JWT token
const decodeJWT = (token: string) => {
  try {
    // بخش payload توکن (قسمت دوم)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialCheck, setInitialCheck] = useState(true);

  // بررسی اگر کاربر قبلاً لاگین کرده
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role) {
          redirectBasedOnRole(user.role);
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setInitialCheck(false);
  }, []);

  const redirectBasedOnRole = (role: string) => {
    console.log('🔄 Redirecting based on role:', role);
    switch (role) {
      case 'ADMIN':
        router.push('/dashboard');
        break;
      case 'TEACHER':
        router.push('/teacher/dashboard');
        break;
      case 'STUDENT':
        router.push('/student/dashboard');
        break;
      case 'PARENT':
        router.push('/parent/dashboard');
        break;
      default:
        console.warn('Unknown role:', role);
        router.push('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Attempting login with:', { username: formData.username });

      // ارسال درخواست لاگین
      const response = await api.post('/auth/login', {
        username: formData.username,
        password: formData.password
      });

      console.log('✅ Login response:', response.data);

      // بررسی پاسخ
      const responseData = response.data;
      
      if (!responseData.access_token) {
        throw new Error('توکن دریافتی معتبر نیست');
      }

      // دریافت توکن
      const token = responseData.access_token;
      
      // decode کردن توکن برای دریافت اطلاعات کاربر
      const decodedToken = decodeJWT(token);
      
      if (!decodedToken) {
        throw new Error('خطا در پردازش اطلاعات کاربر');
      }

      console.log('🔍 Decoded JWT:', decodedToken);

      // استخراج اطلاعات از توکن
      const userData = {
        id: decodedToken.sub || decodedToken.userId,
        username: formData.username,
        role: decodedToken.role,
        name: formData.username, // یا از decodedToken.name اگر وجود دارد
        parentId: decodedToken.parentId || null
      };

      console.log('👤 User data extracted:', userData);

      // ذخیره در localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // هدایت بر اساس نقش
      if (userData.role) {
        redirectBasedOnRole(userData.role);
      } else {
        throw new Error('نقش کاربر در توکن مشخص نیست');
      }

    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      // نمایش پیام خطای مناسب
      let errorMessage = 'خطا در ورود به سیستم';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'نام کاربری یا رمز عبور اشتباه است';
        } else if (err.response.status === 403) {
          errorMessage = 'دسترسی غیرمجاز';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `خطای سرور (کد: ${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = 'اتصال به سرور برقرار نشد. لطفاً شبکه خود را بررسی کنید.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  if (initialCheck) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-600">در حال بررسی وضعیت ورود...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* هدر */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <School className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">سیستم مدیریت مدرسه</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">ورود به سیستم</h1>
          <p className="mt-2 text-gray-600">اطلاعات کاربری خود را وارد کنید</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">ورود به پنل</CardTitle>
            <CardDescription>
              نام کاربری و رمز عبور خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* فرم ورود */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    <User className="inline h-4 w-4 ml-1" />
                    نام کاربری
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="نام کاربری"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    <Lock className="inline h-4 w-4 ml-1" />
                    رمز عبور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="رمز عبور"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      required
                      disabled={loading}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3 text-gray-500 hover:text-gray-700"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* نمایش خطا */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="flex items-center gap-2">
                    <span>⚠️</span>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* دکمه ورود */}
              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <User className="ml-2 h-4 w-4" />
                    ورود به سیستم
                  </>
                )}
              </Button>

              {/* اطلاعات دیباگ (فقط در توسعه) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>توکن فعلی در localStorage:</strong></p>
                  <p className="truncate">
                    {localStorage.getItem('token')?.substring(0, 50)}...
                  </p>
                  <p><strong>کاربر فعلی:</strong></p>
                  <p>{localStorage.getItem('user') || 'هیچ کاربری'}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* فوتر */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} سیستم مدیریت مدرسه</p>
          <p className="mt-1">نسخه ۱.۰.۰</p>
        </div>
      </div>
    </div>
  );
}