// src/components/grades/GradeRow.tsx
'use client';

import { Student } from "@/types";
import { useState } from "react";

interface GradeRowProps {
  student: Student;
  onSubmit: (studentId: string, grade: number) => void;
}

export default function GradeRow({ student, onSubmit }: GradeRowProps) {
  const [grade, setGrade] = useState('');

  return (
    <tr>
      <td>{student.user.fullName}</td> {/* تغییر این خط */}
      <td>
        <input
          type="number"
          min="0"
          max="20"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-20 p-1 border rounded"
        />
      </td>
      <td>
        <button
          onClick={() => onSubmit(student.id, parseFloat(grade))}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          ثبت
        </button>
      </td>
    </tr>
  );
}