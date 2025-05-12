// src/components/users/CreateUserModal.tsx
'use client';

import { User } from '@/types/user';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated
}: CreateUserModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    // تبدیل نوع role به نوع مورد انتظار
    const role = formData.get('role') as User['role'];
    
    const newUser: User = {
      id: '', // سرور باید این مقدار را ایجاد کند
      nationalId: formData.get('nationalId') as string,
      fullName: formData.get('fullName') as string,
      role: role, // استفاده از نوع صحیح
      phone: formData.get('phone') as string
    };
    
    onUserCreated(newUser);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">ایجاد کاربر جدید</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">کدملی</label>
              <input
                name="nationalId"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
              <input
                name="fullName"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نقش</label>
              <select
                name="role"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="TEACHER">معلم</option>
                <option value="PARENT">والدین</option>
                <option value="STUDENT">دانش‌آموز</option>
                {/* اگر نیاز به SUPER_ADMIN دارید: */}
                {/* <option value="SUPER_ADMIN">مدیر سیستم</option> */}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              ایجاد کاربر
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}