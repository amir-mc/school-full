// src/components/users/UsersTable.tsx
'use client';
import { User } from "@/types/user";
import { Edit, Trash2 } from 'lucide-react';

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">کدملی</th>
            <th className="py-2 px-4 border-b">نام کامل</th>
            <th className="py-2 px-4 border-b">نقش</th>
            <th className="py-2 px-4 border-b">شماره تماس</th>
            <th className="py-2 px-4 border-b">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center">{user.nationalId}</td>
              <td className="py-2 px-4 border-b text-center">{user.fullName}</td>
              <td className="py-2 px-4 border-b text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'PARENT' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.role === 'SUPER_ADMIN' ? 'مدیر سیستم' :
                   user.role === 'TEACHER' ? 'معلم' :
                   user.role === 'PARENT' ? 'والدین' : 'دانش‌آموز'}
                </span>
              </td>
              <td className="py-2 px-4 border-b text-center">{user.phone}</td>
              <td className="py-2 px-4 border-b text-center">
                <div className="flex justify-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}