// app/(admin)/components/Sidebar.tsx
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/dashboard/users", label: "کاربران" },
  { href: "/dashboard/classes", label: "کلاس‌ها" },
  { href: "/dashboard/grades", label: "نمرات" },
  { href: "/dashboard/schedule", label: "برنامه‌ریزی" },
  { href: "/dashboard/messages", label: "پیام‌ها" },
  { href: "/dashboard/feedback", label: "بازخوردها" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-6">پنل ادمین</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              pathname === link.href
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
