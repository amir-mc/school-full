// src/components/dashboard/shared/DashboardCard.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export default function DashboardCard({ 
  title, 
  description, 
  href, 
  icon 
}: DashboardCardProps) {
  return (
    <Link href={href}>
      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer h-full">
        <div className="flex items-center mb-2">
          <div className="p-2 bg-indigo-100 rounded-md mr-3">
            {icon}
          </div>
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}