//teacher/classes/components/EmptyState.tsx
'use client';

import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  searchQuery: string;
  onResetFilters: () => void;
}

export default function EmptyState({ searchQuery, onResetFilters }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? 'هیچ کلاسی یافت نشد' : 'هنوز کلاسی به شما اختصاص داده نشده است'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? 'با جستجوی فعلی هیچ کلاسی مطابقت ندارد.' 
              : 'با مدیریت مدرسه تماس بگیرید تا کلاس‌هایی به شما اختصاص داده شود.'
            }
          </p>
          {searchQuery && (
            <button
              onClick={onResetFilters}
              className="text-sm text-primary hover:underline"
            >
              پاک کردن فیلترهای جستجو
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}