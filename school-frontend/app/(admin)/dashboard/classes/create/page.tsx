// app/(admin)/dashboard/classes/create/page.tsx

import CreateClassForm from "../../components/classes/CreateClassForm";


export default function CreateClassPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ایجاد کلاس جدید</h1>
        <p className="text-muted-foreground">
          اطلاعات کلاس جدید را وارد کنید
        </p>
      </div>

      <CreateClassForm />
    </div>
  );
}