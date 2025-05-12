import { getServerSession } from "next-auth";

// POST: ثبت نمره جدید
export async function POST(req: Request) {
  const { studentId, courseId, value, type } = await req.json();
  // اعتبارسنجی با NextAuth (فقط معلم‌ها دسترسی دارند)
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "TEACHER") {
    return new Response(JSON.stringify({ error: "دسترسی ممنوع" }), { status: 403 });
  }

  const newGrade = await prisma.grade.create({
    data: {
      studentId,
      courseId,
      teacherId: session.user.id,
      value,
      type,
    },
  });
  return Response.json(newGrade);
}

// GET: دریافت نمرات دانش‌آموز
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const grades = await prisma.grade.findMany({
    where: { studentId },
    include: { course: true },
  });
  return Response.json(grades);
}