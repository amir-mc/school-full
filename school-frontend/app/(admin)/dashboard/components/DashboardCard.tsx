// app/(admin)/dashboard/components/DashboardCard.tsx
type Props = {
  title: string;
  count: number;
  icon: string;
};

export const DashboardCard = ({ title, count, icon }: Props) => (
  <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between border border-gray-200">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{count}</h3>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);
