'use client'

import { useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  username: string
}

export default function ConfirmParentsPage() {
  const [parents, setParents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await fetch('http://localhost:3000/admin/users?role=PARENT&confirmed=false', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('خطا در دریافت اطلاعات والدین')

        const data = await res.json()
        setParents(data)
      } catch (error) {
        console.error('خطا در دریافت والدین:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchParents()
  }, [token])

  const handleConfirm = async (userId: string) => {
    try {
      const res = await fetch('http://localhost:3000/admin/confirm/parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      })

      if (!res.ok) throw new Error('خطا در تأیید والد')

      setParents((prev) => prev.filter((u) => u.id !== userId))
    } catch (error) {
      console.error('خطا در تأیید والد:', error)
    }
  }

  if (loading) return <p className="text-center py-10">در حال بارگذاری...</p>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">تأیید والدین</h1>

      {parents.length === 0 ? (
        <p className="text-center text-gray-500">هیچ والد منتظر تأیید نیست.</p>
      ) : (
        <div className="space-y-4">
          {parents.map((parent) => (
            <div key={parent.id} className="border p-4 rounded shadow-sm">
              <div className="mb-2">
                <strong>نام:</strong> {parent.name}
              </div>
              <div className="mb-2">
                <strong>نام کاربری:</strong> {parent.username}
              </div>

              <button
                onClick={() => handleConfirm(parent.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
              >
                تأیید
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
