'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://185.24.253.55:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'خطا در ورود');

      // ذخیره‌سازی توکن در localStorage یا cookie
      localStorage.setItem('token', data.access_token);

      window.location.href = '/dashboard'; // مسیر بعد از ورود موفق
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800">ورود به حساب کاربری</h2>
      <p className="text-gray-800 mt-2">لطفا اطلاعات خود را وارد کنید</p>
    </div>

    <div className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          نام کاربری
        </label>
        <input
          id="username"
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
          رمز عبور
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start space-x-2">
          <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      <button
        onClick={handleLogin}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition duration-200 ${
          loading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            در حال ورود...
          </span>
        ) : (
          'ورود به حساب'
        )}
      </button>
    </div>

    <div className="text-center text-sm text-gray-500">
      حساب کاربری ندارید؟{' '}
      <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
        ثبت نام کنید
      </a>
    </div>
  </div>
);
 
}
