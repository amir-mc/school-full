"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Teacher = {
  id: string;
  name: string;
};

export default function CreateClassPage() {
  const [name, setName] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [grade, setGrade] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/admin/teachers?forClassSelection=true",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("خطا در دریافت لیست معلمان");
        }

        const data = await response.json();
        // تبدیل داده به فرمت مورد نیاز
        const formattedTeachers = data.map((teacher: any) => ({
          id: teacher.id,
          name: teacher.user?.name || 'نام نامشخص',
        }));
        setTeachers(formattedTeachers);
      } catch (error) {
        alert(error instanceof Error ? error.message : "خطای ناشناخته");
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // اعتبارسنجی معلمان انتخاب شده
      if (selectedTeacherIds.length > 0) {
        const idsParam = selectedTeacherIds.join(",");
        const validationResponse = await fetch(
          `http://localhost:3000/admin/teachers/validate/ids?ids=${idsParam}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!validationResponse.ok) {
          const error = await validationResponse.json();
          throw new Error(error.message || "معلمان انتخاب شده معتبر نیستند");
        }
      }

      // ایجاد کلاس
      const res = await fetch("http://localhost:3000/admin/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          grade,
          teacherIds: selectedTeacherIds,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "خطا در ایجاد کلاس");
      }

      alert("کلاس با موفقیت ایجاد شد");
      router.push("/dashboard/classes");
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  };

  const toggleTeacher = (id: string) => {
    setSelectedTeacherIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">ایجاد کلاس جدید</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="نام کلاس"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
          required
          disabled={loading}
        />
        
        {/* پایه تحصیلی */}
        <div>
          <label className="block mb-1">پایه تحصیلی</label>
          <select
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={loading}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
              <option key={g} value={g}>
                پایه {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">انتخاب معلم(ها):</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
            {teachers.length === 0 ? (
              <p className="text-gray-500">در حال دریافت لیست معلمان...</p>
            ) : (
              teachers.map((teacher) => (
                <label key={teacher.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTeacherIds.includes(teacher.id)}
                    onChange={() => toggleTeacher(teacher.id)}
                    disabled={loading}
                  />
                  <span>{teacher.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "در حال ایجاد کلاس..." : "ایجاد کلاس"}
        </button>
      </form>
    </div>
  );
}