'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [nationalId, setNationalId] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId, password }),
      })
      if (res.ok) router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
   
      <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">ورود به سیستم</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">کدملی</label>
          <input
            name="nationalId"
            type="text"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">رمزعبور</label>
          <input
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          ورود
        </button>
      </form>

  )
}