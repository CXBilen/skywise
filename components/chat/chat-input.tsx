"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Sparkles, ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLACEHOLDER_SUGGESTIONS = [
  "I need a flight to San Francisco next Tuesday",
  "Import flights from my email",
  "Show my upcoming trips",
  "Book a flight to New York tomorrow",
  "Find flights to Miami this weekend",
];

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function ChatInput({
  onSend,
  disabled,
  isLoading,
  placeholder,
  suggestions,
  onSuggestionClick,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (value.length > 0 || isFocused) return;

    const targetText = PLACEHOLDER_SUGGESTIONS[currentPlaceholderIndex];
    let charIndex = 0;
    setDisplayedPlaceholder("");
    setIsTyping(true);

    // Type characters one by one
    const typingInterval = setInterval(() => {
      if (charIndex < targetText.length) {
        setDisplayedPlaceholder(targetText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 50); // 50ms per character

    return () => clearInterval(typingInterval);
  }, [currentPlaceholderIndex, value.length, isFocused]);

  // Move to next placeholder after typing completes and waiting
  useEffect(() => {
    if (value.length > 0 || isFocused || isTyping) return;

    const waitTimeout = setTimeout(() => {
      setCurrentPlaceholderIndex((prev) =>
        (prev + 1) % PLACEHOLDER_SUGGESTIONS.length
      );
    }, 4000); // Wait 4 seconds after typing completes for user to read

    return () => clearTimeout(waitTimeout);
  }, [isTyping, value.length, isFocused]);

  useEffect(() => {
    if (textareaRef.current) {
      if (value) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          150
        )}px`;
      } else {
        textareaRef.current.style.height = "38px";
      }
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim() && !disabled && !isLoading) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim() && !disabled && !isLoading;

  return (
    <div className="w-full space-y-3">
      {/* Suggestions - Always visible */}
      {!disabled && (
        <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide pb-1">
          {(suggestions && suggestions.length > 0 ? suggestions : ["Book a Flight to New York", "Import from my mail", "Show my trips"]).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick?.(suggestion)}
              className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition-colors shadow-sm"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Input Container */}
      <motion.div
        data-tour-id="chat-input"
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(14, 165, 233, 0.15), 0 10px 40px -10px rgba(0, 0, 0, 0.1)"
            : "0 4px 20px -5px rgba(0, 0, 0, 0.08)",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative rounded-2xl overflow-hidden",
          "bg-white/95 backdrop-blur-xl",
          "border transition-colors duration-200",
          isFocused ? "border-sky-300" : "border-slate-200/80"
        )}
      >
        {/* Gradient Border Effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none",
            isFocused && "opacity-100"
          )}
          style={{
            background: "linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(59, 130, 246, 0.05))",
          }}
        />

        <div className="relative flex items-center gap-2 py-2 pl-2 pr-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={displayedPlaceholder}
              disabled={disabled || isLoading}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent overflow-hidden",
                "text-slate-800 placeholder:text-slate-400",
                "focus:outline-none",
                "text-[15px] leading-[38px]",
                "px-3 pr-3 sm:pr-24",
                "h-[38px] max-h-[150px]",
                "transition-opacity duration-200",
                (disabled || isLoading) && "opacity-50 cursor-not-allowed"
              )}
            />

            {/* Press Enter hint - inside input, right aligned (hidden on mobile) */}
            {!value && !isFocused && (
              <div className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-xs text-slate-400">
                  Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-[10px]">Enter</kbd>
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Voice Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 shrink-0 rounded-xl",
                  "text-slate-400 hover:text-slate-600",
                  "hover:bg-slate-100/80",
                  "transition-all duration-200"
                )}
                disabled={disabled || isLoading}
              >
                <Mic className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Send Button */}
            <motion.div
              data-tour-id="send-button"
              whileHover={canSend ? { scale: 1.05 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
            >
              <Button
                onClick={handleSubmit}
                disabled={!canSend}
                size="icon"
                className={cn(
                  "h-10 w-10 shrink-0 rounded-xl",
                  "transition-all duration-300",
                  canSend
                    ? "bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
