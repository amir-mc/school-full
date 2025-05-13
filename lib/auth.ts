import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@/generated/prisma'


const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret'

export async function login(nationalId: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { nationalId }
  })

  if (!user || user.password !== password) {
    throw new Error('اطلاعات ورود نامعتبر است')
  }

  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  )

  // استفاده صحیح با await
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return { id: user.id, role: user.role }
}

export async function getCurrentUser() {
  // استفاده صحیح با await
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    return await prisma.user.findUnique({ 
      where: { id: parseInt(decoded.id) },
      select: {
        id: true,
        nationalId: true,
        fullName: true,
        role: true
      }
    })
  } catch {
    return null
  }
}

export async function logout() {
  // استفاده صحیح با await
  const cookieStore = await cookies()
  cookieStore.delete('token')
}