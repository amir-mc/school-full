// app/api/users/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from '@/types/user';

export async function POST(req: Request) {
  const data = await req.json();
  
  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const user = await prisma.user.create({
    data: {
      nationalId: data.nationalId,
      fullName: data.fullName,
      password: hashedPassword,
      phone: data.phone,
      role: data.role,
      ...(data.role === "STUDENT" && {
        student: {
          create: {
            classId: data.classId
          }
        }
      }),
      // شرایط مشابه برای معلم و والدین
    }
  });

  return NextResponse.json(user);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      nationalId: true,
      fullName: true,
      role: true,
      phone: true,
      createdAt: true
    }
  });

  const total = await prisma.user.count();

  return NextResponse.json({ 
    data: users as User[], 
    total 
  });
}