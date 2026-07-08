"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm the QuickMate AI. How can I help you today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText.trim(), isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: data.text, isBot: true },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Sorry, I am having trouble connecting to the server.", isBot: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Do not render the chatbot on the admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-[90px] md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col transition-all transform origin-bottom-right">
          <div className="bg-emerald-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-bold text-sm">QuickMate Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white transition cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50/50 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.isBot ? "bg-white border border-slate-100 text-slate-700 rounded-tl-none" : "bg-emerald-600 text-white rounded-tr-none"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                   <div className="flex gap-1">
                     <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                     <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
                   </div>
                 </div>
               </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <button type="submit" disabled={!inputText.trim()} className="bg-emerald-600 text-white h-9 w-9 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-emerald-700 transition cursor-pointer">
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all cursor-pointer border-4 border-white"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
}
