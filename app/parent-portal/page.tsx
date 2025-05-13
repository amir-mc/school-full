// src/app/parent-portal/dashboard/page.tsx
'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChildInfo from "./components/ChildInfo";
import GradesOverview from "./components/GradesOverview";
import { Student } from "@/types";
import AttendanceStats from "./components/AttendanceStats";
import MessagesSection from "./components/MessagesSection";

export default function ParentPortalPage() {
  const { data: session } = useSession();
  const [childData, setChildData] = useState<Student | null>(null);

  useEffect(() => {
    if (session?.user.id) {
      fetch(`/api/parent/children?parentId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setChildData(data));
    }
  }, [session]);

  if (!childData) return <p>در حال بارگذاری...</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">پنل والدین</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChildInfo student={childData} />
        <GradesOverview studentId={childData.id} />
        <AttendanceStats studentId={childData.id} />
      </div>

      <MessagesSection  parentId={Number(session?.user.id)} />
    </div>
  );
}