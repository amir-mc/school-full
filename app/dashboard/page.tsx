// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import ParentDashboard from "@/components/dashboard/ParentDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-4">
      {session.user.role === "SUPER_ADMIN" && <AdminDashboard />}
      {session.user.role === "TEACHER" && <TeacherDashboard />}
      {session.user.role === "PARENT" && <ParentDashboard />}
      {session.user.role === "STUDENT" && <StudentDashboard />}
    </div>
  );
}