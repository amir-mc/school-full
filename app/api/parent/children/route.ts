// src/app/api/parent/children/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get("parentId");

  const children = await prisma.student.findMany({
    where: { parentId: Number(parentId) },
    include: { 
      user: { select: { fullName: true } },
      class: true 
    }
  });

  return NextResponse.json(children[0]); // فرض بر اینکه هر والد فقط یک فرزند دارد
}