// app/(admin)/dashboard/feedback/page.tsx
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
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Filter,
  Star,
  User,
  MessageSquare,
  X,
  ThumbsUp
} from 'lucide-react';
import api from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Feedback {
  id: string;
  parentId: string;
  teacherId: string;
  score: number;
  comment: string | null;
  createdAt: string;
  parent: {
    id: string;
    user: {
      id: string;
      name: string;
      username: string;
    };
  };
  teacher: {
    id: string;
    user: {
      id: string;
      name: string;
      username: string;
    };
  };
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  // فیلترها
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState('0');
  const [maxScore, setMaxScore] = useState('5');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbacks, searchQuery, minScore, maxScore]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      // دریافت بازخوردهای همه معلمان
      const response = await api.get('/feedback/all');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      // اگر endpoint عمومی نبود، از endpoint معلمان استفاده کن
      try {
        const teachersResponse = await api.get('/admin/teachers/list');
        const allFeedbacks: Feedback[] = [];
        
        // برای هر معلم بازخوردها رو بگیر
        for (const teacher of teachersResponse.data) {
          try {
            const feedbackResponse = await api.get(`/feedback/${teacher.id}`);
            if (Array.isArray(feedbackResponse.data)) {
              allFeedbacks.push(...feedbackResponse.data);
            }
          } catch (teacherError) {
            console.error(`Error fetching feedback for teacher ${teacher.id}:`, teacherError);
          }
        }
        
        setFeedbacks(allFeedbacks);
      } catch (secondError) {
        console.error('Error fetching teachers:', secondError);
        alert('خطا در دریافت بازخوردها');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...feedbacks];

    // فیلتر جستجو
    if (searchQuery) {
      filtered = filtered.filter(feedback =>
        feedback.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.parent.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.teacher.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فیلتر امتیاز
    const min = parseInt(minScore);
    const max = parseInt(maxScore);
    if (!isNaN(min)) {
      filtered = filtered.filter(feedback => feedback.score >= min);
    }
    if (!isNaN(max)) {
      filtered = filtered.filter(feedback => feedback.score <= max);
    }

    setFilteredFeedbacks(filtered);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'bg-green-100 text-green-800';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreStars = (score: number) => {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  const activeFiltersCount = [
    searchQuery,
    minScore !== '0',
    maxScore !== '5'
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery('');
    setMinScore('0');
    setMaxScore('5');
  };

  // آمار بازخوردها
  const stats = {
    total: feedbacks.length,
    averageScore: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length).toFixed(1)
      : '0.0',
    withComments: feedbacks.filter(f => f.comment).length,
    highScore: feedbacks.filter(f => f.score >= 4).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">مدیریت بازخوردها</h1>
        <p className="text-muted-foreground">
          مشاهده بازخوردهای والدین به معلمان
        </p>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-800">کل بازخوردها</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.averageScore}</div>
              <div className="text-sm text-green-800">میانگین امتیاز</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.withComments}</div>
              <div className="text-sm text-purple-800">دارای نظر</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.highScore}</div>
              <div className="text-sm text-yellow-800">امتیاز بالا</div>
            </div>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* جستجو */}
            <div className="space-y-2">
              <Label>جستجو</Label>
              <Input
                placeholder="والد، معلم یا متن نظر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* امتیاز حداقل */}
            <div className="space-y-2">
              <Label>امتیاز حداقل</Label>
              <Select value={minScore} onValueChange={setMinScore}>
                <SelectTrigger>
                  <SelectValue placeholder="حداقل امتیاز" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map(score => (
                    <SelectItem key={score} value={score.toString()}>
                      <div className="flex items-center gap-2">
                        {score} امتیاز
                        <div className="text-yellow-500">
                          {'★'.repeat(score)}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* امتیاز حداکثر */}
            <div className="space-y-2">
              <Label>امتیاز حداکثر</Label>
              <Select value={maxScore} onValueChange={setMaxScore}>
                <SelectTrigger>
                  <SelectValue placeholder="حداکثر امتیاز" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(score => (
                    <SelectItem key={score} value={score.toString()}>
                      <div className="flex items-center gap-2">
                        {score} امتیاز
                        <div className="text-yellow-500">
                          {'★'.repeat(score)}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedbacks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
            لیست بازخوردها
            <Badge variant="outline" className="mr-2">
              {filteredFeedbacks.length} بازخورد
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">در حال بارگذاری بازخوردها...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ بازخوردی یافت نشد</h3>
              <p className="text-muted-foreground mb-4">
                {activeFiltersCount > 0 
                  ? 'با فیلترهای فعلی هیچ بازخوردی مطابقت ندارد.' 
                  : 'هنوز هیچ بازخوردی ثبت نشده است.'
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
                    <TableHead>والد</TableHead>
                    <TableHead>معلم</TableHead>
                    <TableHead>امتیاز</TableHead>
                    <TableHead>نظر</TableHead>
                    <TableHead>تاریخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.map((feedback) => (
                    <TableRow key={feedback.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{feedback.parent.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {feedback.parent.user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{feedback.teacher.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {feedback.teacher.user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getScoreColor(feedback.score)}>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              {feedback.score}
                              <span className="text-xs">/5</span>
                            </div>
                          </Badge>
                          <div className="text-yellow-500 text-sm">
                            {getScoreStars(feedback.score)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {feedback.comment ? (
                          <div className="text-sm" title={feedback.comment}>
                            {feedback.comment.length > 100 
                              ? feedback.comment.substring(0, 100) + '...' 
                              : feedback.comment}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">بدون نظر</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(feedback.createdAt)}
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