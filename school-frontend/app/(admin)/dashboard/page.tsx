// app/(admin)/dashboard/page.tsx
'use client';

import { useAdminStats } from '@/hooks/useAdminStats';
import StatsCards from './components/StatsCards';
import QuickActions from './components/QuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { stats, loading, error } = useAdminStats();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">داشبورد مدیریت</h1>
        <p className="text-muted-foreground">
          نمای کلی از وضعیت سیستم آموزشی
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity (می‌تونه بعداً اضافه بشه) */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            این بخش به زودی اضافه خواهد شد...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}