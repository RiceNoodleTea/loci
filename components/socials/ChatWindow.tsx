"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import MessageBubble from "./MessageBubble";

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  groupId: string;
  currentUserId: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Aria Chen",
    content: "Has anyone started the organic chemistry review?",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "2",
    userId: "u2",
    userName: "Marcus Bell",
    content:
      "Yeah, I finished chapter 4 last night. The alkene reactions are tricky.",
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: "3",
    userId: "current",
    userName: "You",
    content: "I'm stuck on Markovnikov's rule. Can someone explain?",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "4",
    userId: "u1",
    userName: "Aria Chen",
    content:
      "Sure! Basically the hydrogen adds to the carbon with more hydrogens already. Think of it as 'the rich get richer'.",
    createdAt: new Date(Date.now() - 3600000 * 0.8).toISOString(),
  },
  {
    id: "5",
    userId: "u3",
    userName: "Priya Sharma",
    content: "That's a great mnemonic! Let's do a group quiz later tonight?",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "6",
    userId: "u2",
    userName: "Marcus Bell",
    content: "I'm in. 8pm works for me.",
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
];

export default function ChatWindow({
  groupId,
  currentUserId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = newMessage.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        userId: currentUserId,
        userName: "You",
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-parchment rounded-t-2xl">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            userName={msg.userName}
            content={msg.content}
            createdAt={msg.createdAt}
            isOwn={msg.userId === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border bg-white rounded-b-2xl p-3 flex items-center gap-2">
        <input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="input-base flex-1"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className={cn(
            "btn-primary p-2 rounded-lg",
            !newMessage.trim() && "opacity-40 cursor-not-allowed"
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
