import { logout } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  logout()
  return NextResponse.json({ success: true })
}