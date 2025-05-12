// src/app/dashboard/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Users, PlusCircle } from 'lucide-react';
import CreateUserModal from '@/components/users/CreateUserModal';
import UsersTable from '@/components/users/UsersTable';
import Pagination from '@/components/Pagination';
import { User } from '@/types/user'; // استفاده از تعریف واحد

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users?page=${currentPage}&limit=${usersPerPage}`);
      const { data, total } = await res.json();
      setUsers(data);
      setTotalPages(Math.ceil(total / usersPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      redirect('/unauthorized');
    }
    fetchUsers();
  }, [session, currentPage]);

  const handleUserCreated = (newUser: User) => {
    setUsers([...users, newUser]);
    setIsModalOpen(false);
  };

  if (!session) {
    return <div>در حال بارگذاری...</div>;
  }


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="w-6 h-6 mr-2" />
          مدیریت کاربران
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          کاربر جدید
        </button>
      </div>

      <UsersTable users={users} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <CreateUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    
    </div>
  );
}