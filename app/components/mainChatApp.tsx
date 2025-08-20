"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoChatboxEllipses } from "react-icons/io5";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

export default function MainChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: messages.length + 2,
        role: "ai",
        text: data.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const aiMessage: Message = {
        id: messages.length + 2,
        role: "ai",
        text: "Sorry, something went wrong.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-[70vh] sm:h-[50vh] bg-[var(--color-bg-alt)] rounded-xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between flex-wrap gap-1">
        <h3 className="font-bold text-lg text-[var(--color-text)]">
          What2Watch AI
        </h3>
        <span className="text-sm text-[var(--color-text-muted)]">
          Ask for movie/TV ideas
        </span>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-xl break-words ${
                msg.role === "user"
                  ? "bg-[var(--color-primary)] text-[var(--color-text)] rounded-br-none"
                  : "bg-[var(--color-bg-hover)] text-[var(--color-text)] rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-[var(--color-border)] flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <input
          type="text"
          placeholder="Ask me about a movie or TV show..."
          className="flex-1 min-w-[60%] px-3 py-2 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none border border-[var(--color-border)] focus:border-[var(--color-primary)]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="p-2 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-text)] transition flex-shrink-0"
          onClick={handleSend}
        >
          <IoChatboxEllipses size={22} />
        </button>
      </div>
    </div>
  );
}
