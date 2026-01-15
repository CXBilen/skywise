"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plane, User, Sparkles, AlertCircle, CheckCircle2, Search } from "lucide-react";
import { ConfidenceIndicator, getConfidenceLevel } from "./confidence-indicator";

// Simple markdown parser for bold text
function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the bold text
    parts.push(<strong key={match.index} className="font-semibold">{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  isTyping?: boolean;
  confidence?: number;
  showConfidence?: boolean;
  messageType?: "flight_options" | "trip_summary" | "conflict" | "imported_trip" | "success" | "error" | "searching";
  children?: React.ReactNode;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  isTyping,
  confidence,
  showConfidence,
  messageType,
  children,
}: ChatMessageProps) {
  const isUser = role === "user";
  const isSystem = role === "system";

  // System message styling
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center py-3"
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 text-sm px-5 py-2.5 rounded-full border border-slate-200/50 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          {content}
        </div>
      </motion.div>
    );
  }

  // Get message type icon
  const getMessageIcon = () => {
    switch (messageType) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "searching":
        return <Search className="w-4 h-4 text-sky-500 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
        opacity: { duration: 0.3 }
      }}
      className={cn(
        "flex gap-3 py-4 group w-full min-w-0 max-w-full overflow-hidden box-border",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Avatar className={cn(
          "h-10 w-10 shrink-0 ring-2 ring-offset-2 transition-all duration-300",
          isUser
            ? "ring-slate-200 ring-offset-white"
            : "ring-sky-200 ring-offset-white group-hover:ring-sky-300"
        )}>
          {isUser ? (
            <>
              <AvatarImage src="/avatar-user.png" />
              <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/avatar-assistant.png" />
              <AvatarFallback className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white">
                <Plane className="h-4 w-4" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </motion.div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-2 flex-1 min-w-0 max-w-[calc(100%-52px)] overflow-hidden chat-message-content",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Message Bubble */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05, duration: 0.2 }}
          className={cn(
            "relative rounded-2xl px-4 py-3 transition-all duration-200 max-w-full sm:max-w-[85%] lg:max-w-[75%]",
            isUser
              ? "bg-gradient-to-br from-sky-500 via-sky-500 to-sky-600 text-white rounded-tr-sm shadow-lg shadow-sky-500/25"
              : "bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-800 rounded-tl-sm shadow-md shadow-slate-900/5 hover:shadow-lg hover:shadow-slate-900/10",
            messageType === "success" && !isUser && "border-emerald-200 bg-emerald-50/50",
            messageType === "error" && !isUser && "border-red-200 bg-red-50/50",
            messageType === "searching" && !isUser && "border-sky-200 bg-sky-50/50"
          )}
        >
          {/* Decorative gradient overlay for assistant */}
          {!isUser && !isTyping && (
            <div className="absolute inset-0 rounded-2xl rounded-tl-sm bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
          )}

          {/* Message Type Icon */}
          {messageType && getMessageIcon() && (
            <div className="absolute -top-2 -right-2">
              <div className="p-1 bg-white rounded-full shadow-sm border border-slate-100">
                {getMessageIcon()}
              </div>
            </div>
          )}

          {isTyping ? (
            <div className="flex gap-1.5 py-1 px-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-2 h-2 bg-sky-400 rounded-full"
                />
              ))}
            </div>
          ) : (
            <div className="relative z-10 overflow-hidden max-w-full">
              <p className="text-[15px] leading-relaxed whitespace-pre-line break-words max-w-full">
                {parseMarkdown(content)}
              </p>
            </div>
          )}
        </motion.div>

        {/* Confidence Indicator */}
        {showConfidence && confidence !== undefined && !isUser && !isTyping && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ConfidenceIndicator
              level={getConfidenceLevel(confidence)}
              context="destination"
              showExplanation
            />
          </motion.div>
        )}

        {/* Children (Flight cards, etc.) - Full width, not constrained by message bubble */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-full min-w-0 max-w-[calc(100vw-5rem)] sm:max-w-full overflow-hidden box-border"
          >
            {children}
          </motion.div>
        )}

        {/* Timestamp */}
        {timestamp && !isTyping && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-slate-400 px-1 font-medium"
          >
            {timestamp.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
