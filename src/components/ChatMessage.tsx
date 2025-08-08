import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: string;
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={cn(
      "group w-full py-6 px-4 transition-colors hover:bg-secondary/5",
      !isUser && "bg-secondary/5"
    )}>
      <div className="max-w-4xl mx-auto flex gap-4">
        {/* Avatar */}
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className={cn(
            "text-xs font-medium",
            isUser 
              ? "bg-chat-user text-white" 
              : "bg-chat-bot text-foreground"
          )}>
            {isUser ? "U" : "AI"}
          </AvatarFallback>
        </Avatar>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-foreground">
              {isUser ? "You" : "ChatGPT"}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp}
            </span>
          </div>
          
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>

          {/* Message Actions */}
          {!isUser && (
            <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-chat-hover"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-chat-hover"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-chat-hover"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-chat-hover"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};