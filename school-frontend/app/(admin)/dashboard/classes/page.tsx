// ~/school-frontend/app/dashboard/classes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Class {
  id: string;
  name: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/admin/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      } else {
        alert("خطا در دریافت کلاس‌ها");
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("آیا از حذف این کلاس مطمئن هستید؟");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/admin/classes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setClasses(classes.filter((cls) => cls.id !== id));
      alert("کلاس حذف شد");
    } else {
      alert("خطا در حذف کلاس");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">لیست کلاس‌ها</h1>
        <button
          onClick={() => router.push("/dashboard/classes/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + افزودن کلاس
        </button>
      </div>

      <table className="w-full text-sm bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">نام کلاس</th>
            <th className="px-4 py-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id} className="border-t">
              <td className="px-4 py-2">{cls.name}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => router.push(`/dashboard/classes/edit/${cls.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
