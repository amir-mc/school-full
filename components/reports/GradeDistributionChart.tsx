// src/components/reports/GradeDistributionChart.tsx
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GradeDistributionChartProps {
  data?: {
    range: string;
    count: number;
  }[];
}

export default function GradeDistributionChart({ data }: GradeDistributionChartProps) {
  const chartData = {
    labels: data?.map(item => item.range) || [],
    datasets: [
      {
        label: 'تعداد دانش‌آموزان',
        data: data?.map(item => item.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        rtl: true,
      },
      title: {
        display: true,
        text: 'توزیع نمرات دانش‌آموزان',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <Bar data={chartData} options={options} />
    </div>
  );
}