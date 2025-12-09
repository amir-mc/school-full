import { useRouter } from "next/navigation";


// app/(admin)/components/Header.tsx
export default function Header() {
  const router=useRouter()
  const handelClickLogOut = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login')
  }
  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
      <div className="text-lg font-semibold">خوش آمدید ادمین عزیز 👋</div>
      <button onClick={handelClickLogOut} className="text-sm text-red-600 hover:underline">خروج</button>
    </header>
  )
}
