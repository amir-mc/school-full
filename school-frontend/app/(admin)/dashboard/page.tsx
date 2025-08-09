"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try { 
        const token = localStorage.getItem("token");
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const [usersRes, studentsRes, teachersRes, classesRes] = await Promise.all([
           api.get('/admin/users/count/all'),
        api.get('/admin/users/count/students'),
        api.get('/admin/users/count/teachers'),
        api.get('/admin/classes/count'),
        ]);

 

       setStats({
        totalUsers: usersRes.data.count,
        totalStudents: studentsRes.data.count,
        totalTeachers: teachersRes.data.count,
        totalClasses: classesRes.data.count,
      });
      } catch (error) {
        console.error("خطا در دریافت آمار:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">داشبورد مدیریت</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="کل کاربران" value={stats.totalUsers} />
        <StatCard title="تعداد دانش‌آموزان" value={stats.totalStudents} />
        <StatCard title="تعداد معلمان" value={stats.totalTeachers} />
        <StatCard title="تعداد کلاس‌ها" value={stats.totalClasses} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">میانبرهای سریع</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <button onClick={() => router.push("/admin/users/create")} className="btn btn-primary w-full">
            👤 ایجاد کاربر
          </button>
          <button onClick={() => router.push("/admin/classes/create")} className="btn btn-secondary w-full">
            🏫 ایجاد کلاس
          </button>
          <button onClick={() => router.push("/admin/users?role=STUDENT")} className="btn btn-accent w-full">
            👨‍🎓 لیست دانش‌آموزان
          </button>
          <button onClick={() => router.push("/admin/users?role=TEACHER")} className="btn btn-info w-full">
            🧑‍🏫 لیست معلمان
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center justify-center text-center">
      <div className="text-4xl font-bold text-indigo-600">{value}</div>
      <div className="text-gray-600 mt-2">{title}</div>
    </div>
  );
}
