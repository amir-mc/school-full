import { Grade } from "@/types";

// src/components/grades/GradeCard.tsx
interface GradeCardProps {
  grade: Grade;
  courseName: string; // دریافت نام درس به عنوان prop جداگانه
}
export default function GradeCard({ grade, courseName }: GradeCardProps) {
  return (
    <div className="border rounded-lg p-4">
        <h3 className="font-bold">{courseName}</h3>
      <div className="flex justify-between mt-2">
        <span>نمره: {grade.value}</span>
        <span className={`px-2 rounded ${
          grade.value >= 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {grade.value >= 10 ? 'قبول' : 'مردود'}
        </span>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        نوع: {grade.type === 'QUIZ' ? 'کوییز' : grade.type === 'EXAM' ? 'امتحان' : 'تکلیف'}
      </div>
    </div>
  );
}