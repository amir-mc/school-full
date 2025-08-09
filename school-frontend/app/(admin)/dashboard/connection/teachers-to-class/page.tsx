// pages/admin/teachers-to-class.tsx
'use client'
import { useEffect, useState } from 'react'

export default function AssignTeachersToClass() {
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([])
  const [selectedClassId, setSelectedClassId] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3000/admin/teachers/list', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setTeachers(data))

    fetch('http://localhost:3000/admin/classes', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setClasses(data))
  }, [])

  const handleAssign = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/admin/teachers/assign-teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        classId: selectedClassId,
        teacherIds: selectedTeacherIds
      })
    })

    if (res.ok) {
      alert('با موفقیت انجام شد')
    } else {
      alert('خطا در انجام عملیات')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">اتصال معلم به کلاس</h1>

      <label className="block mb-2 font-medium">کلاس</label>
      <select
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setSelectedClassId(e.target.value)}
      >
        <option value="">یک کلاس انتخاب کنید</option>
        {classes.map((cls: any) => (
          <option key={cls.id} value={cls.id}>{cls.name} (پایه {cls.grade})</option>
        ))}
      </select>

      <label className="block mb-2 font-medium">معلمان</label>
      <select
        multiple
        className="w-full p-2 border rounded h-40"
        onChange={(e) =>
          setSelectedTeacherIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
      >
        {teachers.map((t: any) => (
          <option key={t.id} value={t.id}>
            {t.user?.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ثبت
      </button>
    </div>
  )
}
