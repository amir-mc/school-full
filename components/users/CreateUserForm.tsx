// src/components/users/CreateUserForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nationalId: "",
    fullName: "",
    phone: "",
    password: "",
    role: "STUDENT",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.refresh();
        // نمایش پیام موفقیت
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          کدملی
        </label>
        <input
          type="text"
          value={formData.nationalId}
          onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      
      {/* فیلدهای دیگر... */}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          نقش کاربر
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="STUDENT">دانش‌آموز</option>
          <option value="TEACHER">معلم</option>
          <option value="PARENT">والدین</option>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        {isLoading ? "در حال ثبت..." : "ثبت کاربر"}
      </button>
    </form>
  );
}