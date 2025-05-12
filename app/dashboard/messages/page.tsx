// src/app/dashboard/messages/page.tsx (تکمیل شده)
'use client';

import { Message } from "@/types";
import { useState, useEffect } from "react";
import MessageList from "@/components/messages/MessageList";
import MessageInput from "@/components/messages/MessageInput";
import ContactList from "@/components/messages/ContactList";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  // دریافت پیام‌ها از API
  useEffect(() => {
    if (selectedContact) {
      fetch(`/api/messages?receiverId=${selectedContact}`)
        .then(res => res.json())
        .then(setMessages);
    }
  }, [selectedContact]);

  const sendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;
    
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        receiverId: selectedContact,
        content: newMessage
      })
    });
    
    // اضافه کردن پیام جدید به لیست (Optimistic Update)
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: newMessage,
      sender: { id: 'current-user', name: 'شما', role: 'TEACHER' },
      receiverId: selectedContact,
      createdAt: new Date().toISOString(),
      isRead: true
    }]);
    
    setNewMessage('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">پیام‌ها</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <ContactList 
            selectedContact={selectedContact}
            onSelect={setSelectedContact}
          />
        </div>
        <div className="md:col-span-3">
          {selectedContact ? (
            <>
              <MessageList messages={messages} />
              <MessageInput 
                value={newMessage}
                onChange={setNewMessage}
                onSend={sendMessage}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">لطفاً یک مخاطب انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}