// src/app/(auth)/login/page.tsx
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          ورود به سیستم مدیریت مدرسه
        </h1>
        
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              nationalId: formData.get("nationalId"),
              password: formData.get("password"),
              redirect: true,
              redirectTo: "/dashboard",
            });
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
              کدملی
            </label>
            <input
              id="nationalId"
              name="nationalId"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              رمزعبور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ورود به سیستم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}