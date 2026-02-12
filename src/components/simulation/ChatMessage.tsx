import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTypewriter } from "@/hooks/useTypewriter";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  /** Show typewriter animation for the content */
  isTyping?: boolean;
  className?: string;
}

/**
 * Chat bubble for user/assistant messages.
 * User messages are right-aligned with a blue background.
 * Assistant messages are left-aligned with a muted background.
 * Supports typewriter animation via the isTyping prop.
 */
export function ChatMessage({
  role,
  content,
  isTyping = false,
  className,
}: ChatMessageProps) {
  const isUser = role === "user";
  const { displayText, isComplete } = useTypewriter(content, {
    enabled: isTyping,
  });

  const text = isTyping ? displayText : content;

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
        className,
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-blue-100 text-blue-600"
            : "bg-muted text-muted-foreground",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-muted text-foreground",
        )}
      >
        {text}
        {isTyping && !isComplete && (
          <span className="ml-0.5 inline-block animate-pulse">|</span>
        )}
      </div>
    </div>
  );
}
