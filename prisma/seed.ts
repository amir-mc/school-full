// prisma/seed.ts

import { PrismaClient } from '@/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  console.log('شروع فرآیند seed...')
  
  // حذف داده‌های موجود (اختیاری)
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.course.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.parent.deleteMany()
  await prisma.class.deleteMany()
  await prisma.user.deleteMany()

  // ایجاد کاربران
  const users = await prisma.user.createMany({
    data: [
      {
        nationalId: '1234567890',
        password: await hash('admin123', 12),
        fullName: 'مدیر سیستم',
        phone: '09123456789',
        role: 'SUPER_ADMIN'
      },
      {
        nationalId: '1111111111',
        password: await hash('teacher123', 12),
        fullName: 'معلم نمونه',
        phone: '09111111111',
        role: 'TEACHER'
      },
      {
        nationalId: '2222222222',
        password: await hash('parent123', 12),
        fullName: 'والد نمونه',
        phone: '09222222222',
        role: 'PARENT'
      },
      {
        nationalId: '3333333333',
        password: await hash('student123', 12),
        fullName: 'دانش‌آموز نمونه',
        phone: '09333333333',
        role: 'STUDENT'
      }
    ]
  })

  console.log(`تعداد ${users.count} کاربر ایجاد شد`)

  const adminUser = await prisma.user.create({
    data: {
      nationalId: '1234567890',
      password: await hash('admin123', 12),
      fullName: 'مدیر سیستم',
      phone: '09123456789',
      role: 'SUPER_ADMIN',
    }
  })

  const teacherUser = await prisma.user.create({
    data: {
      nationalId: '1111111111',
      password: await hash('teacher123', 12),
      fullName: 'معلم نمونه',
      phone: '09111111111',
      role: 'TEACHER',
    }
  })

  const parentUser = await prisma.user.create({
    data: {
      nationalId: '2222222222',
      password: await hash('parent123', 12),
      fullName: 'والد نمونه',
      phone: '09222222222',
      role: 'PARENT',
    }
  })

  const studentUser = await prisma.user.create({
    data: {
      nationalId: '3333333333',
      password: await hash('student123', 12),
      fullName: 'دانش‌آموز نمونه',
      phone: '09333333333',
      role: 'STUDENT',
    }
  })

  // ایجاد کلاس
  const class1 = await prisma.class.create({
    data: {
      name: 'کلاس اول',
      grade: 'اول دبستان',
    }
  })

  // ایجاد معلم
  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      teacherCode: 'T1001',
    }
  })

  // ایجاد والد
  const parent = await prisma.parent.create({
    data: {
      userId: parentUser.id,
    }
  })

  // ایجاد دانش‌آموز
  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      studentCode: 'S1001',
      parentId: parent.id,
      classId: class1.id,
    }
  })

  // ایجاد درس
  const course = await prisma.course.create({
    data: {
      name: 'ریاضی',
      classId: class1.id,
      teacherId: teacher.id,
    }
  })

  // ایجاد برنامه زمانی
  await prisma.schedule.create({
    data: {
      day: 'شنبه',
      startTime: '08:00',
      endTime: '09:30',
      courseId: course.id,
    }
  })

  // ایجاد حضورغیاب
  await prisma.attendance.create({
    data: {
      date: new Date(),
      status: 'PRESENT',
      studentId: student.id,
    }
  })

  // ایجاد نمره
  await prisma.grade.create({
    data: {
      value: 18.5,
      type: 'EXAM',
      courseId: course.id,
      studentId: student.id,
      teacherId: teacher.id,
    }
  })

  // ایجاد پیام
  await prisma.message.create({
    data: {
      content: 'اولین پیام سیستم',
      senderId: adminUser.id,
      receiverId: parentUser.id,
      parentId: parent.id,
    }
  })

  // ایجاد اعلان
  await prisma.notification.create({
    data: {
      title: 'اعلان جدید',
      message: 'این یک اعلان تستی است',
      userId: parentUser.id,
      parentId: parent.id,
      type: 'SYSTEM',
    }
  })
}

seed()
  .catch(e => {
    console.error('خطا در اجرای seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('اتصال به دیتابیس بسته شد')
  })