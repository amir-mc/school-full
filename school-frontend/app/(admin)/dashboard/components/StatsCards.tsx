// app/(admin)/dashboard/components/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, UserCheck, School } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
  };
  loading?: boolean;
}

const StatCard = ({ title, value, icon, loading = false }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  loading?: boolean;
}) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {loading ? (
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          value.toLocaleString('fa-IR')
        )}
      </div>
    </CardContent>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
  </Card>
);

export default function StatsCards({ stats, loading = false }: StatsCardsProps) {
  const statItems = [
    {
      title: 'کل کاربران',
      value: stats.totalUsers,
      icon: <Users className="h-4 w-4 text-blue-500" />,
    },
    {
      title: 'دانش‌آموزان',
      value: stats.totalStudents,
      icon: <GraduationCap className="h-4 w-4 text-green-500" />,
    },
    {
      title: 'معلمان',
      value: stats.totalTeachers,
      icon: <UserCheck className="h-4 w-4 text-orange-500" />,
    },
    {
      title: 'کلاس‌ها',
      value: stats.totalClasses,
      icon: <School className="h-4 w-4 text-purple-500" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          loading={loading}
        />
      ))}
    </div>
  );
}