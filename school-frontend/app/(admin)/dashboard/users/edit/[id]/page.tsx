"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  username: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  classId?: string;
};

type Class = {
  id: string;
  name: string;
};

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        alert("خطا در دریافت اطلاعات کاربر");
        router.push("/dashboard/users");
      }

      setLoading(false);
    };

    const fetchClasses = async () => {
      const res = await fetch(`http://localhost:3000/admin/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    };

    fetchUser();
    fetchClasses();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: any = {
      id: user.id,
      name: user.name,
      username: user.username,
    };

    if (password.trim()) payload.password = password;
    if (user.role === "STUDENT" && user.classId) payload.classId = user.classId;

    const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("کاربر با موفقیت ویرایش شد");
      router.push("/dashboard/users");
    } else {
      const err = await res.json();
      alert("خطا: " + err.message);
    }
  };

  if (loading || !user) return <div>در حال بارگذاری...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">ویرایش کاربر</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={user.id}
          onChange={(e) => setUser({ ...user, id: e.target.value })}
          placeholder="کد ملی"
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="نام"
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="نام کاربری"
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور جدید (اختیاری)"
          className="w-full border rounded p-2"
        />

        {user.role === "STUDENT" && (
          <select
            value={user.classId || ""}
            onChange={(e) => setUser({ ...user, classId: e.target.value })}
            className="w-full border rounded p-2"
          >
            <option value="">انتخاب کلاس</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}
