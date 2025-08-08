import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Download, Share } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: string;
  };
  onRegenerate?: () => void;
}

export const ChatMessage = ({ message, onRegenerate }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (isPositive: boolean) => {
    setLiked(isPositive);
    // Add analytics or feedback logic here
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "group w-full py-6 px-4 transition-all duration-300 hover:bg-secondary/5 relative",
        !isUser && "bg-gradient-message/20",
        "animate-fade-in-up"
      )}>
        <div className="max-w-4xl mx-auto flex gap-4">
          {/* Enhanced Avatar */}
          <Avatar className={cn(
            "w-8 h-8 flex-shrink-0 transition-all duration-200 group-hover:scale-110",
            isUser && "ring-2 ring-primary/20"
          )}>
            <AvatarFallback className={cn(
              "text-xs font-medium transition-all duration-200",
              isUser 
                ? "bg-gradient-primary text-white shadow-glow" 
                : "bg-gradient-message text-foreground"
            )}>
              {isUser ? "U" : "AI"}
            </AvatarFallback>
          </Avatar>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn(
                "text-sm font-semibold transition-colors duration-200",
                isUser ? "text-primary" : "text-foreground"
              )}>
                {isUser ? "You" : "ChatGPT"}
              </span>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                {message.timestamp}
              </span>
              {!isUser && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
                  <span className="text-xs text-muted-foreground">AI</span>
                </div>
              )}
            </div>
            
            <div className={cn(
              "prose prose-sm max-w-none transition-all duration-200",
              isUser ? "text-foreground" : "text-foreground"
            )}>
              <p className="whitespace-pre-wrap leading-relaxed font-normal tracking-wide">
                {message.content}
              </p>
            </div>

            {/* Enhanced Message Actions */}
            {!isUser && (
              <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className={cn(
                        "h-8 w-8 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200",
                        copied && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied!" : "Copy message"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLike(true)}
                      className={cn(
                        "h-8 w-8 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200",
                        liked === true && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Good response</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLike(false)}
                      className={cn(
                        "h-8 w-8 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200",
                        liked === false && "bg-destructive text-destructive-foreground"
                      )}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Poor response</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onRegenerate}
                      className="h-8 w-8 p-0 hover:bg-chat-hover hover:scale-110 hover:rotate-180 transition-all duration-200"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Regenerate response</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-border mx-1"></div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share message</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export message</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </TooltipProvider>
  );
};