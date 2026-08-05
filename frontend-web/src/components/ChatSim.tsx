"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Check, CheckCheck } from "lucide-react";

import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

interface ChatSimProps {
  taskId: string;
  currentUser: { id: string; name: string };
  otherUser: { id: string; name: string };
  onTaskStatusChange?: (status: string) => void;
}

export default function ChatSim({
  taskId,
  currentUser,
  otherUser,
  onTaskStatusChange,
}: ChatSimProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to Socket.io server
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
    socketRef.current = io(backendUrl);

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      socketRef.current?.emit('joinTaskRoom', { taskId });
    });

    socketRef.current.on('newMessage', (msg: any) => {
      // Avoid duplicating messages sent by ourselves
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [
          ...prev,
          {
            id: msg.id,
            senderId: msg.senderId,
            senderName: msg.senderRole === currentUser.id ? currentUser.name : otherUser.name, // Approximate name logic based on ID if needed, but msg might not send name
            text: msg.text,
            timestamp: new Date(msg.createdAt),
          },
        ];
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [taskId, currentUser.id, currentUser.name, otherUser.name]);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsgId = Date.now().toString();
    const newMsg: ChatMessage = {
      id: newMsgId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    
    // Emit to backend
    socketRef.current?.emit('sendMessage', {
      taskId,
      senderId: currentUser.id,
      text: inputText.trim(),
      senderRole: "user", // For mock purposes
    });

    setInputText("");
  };

  return (
    <div className="flex h-[420px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-50/50 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
            {otherUser.name.charAt(0)}
          </div>
          <div>
            <h5 className="text-sm font-semibold text-slate-800">
              {otherUser.name}
            </h5>
            <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isMe
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-slate-100 text-slate-800 rounded-tl-none"
                }`}
              >
                {!isMe && (
                  <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                    {msg.senderName}
                  </span>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[9px] opacity-75">
                  <span>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-none bg-slate-100 px-4 py-2.5">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input panel */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-slate-100 p-3 bg-slate-50/50"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${otherUser.name}...`}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow hover:bg-emerald-500 disabled:opacity-50 transition cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
