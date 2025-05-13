// src/app/parent-portal/dashboard/components/MessagesSection.tsx
'use client';

import { useEffect, useState } from "react";

interface MessagesSectionProps {
  parentId: number;
}

interface Message {
  id: number;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

export default function MessagesSection({ parentId }: MessagesSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch(`/api/messages?parentId=${parentId}`)
      .then(res => res.json())
      .then(setMessages);
  }, [parentId]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow col-span-3">
      <h3 className="font-bold mb-3">آخرین پیام‌ها</h3>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500">پیامی وجود ندارد</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg border ${
                !msg.isRead ? "bg-blue-50 border-blue-200" : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{msg.title}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(msg.date).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <p className="text-sm mt-1">{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}