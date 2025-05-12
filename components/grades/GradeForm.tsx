// src/components/GradeForm.tsx
import { useState } from "react";

type GradeFormProps = {
  courseId: string;
  students: { id: string; name: string }[];
};

export default function GradeForm({ courseId, students }: GradeFormProps) {
  const [grade, setGrade] = useState({
    studentId: "",
    value: 0,
    type: "EXAM",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/grades", {
      method: "POST",
      body: JSON.stringify({ ...grade, courseId }),
    });
    if (res.ok) alert("نمره با موفقیت ثبت شد!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={grade.studentId}
        onChange={(e) => setGrade({ ...grade, studentId: e.target.value })}
      >
        <option value="">انتخاب دانش‌آموز</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0"
        max="20"
        value={grade.value}
        onChange={(e) => setGrade({ ...grade, value: +e.target.value })}
      />

      <select
        value={grade.type}
        onChange={(e) => setGrade({ ...grade, type: e.target.value })}
      >
        {["EXAM", "QUIZ", "ASSIGNMENT"].map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button type="submit">ثبت نمره</button>
    </form>
  );
}