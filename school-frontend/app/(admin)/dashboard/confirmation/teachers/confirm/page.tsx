'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

type User = {
  id: string
  name: string
  username: string
  role: 'TEACHER'
}

export default function TeacherConfirmationPage() {
  const [teachers, setTeachers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchUnconfirmedTeachers = async () => {
    try {
      const token = localStorage.getItem('token') // فرض بر اینه که توکن در localStorage ذخیره شده

      const res = await fetch('http://localhost:3000/admin/users?role=TEACHER&confirmed=false', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setTeachers(data)
    } catch (error) {
      console.error('خطا در دریافت لیست معلم‌ها:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchUnconfirmedTeachers()
}, [])


  const confirmTeacher = async (userId: string) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:3000/admin/confirm/teacher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    })

    if (!res.ok) throw new Error('تأیید با شکست مواجه شد')

    setTeachers(prev => prev.filter(t => t.id !== userId))
  } catch (error) {
    console.error('خطا در تأیید معلم:', error)
  }
}

  if (loading) return <p className="text-center mt-10 text-gray-500">در حال بارگذاری...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">تأیید معلم‌ها</h1>

      {teachers.length === 0 ? (
        <p className="text-gray-500">هیچ معلمی برای تأیید وجود ندارد.</p>
      ) : (
        <div className="space-y-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <p className="font-semibold">{teacher.name}</p>
                <p className="text-sm text-gray-500">{teacher.username}</p>
              </div>
              <Button
                onClick={() => confirmTeacher(teacher.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                تأیید
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
