// app/(admin)/dashboard/messages/page.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Send,
  Eye,
  EyeOff,
  User,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';

interface Message {
  id: string;
  content: string;
  fromId: string;
  toId: string | null;
  isPublic: boolean;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    role: string;
  } | null;
  receiverId?:string
}

interface UserOption {
  id: string;
  name: string;
  username: string;
  role: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  // فیلترها
  const [searchQuery, setSearchQuery] = useState('');
  const [messageType, setMessageType] = useState('all');
  const [readStatus, setReadStatus] = useState('all');
  
  // ارسال پیام جدید
  const [showSendForm, setShowSendForm] = useState(false);
  const [newMessage, setNewMessage] = useState({
    toId: '',
    content: '',
    isPublic: false
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [messages, searchQuery, messageType, readStatus]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // دریافت پیام‌های ارسال شده توسط ادمین
      const response = await api.get('/messages/sent');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // اگر endpoint مخصوص ادمین نبود، همه پیام‌ها رو بگیر
      try {
        const allResponse = await api.get('/messages/public');
        setMessages(allResponse.data);
      } catch (secondError) {
        console.error('Error fetching public messages:', secondError);
        alert('خطا در دریافت پیام‌ها');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...messages];

    // فیلتر جستجو
    if (searchQuery) {
      filtered = filtered.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (message.receiver?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فیلتر نوع پیام
    if (messageType === 'public') {
      filtered = filtered.filter(message => message.isPublic);
    } else if (messageType === 'private') {
      filtered = filtered.filter(message => !message.isPublic);
    }

    // فیلتر وضعیت خوانده شدن
    if (readStatus === 'read') {
      filtered = filtered.filter(message => message.isRead);
    } else if (readStatus === 'unread') {
      filtered = filtered.filter(message => !message.isRead);
    }

    setFilteredMessages(filtered);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('آیا از حذف این پیام مطمئن هستید؟')) return;

    try {
      await api.delete(`/messages/${messageId}`);
      setMessages(messages.filter(message => message.id !== messageId));
      alert('✅ پیام با موفقیت حذف شد');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      alert(`خطا در حذف پیام: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.content.trim()) {
      alert('لطفاً متن پیام را وارد کنید');
      return;
    }

    if (!newMessage.isPublic && !newMessage.toId) {
      alert('برای پیام خصوصی باید گیرنده را انتخاب کنید');
      return;
    }

    setSending(true);

    try {
      console.log('📤 Sending message:', newMessage);

      const response = await api.post('/messages', {
        toId: newMessage.isPublic ? null : newMessage.toId,
        content: newMessage.content,
        isPublic: newMessage.isPublic
      });

      console.log('✅ Message sent:', response.data);
      
      alert('✅ پیام با موفقیت ارسال شد!');
      
      // بروزرسانی لیست و پاک کردن فرم
      fetchMessages();
      setNewMessage({
        toId: '',
        content: '',
        isPublic: false
      });
      setShowSendForm(false);
      
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      alert(`خطا در ارسال پیام: ${error.response?.data?.message || error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await api.patch(`/messages/mark-as-read/${messageId}`);
      
      // بروزرسانی local state
      setMessages(messages.map(message => 
        message.id === messageId ? { ...message, isRead: true } : message
      ));
      
      alert('✅ پیام به عنوان خوانده شده علامت‌گذاری شد');
    } catch (error: any) {
      console.error('Error marking message as read:', error);
      alert(`خطا در بروزرسانی پیام: ${error.response?.data?.message || error.message}`);
    }
  };

  const activeFiltersCount = [
    searchQuery,
    messageType !== 'all',
    readStatus !== 'all'
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery('');
    setMessageType('all');
    setReadStatus('all');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مدیریت پیام‌ها</h1>
          <p className="text-muted-foreground">
            مشاهده و ارسال پیام‌های سیستم
          </p>
        </div>
        <Button onClick={() => setShowSendForm(!showSendForm)}>
          <Plus className="h-4 w-4 ml-2" />
          {showSendForm ? 'بستن فرم ارسال' : 'ارسال پیام جدید'}
        </Button>
      </div>

      {/* فرم ارسال پیام جدید */}
      {showSendForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              ارسال پیام جدید
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              {/* نوع پیام */}
              <div className="space-y-2">
                <Label>نوع پیام</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={newMessage.isPublic ? "default" : "outline"}
                    onClick={() => setNewMessage({...newMessage, isPublic: true})}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    عمومی
                  </Button>
                  <Button
                    type="button"
                    variant={!newMessage.isPublic ? "default" : "outline"}
                    onClick={() => setNewMessage({...newMessage, isPublic: false})}
                    className="flex-1"
                  >
                    <EyeOff className="h-4 w-4 ml-2" />
                    خصوصی
                  </Button>
                </div>
              </div>

              {/* گیرنده (فقط برای پیام خصوصی) */}
              {!newMessage.isPublic && (
                <div className="space-y-2">
                  <Label htmlFor="toId">گیرنده *</Label>
                  <Select 
                    value={newMessage.toId} 
                    onValueChange={(value) => setNewMessage({...newMessage, toId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب گیرنده" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {user.name}
                            <Badge variant="outline" className="text-xs">
                              {user.role === 'ADMIN' ? 'مدیر' : 
                               user.role === 'TEACHER' ? 'معلم' : 
                               user.role === 'STUDENT' ? 'دانش‌آموز' : 'والد'}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* متن پیام */}
              <div className="space-y-2">
                <Label htmlFor="content">متن پیام *</Label>
                <Textarea
                  id="content"
                  value={newMessage.content}
                  onChange={(e:any) => setNewMessage({...newMessage, content: e.target.value})}
                  required
                  placeholder="متن پیام خود را وارد کنید..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {newMessage.content.length} کاراکتر
                </p>
              </div>

              {/* دکمه‌های ارسال */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowSendForm(false);
                    setNewMessage({
                      toId: '',
                      content: '',
                      isPublic: false
                    });
                  }}
                  className="flex-1"
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  disabled={sending}
                  className="flex-1"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      ارسال پیام
                      <Send className="h-4 w-4 mr-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                placeholder="متن پیام یا نام فرستنده/گیرنده..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* فیلتر نوع پیام */}
            <div className="space-y-2">
              <Label>نوع پیام</Label>
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger>
                  <SelectValue placeholder="همه پیام‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه پیام‌ها</SelectItem>
                  <SelectItem value="public">پیام‌های عمومی</SelectItem>
                  <SelectItem value="private">پیام‌های خصوصی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* فیلتر وضعیت خوانده شدن */}
            <div className="space-y-2">
              <Label>وضعیت خوانده شدن</Label>
              <Select value={readStatus} onValueChange={setReadStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="همه وضعیت‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="read">خوانده شده</SelectItem>
                  <SelectItem value="unread">خوانده نشده</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            پیام‌های ارسالی
            <Badge variant="outline" className="mr-2">
              {filteredMessages.length} پیام
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">در حال بارگذاری پیام‌ها...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ پیامی یافت نشد</h3>
              <p className="text-muted-foreground mb-4">
                {activeFiltersCount > 0 
                  ? 'با فیلترهای فعلی هیچ پیامی مطابقت ندارد.' 
                  : 'هنوز هیچ پیامی ارسال نشده است.'
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
                    <TableHead>فرستنده</TableHead>
                    <TableHead>گیرنده</TableHead>
                    <TableHead>متن پیام</TableHead>
                    <TableHead>نوع</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>تاریخ ارسال</TableHead>
                    <TableHead className="w-[180px]">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow 
                      key={message.id} 
                      className={`hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">مدیر</div>
                            <div className="text-xs text-muted-foreground">
                            
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    <TableCell>
  {message.isPublic ? (
    <Badge variant="default" className="bg-green-100 text-green-800">
      <Eye className="h-3 w-3 ml-1" />
      عمومی
    </Badge>
  ) : message.receiver ? (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="font-medium">
          {message.receiver.name || 'نامشخص'}
        </div>
        <div className="text-xs text-muted-foreground">
          {message.receiver.username || message.toId || '—'}
        </div>
      </div>
    </div>
  ) : message.toId ? (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="font-medium">کاربر سیستم</div>
        <div className="text-xs text-muted-foreground">
          شناسه: {message.toId.substring(0, 8)}...
        </div>
      </div>
    </div>
  ) : (
    <span className="text-muted-foreground">—</span>
  )}
</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={message.content}>
                          {message.content.length > 100 
                            ? message.content.substring(0, 100) + '...' 
                            : message.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        {message.isPublic ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            عمومی
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            خصوصی
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {message.isRead ? (
                          <Badge variant="default" className="bg-gray-100 text-gray-800">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            خوانده شده
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            <AlertCircle className="h-3 w-3 ml-1" />
                            خوانده نشده
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!message.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(message.id)}
                              title="علامت‌گذاری به عنوان خوانده شده"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/dashboard/messages/edit/${message.id}`, '_blank')}
                            title="ویرایش پیام"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMessage(message.id)}
                            title="حذف پیام"
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

      {/* آمار پیام‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
              <div className="text-sm text-blue-800">کل پیام‌ها</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.isPublic).length}
              </div>
              <div className="text-sm text-green-800">پیام عمومی</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {messages.filter(m => !m.isPublic).length}
              </div>
              <div className="text-sm text-purple-800">پیام خصوصی</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {messages.filter(m => !m.isRead).length}
              </div>
              <div className="text-sm text-yellow-800">خوانده نشده</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}