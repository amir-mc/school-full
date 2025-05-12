// src/components/reports/AttendanceTrendChart.tsx
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AttendanceTrendChartProps {
  data?: {
    month: string;
    rate: number;
  }[];
}

export default function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  const chartData = {
    labels: data?.map(item => item.month) || [],
    datasets: [
      {
        label: 'نرخ حضور (%)',
        data: data?.map(item => item.rate) || [],
        borderColor: 'rgba(16, 185, 129, 0.8)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
        fill: true,
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
        text: 'روند حضور دانش‌آموزان',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <Line data={chartData} options={options} />
    </div>
  );
}