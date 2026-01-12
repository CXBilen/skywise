"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plane, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  isTyping?: boolean;
  children?: React.ReactNode;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  isTyping,
  children,
}: ChatMessageProps) {
  const isUser = role === "user";
  const isSystem = role === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center py-2"
      >
        <div className="bg-slate-100 text-slate-600 text-sm px-4 py-2 rounded-full">
          {content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-3 py-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-9 w-9 shrink-0 shadow-md">
        {isUser ? (
          <>
            <AvatarImage src="/avatar-user.png" />
            <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/avatar-assistant.png" />
            <AvatarFallback className="bg-gradient-to-br from-sky-400 to-sky-600">
              <Plane className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          "flex flex-col gap-2 max-w-[85%] lg:max-w-[75%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-tr-md"
              : "bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-800 rounded-tl-md"
          )}
        >
          {isTyping ? (
            <div className="flex gap-1.5 py-1">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-current rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-current rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-current rounded-full"
              />
            </div>
          ) : (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>

        {children && <div className="w-full">{children}</div>}

        {timestamp && (
          <span className="text-xs text-slate-400 px-1">
            {timestamp.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
