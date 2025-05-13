// src/app/api/attendance/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface AttendanceStat {
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  _count: {
    _all: number;
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "پارامتر studentId الزامی است" },
      { status: 400 }
    );
  }

  const stats = await prisma.attendance.groupBy({
    by: ["status"],
    where: { studentId: Number(studentId) },
    _count: { _all: true },
  }) as AttendanceStat[];

  return NextResponse.json({
    present: stats.find((s: AttendanceStat) => s.status === "PRESENT")?._count._all || 0,
    absent: stats.find((s: AttendanceStat) => s.status === "ABSENT")?._count._all || 0,
    late: stats.find((s: AttendanceStat) => s.status === "LATE")?._count._all || 0,
    excused: stats.find((s: AttendanceStat) => s.status === "EXCUSED")?._count._all || 0,
  });
}