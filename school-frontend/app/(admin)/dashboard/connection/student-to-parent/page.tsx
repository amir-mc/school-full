// pages/connection/student-to-parent.tsx
'use client'
import { useEffect, useState } from 'react'

export default function AssignParentToStudent() {
  const [students, setStudents] = useState([])
  const [parents, setParents] = useState([])
  const [selectedParentId, setSelectedParentId] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3000/admin/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setStudents(data))

    fetch('http://localhost:3000/admin/parents/list', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setParents(data))
  }, []) 

  const handleAssign = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/admin/students/assign-parent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        studentId: selectedStudentId,
        parentId: selectedParentId
      })
    })

    if (res.ok) {
      alert('با موفقیت انجام شد')
    } else {
      alert('خطا در ثبت ارتباط')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">اتصال والد به دانش‌آموز</h1>

      <label className="block mb-2 font-medium">دانش‌آموز</label>
      <select
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setSelectedStudentId(e.target.value)}
      >
        <option value="">انتخاب دانش‌آموز</option>
        {students.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.user?.name}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">والدین</label>
      <select
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setSelectedParentId(e.target.value)}
      >
        <option value="">انتخاب والد</option>
        {parents.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.user?.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        ثبت
      </button>
    </div>
  )
}
