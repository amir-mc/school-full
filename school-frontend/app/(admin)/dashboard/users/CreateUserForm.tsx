"use client";

import { useState, useEffect } from "react";

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    nationalId: "",
    role: "STUDENT",
    classId: "",
  });

  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/classes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch classes");

        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error("خطا در گرفتن کلاس‌ها:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          classId: formData.role === "STUDENT" ? formData.classId : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "خطا در ثبت کاربر");
      }

      alert("✅ کاربر با موفقیت ایجاد شد!");
      setFormData({
        name: "",
        username: "",
        password: "",
        nationalId: "",
        role: "STUDENT",
        classId: "",
      });
    } catch (error: any) {
      alert("⚠️ " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ایجاد کاربر جدید</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* کد ملی */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">کد ملی</label>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            required
            placeholder="مثلاً 1234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* نام کامل */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">نام کامل</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="مثلاً امیر حسینی"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* نام کاربری */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">نام کاربری</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="مثلاً amir123"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* رمز عبور */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">رمز عبور</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="رمز دلخواه"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* نقش */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">نقش کاربر</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="STUDENT">دانش‌آموز</option>
            <option value="TEACHER">معلم</option>
            <option value="PARENT">والد</option>
            <option value="ADMIN">مدیر</option>
          </select>
        </div>

        {/* انتخاب کلاس فقط برای دانش‌آموز */}
        {formData.role === "STUDENT" && (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">کلاس</label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            >
              <option value="">-- انتخاب کلاس --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* دکمه ارسال */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {isSubmitting ? "در حال ثبت..." : "ایجاد کاربر"}
          </button>
        </div>
      </form>
    </div>
  );
}
