// app/(admin)/dashboard/grades/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react';
import api from '@/lib/api';
//import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

interface Grade {
  id: string;
  studentId: string;
  subject: string;
  value: number;
  createdAt: string;
  student: {
    id: string;
    user: {
      id: string;
      name: string;
    };
    class?: {
      id: string;
      name: string;
      grade: number;
      teachers?: Array<{
        id: string;
        user: {
          id: string;
          name: string;
        };
      }>;
    };
  };
}

interface Class {
  id: string;
  name: string;
  grade: number;
  teachers?: Array<{
    id: string;
    user: {
      id: string;
      name: string;
    };
  }>;
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  
  // فیلترها
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // سورت
  const [sortField, setSortField] = useState<'value' | 'createdAt' | 'studentName'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const router=useRouter()
  useEffect(() => {
    fetchGrades();
    fetchClasses();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [grades, searchQuery, selectedClass, selectedTeacher, selectedSubject, sortField, sortOrder]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await api.get('/grades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      alert('خطا در دریافت لیست نمرات');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...grades];

    // فیلتر جستجو
    if (searchQuery) {
      filtered = filtered.filter(grade =>
        grade.student.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فیلتر کلاس
    if (selectedClass !== 'all') {
      filtered = filtered.filter(grade =>
        grade.student.class?.id === selectedClass
      );
    }

    // فیلتر معلم
    if (selectedTeacher !== 'all') {
      filtered = filtered.filter(grade =>
        grade.student.class?.teachers?.some(teacher => teacher.id === selectedTeacher)
      );
    }

    // فیلتر درس
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(grade => grade.subject === selectedSubject);
    }

    // سورت
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'studentName':
          aValue = a.student.user.name;
          bValue = b.student.user.name;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredGrades(filtered);
  };

  const handleDeleteGrade = async (gradeId: string) => {
    if (!confirm('آیا از حذف این نمره مطمئن هستید؟')) return;

    try {
      await api.delete(`/grades/${gradeId}`);
      setGrades(grades.filter(grade => grade.id !== gradeId));
      alert('✅ نمره با موفقیت حذف شد');
    } catch (error: any) {
      console.error('Error deleting grade:', error);
      alert(`خطا در حذف نمره: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSort = (field: 'value' | 'createdAt' | 'studentName') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getUniqueSubjects = () => {
    const subjects = new Set(grades.map(grade => grade.subject));
    return Array.from(subjects);
  };

  const getAllTeachers = () => {
    const teachers: { id: string; name: string }[] = [];
    classes.forEach(cls => {
      cls.teachers?.forEach(teacher => {
        if (!teachers.some(t => t.id === teacher.id)) {
          teachers.push({
            id: teacher.id,
            name: teacher.user.name
          });
        }
      });
    });
    return teachers;
  };

  const activeFiltersCount = [
    searchQuery,
    selectedClass !== 'all',
    selectedTeacher !== 'all',
    selectedSubject !== 'all'
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedClass('all');
    setSelectedTeacher('all');
    setSelectedSubject('all');
  };

  const getGradeColor = (value: number) => {
    if (value >= 17) return 'bg-green-100 text-green-800';
    if (value >= 14) return 'bg-blue-100 text-blue-800';
    if (value >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مدیریت نمرات</h1>
          <p className="text-muted-foreground">
            مشاهده و مدیریت تمام نمرات سیستم
          </p>
        </div>
        <Button onClick={() => window.open('/dashboard/grades/create', '_blank')}>
          <Plus className="h-4 w-4 ml-2" />
          ثبت نمره جدید
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فیلتر و جستجو
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="mr-2">
                  {activeFiltersCount} فیلتر فعال
                </Badge>
              )}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                پاک کردن فیلترها
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* جستجو */}
            <div className="space-y-2">
              <Label>جستجو</Label>
              <Input
                placeholder="دانش‌آموز یا درس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* فیلتر کلاس */}
            <div className="space-y-2">
              <Label>کلاس</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="همه کلاس‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه کلاس‌ها</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} (پایه {cls.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* فیلتر معلم */}
            <div className="space-y-2">
              <Label>معلم</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="همه معلمان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه معلمان</SelectItem>
                  {getAllTeachers().map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* فیلتر درس */}
            <div className="space-y-2">
              <Label>درس</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="همه دروس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه دروس</SelectItem>
                  {getUniqueSubjects().map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            لیست نمرات
            <Badge variant="outline" className="mr-2">
              {filteredGrades.length} نمره
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">در حال بارگذاری نمرات...</p>
            </div>
          ) : filteredGrades.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ نمره‌ای یافت نشد</h3>
              <p className="text-muted-foreground mb-4">
                {activeFiltersCount > 0 
                  ? 'با فیلترهای فعلی هیچ نمره‌ای مطابقت ندارد.' 
                  : 'هنوز هیچ نمره‌ای در سیستم ثبت نشده است.'
                }
              </p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={resetFilters}>
                  پاک کردن فیلترها
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('studentName')}
                        className="flex items-center gap-1 p-0 h-auto"
                      >
                        دانش‌آموز
                        {sortField === 'studentName' && (
                          sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>کلاس</TableHead>
                    <TableHead>معلمان</TableHead>
                    <TableHead>درس</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('value')}
                        className="flex items-center gap-1 p-0 h-auto"
                      >
                        نمره
                        {sortField === 'value' && (
                          sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('createdAt')}
                        className="flex items-center gap-1 p-0 h-auto"
                      >
                        تاریخ ثبت
                        {sortField === 'createdAt' && (
                          sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[120px]">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((grade) => (
                    <TableRow key={grade.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {grade.student.user.name}
                      </TableCell>
                      <TableCell>
                        {grade.student.class ? (
                          <Badge variant="outline">
                            {grade.student.class.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {grade.student.class?.teachers && grade.student.class.teachers.length > 0 ? (
                            grade.student.class.teachers.map(teacher => (
                              <Badge key={teacher.id} variant="secondary" className="text-xs">
                                {teacher.user.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {grade.subject}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(grade.value)}>
                          {grade.value.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(grade.createdAt).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/dashboard/grades/edit/${grade.id}`)}
                                title="ویرایش نمره"
                                >
                                <Edit className="h-4 w-4" />
                                </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteGrade(grade.id)}
                            title="حذف نمره"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}