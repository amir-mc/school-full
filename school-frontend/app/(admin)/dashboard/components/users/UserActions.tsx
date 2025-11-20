// components/users/UserActions.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '@/lib/api';

interface UserActionsProps {
  user: {
    id: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
    isConfirmed: boolean;
  };
  onUserUpdated: () => void;
  onEdit: (userId: string) => void;
}

export default function UserActions({ user, onUserUpdated, onEdit }: UserActionsProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // تابع تأیید کاربر - استفاده از آپدیت مستقیم
  const handleConfirmUser = async () => {
    setActionLoading('confirm');
    
    try {
      console.log('📤 Directly updating user confirmation:', user.id);
      
      // آپدیت مستقیم فیلد isConfirmed
      const response = await api.patch(`/admin/users/${user.id}`, {
        isConfirmed: true
      });
      
      console.log('✅ Update response:', response);
      
      if (response.status === 200) {
        alert('✅ کاربر با موفقیت تأیید شد');
        onUserUpdated(); // لیست رو رفرش کن
      }
    } catch (error: any) {
      console.error('❌ Error updating user:', error);
      
      if (error.response) {
        console.error('Error details:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      alert(`خطا در تأیید کاربر: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // تابع رد کاربر
  const handleRejectUser = async () => {
    if (!confirm('آیا از رد این کاربر مطمئن هستید؟ این عمل قابل بازگشت نیست.')) return;

    setActionLoading('reject');
    
    try {
      await api.delete(`/admin/users/${user.id}`);
      alert('✅ کاربر با موفقیت رد شد');
      onUserUpdated();
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      alert(`خطا در رد کاربر: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // تابع حذف کاربر
  const handleDeleteUser = async () => {
    if (!confirm('آیا از حذف این کاربر مطمئن هستید؟')) return;

    setActionLoading('delete');
    
    try {
      await api.delete(`/admin/users/${user.id}`);
      alert('✅ کاربر با موفقیت حذف شد');
      onUserUpdated();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`خطا در حذف کاربر: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* دکمه‌های تأیید/رد برای کاربران تأیید نشده */}
      {!user.isConfirmed && user.role !== 'ADMIN' && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleConfirmUser}
            disabled={!!actionLoading}
            className="text-green-600 border-green-200 hover:bg-green-50"
            title="تأیید کاربر"
          >
            {actionLoading === 'confirm' ? (
              <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRejectUser}
            disabled={!!actionLoading}
            className="text-red-600 border-red-200 hover:bg-red-50"
            title="رد کاربر"
          >
            {actionLoading === 'reject' ? (
              <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </Button>
        </>
      )}

      {/* دکمه ویرایش برای همه کاربران */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(user.id)}
        disabled={!!actionLoading}
        title="ویرایش کاربر"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* دکمه حذف فقط برای کاربران غیر-ادمین */}
      {user.role !== 'ADMIN' && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteUser}
          title="حذف کاربر"
          disabled={!!actionLoading}
        >
          {actionLoading === 'delete' ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}