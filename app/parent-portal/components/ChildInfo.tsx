// src/app/parent-portal/dashboard/components/ChildInfo.tsx
'use client';

interface ChildInfoProps {
  student: {
    id: number;
    user: { fullName: string };
    class: { name: string; grade: string };
  };
}

export default function ChildInfo({ student }: ChildInfoProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="font-bold mb-3">اطلاعات فرزند</h3>
      <div className="space-y-2">
        <p>
          <span className="font-medium">نام: </span>
          {student.user.fullName}
        </p>
        <p>
          <span className="font-medium">پایه: </span>
          {student.class.grade}
        </p>
        <p>
          <span className="font-medium">کلاس: </span>
          {student.class.name}
        </p>
        <button className="mt-3 text-sm text-blue-600 hover:underline">
          مشاهده جزئیات کامل →
        </button>
      </div>
    </div>
  );
}