// src/app/parent-portal/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // اگر کاربر والد نباشد، به صفحه اصلی redirect شود
  if (session?.user.role !== "PARENT") {
    redirect("/");
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">پورتال والدین</h1>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}