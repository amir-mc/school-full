"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [classId, setClassId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("توکن یافت نشد");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("خطا در دریافت کاربران");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);


useEffect(() => {
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/admin/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch classes");

      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  fetchClasses();
}, []);
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    const confirmed = confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("کاربر با موفقیت حذف شد");
        setUsers(users.filter(user => user.id !== id));
      } else {
        const error = await res.json();
        alert("خطا در حذف: " + error.message);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("خطا در ارتباط با سرور");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    console.log("Search Token:", token); // Debug

    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (role) params.append("role", role);
    if (classId) params.append("classId", classId);
    console.log("Search URL:", `http://localhost:3000/admin/users?${params.toString()}`); // Debug

    try {
      const res = await fetch(`http://localhost:3000/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Search Response Status:", res.status); // Debug

      if (!res.ok) {
        const error = await res.json();
        console.error("Search Error:", error);
        alert("خطا در جستجو: " + (error.message || res.statusText));
        return;
      }

      const data = await res.json();
      console.log("Search Results:", data); // Debug
      setUsers(data);
    } catch (err) {
      console.error("Network Error:", err);
      alert("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">لیست کاربران</h1>
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap gap-4 items-end bg-gray-100 p-4 rounded-md mb-6"
      >
        <input
          type="text"
          name="query"
          placeholder="جستجو بر اساس نام یا شناسه یا نام کاربری"
          className="border px-3 py-2 rounded-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          name="role"
          className="border px-3 py-2 rounded-md"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">همه نقش‌ها</option>
          <option value="STUDENT">دانش‌آموز</option>
          <option value="TEACHER">معلم</option>
          <option value="PARENT">والد</option>
          <option value="ADMIN">مدیر</option>
        </select>
           {role === "STUDENT" && (
       <select
  value={classId}
  onChange={(e) => setClassId(e.target.value)}
  className="border px-3 py-2 rounded text-sm"
>
  <option value="">همه کلاس‌ها</option>
  {classes.map((cls) => (
    <option key={cls.id} value={cls.id}>
      {cls.name}
    </option>
  ))}
</select>
)}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'در حال جستجو...' : 'جستجو'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left bg-white border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">نام کاربری</th>
              <th className="px-4 py-2">نام</th>
              <th className="px-4 py-2">نقش</th>
              <th className="px-4 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    > 
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  {isLoading ? 'در حال بارگذاری...' : 'هیچ کاربری یافت نشد.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}