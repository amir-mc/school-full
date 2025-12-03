// app/(admin)/dashboard/messages/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Save,
  RotateCcw,
  MessageSquare,
  User,
  Clock,
  Eye,
  EyeOff
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
}

export default function EditMessagePage() {
  const params = useParams();
  const messageId = params.id as string;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    content: '',
    isPublic: false
  });
  const [originalMessage, setOriginalMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (messageId) {
      fetchMessageData();
    }
  }, [messageId]);

// در EditMessagePage - اصلاح fetchMessageData
const fetchMessageData = async () => {
  try {
    setLoading(true);
    
    console.log('🔄 Fetching message with ID:', messageId);
    
    // روش ۱: ابتدا همه پیام‌های ارسال شده رو بگیر
    try {
      const response = await api.get('/messages/sent');
      const allMessages = Array.isArray(response.data) ? response.data : [];
      const specificMessage = allMessages.find((m: Message) => m.id === messageId);
      
      if (specificMessage) {
        setOriginalMessage(specificMessage);
        setFormData({
          content: specificMessage.content,
          isPublic: specificMessage.isPublic
        });
        return;
      }
    } catch (sentError) {
      console.log('❌ Error fetching sent messages:', sentError);
    }
    
    // روش ۲: اگر نشد، از همه پیام‌ها بگیر
    try {
      const allResponse = await api.get('/messages/inbox');
      const allMessages = Array.isArray(allResponse.data) ? allResponse.data : [];
      const specificMessage = allMessages.find((m: Message) => m.id === messageId);
      
      if (specificMessage) {
        setOriginalMessage(specificMessage);
        setFormData({
          content: specificMessage.content,
          isPublic: specificMessage.isPublic
        });
        return;
      }
    } catch (inboxError) {
      console.log('❌ Error fetching inbox messages:', inboxError);
    }
    
    // روش ۳: از endpoint عمومی
    try {
      const publicResponse = await api.get('/messages/public');
      const allMessages = Array.isArray(publicResponse.data) ? publicResponse.data : [];
      const specificMessage = allMessages.find((m: Message) => m.id === messageId);
      
      if (specificMessage) {
        setOriginalMessage(specificMessage);
        setFormData({
          content: specificMessage.content,
          isPublic: specificMessage.isPublic
        });
        return;
      }
    } catch (publicError) {
      console.log('❌ Error fetching public messages:', publicError);
    }
    
    throw new Error('پیام مورد نظر یافت نشد');

  } catch (error: any) {
    console.error('❌ Error fetching message data:', error);
    alert(`خطا در دریافت اطلاعات پیام: ${error.response?.data?.message || error.message || error.message}`);
    router.push('/dashboard/messages');
  } finally {
    setLoading(false);
  }
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      alert('لطفاً متن پیام را وارد کنید');
      return;
    }

    setUpdating(true);

    try {
      console.log('📤 Updating message:', {
        messageId,
        ...formData
      });

      const response = await api.patch(`/messages/${messageId}`, {
        content: formData.content,
        isPublic: formData.isPublic
      });

      console.log('✅ Message updated:', response.data);
      
      alert('✅ پیام با موفقیت ویرایش شد!');
      router.push('/dashboard/messages');
      
    } catch (error: any) {
      console.error('❌ Error updating message:', error);
      alert(`خطا در ویرایش پیام: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleReset = () => {
    if (originalMessage) {
      setFormData({
        content: originalMessage.content,
        isPublic: originalMessage.isPublic
      });
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR');
  };

  const hasChanges = () => {
    if (!originalMessage) return false;
    
    return (
      formData.content !== originalMessage.content ||
      formData.isPublic !== originalMessage.isPublic
    );
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">در حال دریافت اطلاعات پیام...</p>
        </div>
      </div>
    );
  }

  if (!originalMessage) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Alert className="bg-red-50 border-red-200">
          پیام مورد نظر یافت نشد
        </Alert>
        <Button onClick={() => router.push('/dashboard/messages')}>
          بازگشت به لیست پیام‌ها
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ویرایش پیام</h1>
        <p className="text-muted-foreground">
          اطلاعات پیام را ویرایش کنید
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            فرم ویرایش پیام
            {hasChanges() && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                تغییرات ذخیره نشده
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اطلاعات پیام */}
            <div className="space-y-4">
              <Label>اطلاعات پیام</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* فرستنده */}
                <div className="p-3 border rounded-md bg-gray-50">
  <div className="flex items-center gap-2 mb-1">
    <User className="h-4 w-4 text-gray-600" />
    <span className="font-medium">فرستنده:</span>
  </div>
  <div className="flex justify-between items-center">
    <span>{originalMessage.sender?.name || 'نامشخص'}</span>
    <Badge variant="outline" className="text-xs">
      {originalMessage.sender?.username || originalMessage.fromId || '—'}
    </Badge>
  </div>
</div>
</div>

                {/* گیرنده */}
                <div className="p-3 border rounded-md bg-gray-50">
  <div className="flex items-center gap-2 mb-1">
    <User className="h-4 w-4 text-gray-600" />
    <span className="font-medium">گیرنده:</span>
  </div>
  {originalMessage.isPublic ? (
    <Badge variant="default" className="bg-green-100 text-green-800">
      پیام عمومی
    </Badge>
  ) : originalMessage.receiver ? (
    <div className="flex justify-between items-center">
      <span>{originalMessage.receiver?.name || 'نامشخص'}</span>
      <Badge variant="outline" className="text-xs">
        {originalMessage.receiver?.username || originalMessage.toId || '—'}
      </Badge>
    </div>
  ) : originalMessage.toId ? (
    <div className="text-sm text-muted-foreground">
      شناسه گیرنده: {originalMessage.toId}
    </div>
  ) : (
    <span className="text-muted-foreground">—</span>
  )}
</div>
              {/* تاریخ و وضعیت */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-md bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">تاریخ ارسال:</span>
                  </div>
                  <span className="text-sm">{formatDate(originalMessage.createdAt)}</span>
                </div>

                <div className="p-3 border rounded-md bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">وضعیت:</span>
                  </div>
                  <Badge variant={originalMessage.isRead ? "default" : "secondary"}>
                    {originalMessage.isRead ? 'خوانده شده' : 'خوانده نشده'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* نوع پیام */}
            <div className="space-y-2">
              <Label>نوع پیام</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.isPublic ? "default" : "outline"}
                  onClick={() => handleChange('isPublic', true)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 ml-2" />
                  عمومی
                </Button>
                <Button
                  type="button"
                  variant={!formData.isPublic ? "default" : "outline"}
                  onClick={() => handleChange('isPublic', false)}
                  className="flex-1"
                >
                  <EyeOff className="h-4 w-4 ml-2" />
                  خصوصی
                </Button>
              </div>
            </div>

            {/* متن پیام */}
            <div className="space-y-2">
              <Label htmlFor="content">متن پیام *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e:any) => handleChange('content', e.target.value)}
                required
                placeholder="متن پیام را ویرایش کنید..."
                rows={6}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formData.content.length} کاراکتر</span>
                <span>{originalMessage.content.length} کاراکتر (اصلی)</span>
              </div>
            </div>

            {/* مقایسه تغییرات */}
            {hasChanges() && originalMessage && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-16">نوع:</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="line-through text-red-600">
                          {originalMessage.isPublic ? 'عمومی' : 'خصوصی'}
                        </Badge>
                        <span className="text-blue-600">→</span>
                        <Badge variant="default">
                          {formData.isPublic ? 'عمومی' : 'خصوصی'}
                        </Badge>
                      </div>
                    </div>
                    {formData.content !== originalMessage.content && (
                      <div className="space-y-1">
                        <div className="font-medium">تغییرات متن:</div>
                        <div className="text-sm bg-red-50 p-2 rounded border border-red-200 line-through">
                          {originalMessage.content.length > 200 
                            ? originalMessage.content.substring(0, 200) + '...' 
                            : originalMessage.content}
                        </div>
                        <div className="text-sm bg-green-50 p-2 rounded border border-green-200">
                          {formData.content.length > 200 
                            ? formData.content.substring(0, 200) + '...' 
                            : formData.content}
                        </div>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* دکمه‌های اقدام */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={updating}
              >
                بازگشت
              </Button>
              
              {hasChanges() && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={updating}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  بازنشانی
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={
                  updating || 
                  !formData.content.trim() ||
                  !hasChanges()
                }
                className="flex-1"
              >
                {updating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    در حال ویرایش...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    ذخیره تغییرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}