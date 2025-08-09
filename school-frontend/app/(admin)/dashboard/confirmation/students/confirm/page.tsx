'use client'

import { useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  username: string
  role: string
  selectedClass?: string
}

type ClassType = {
  id: string
  name: string
  grade: number
}

export default function ConfirmStudentsPage() {
  const [students, setStudents] = useState<User[]>([])
  const [classes, setClasses] = useState<ClassType[]>([])
  const [loading, setLoading] = useState(true)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes] = await Promise.all([
          fetch('http://localhost:3000/admin/users?role=STUDENT&confirmed=false', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:3000/admin/classes', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        if (!studentsRes.ok || !classesRes.ok) throw new Error('خطا در دریافت اطلاعات')

        const studentsData = await studentsRes.json()
        const classData = await classesRes.json()

        setStudents(studentsData)
        setClasses(classData)
      } catch (error) {
        console.error('خطا:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleConfirm = async (userId: string, classId: string) => {
    if (!classId) {
      alert('لطفاً کلاس را انتخاب کنید')
      return
    }

    try {
      const res = await fetch('http://localhost:3000/admin/confirm/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, classId }),
      })

      if (!res.ok) throw new Error('خطا در تأیید کاربر')

      setStudents((prev) => prev.filter((u) => u.id !== userId))
    } catch (error) {
      console.error('خطا در تأیید دانش‌آموز:', error)
    }
  }

  if (loading) return <p className="text-center py-10">در حال بارگذاری...</p>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">تأیید دانش‌آموزان</h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-500">هیچ دانش‌آموزی در انتظار تأیید نیست.</p>
      ) : (
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="border p-4 rounded shadow-sm">
              <div className="mb-2">
                <strong>نام:</strong> {student.name}
              </div>
              <div className="mb-2">
                <strong>نام کاربری:</strong> {student.username}
              </div>

              <div className="flex items-center gap-4">
                <select
                  className="border rounded px-3 py-1"
                  onChange={(e) => {
                    const selected = e.target.value
                    setStudents((prev) =>
                      prev.map((u) => u.id === student.id ? { ...u, selectedClass: selected } : u)
                    )
                  }}
                  value={student.selectedClass || ''}
                >
                  <option value="">انتخاب کلاس</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} (پایه {cls.grade})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleConfirm(student.id, student.selectedClass || '')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                >
                  تأیید
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
