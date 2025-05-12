// src/components/dashboard/shared/StatCard.tsx
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  icon: ReactNode;
  color?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: StatCardProps) {
  return (
    <div className={`${color} p-4 rounded-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-white bg-opacity-30">
          {icon}
        </div>
      </div>
    </div>
  );
}