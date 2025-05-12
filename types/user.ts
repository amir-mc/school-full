export interface User {
  id: string;
  nationalId: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
  phone: string;
  createdAt?: string; // اختیاری کردن این فیلد
}