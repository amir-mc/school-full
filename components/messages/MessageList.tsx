// src/components/messages/MessageList.tsx
'use client';

import { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4 mb-6">
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">هیچ پیامی وجود ندارد</p>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.sender.role === 'TEACHER'
                ? 'bg-blue-50 border border-blue-100 ml-8'
                : 'bg-gray-50 border border-gray-100 mr-8'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">
                  {message.sender.name} ({message.sender.role === 'TEACHER' ? 'معلم' : 'والدین'})
                </h4>
                <p className="mt-1">{message.content}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleTimeString('fa-IR')}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}