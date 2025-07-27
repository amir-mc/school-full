// /app/admin/users/create/page.tsx
import CreateUserForm from '../CreateUserForm';

export default function CreateUserPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ایجاد کاربر جدید</h1>
      <CreateUserForm />
    </div>
  );
}
