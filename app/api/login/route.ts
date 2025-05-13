// app/api/login/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { nationalId, password } = await req.json()
    
    // ۱. یافتن کاربر
    const user = await prisma.user.findUnique({ 
    where: { nationalId } 
  })
    
     if (!user) {
    return NextResponse.json(
      { error: 'کاربری با این کدملی وجود ندارد' },
      { status: 401 }
    )
  }

    // ۲. بررسی صحت رمز عبور
      const passwordValid = await compare(password, user.password)
  if (!passwordValid) {
    return NextResponse.json(
      { error: 'رمز عبور نادرست است' },
      { status: 401 }
    )
  }

    // ۳. ایجاد توکن JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // ۴. تنظیم کوکی
    const response = NextResponse.json({
      id: user.id,
      role: user.role,
      fullName: user.fullName
    })
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 هفته
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    )
  }
}