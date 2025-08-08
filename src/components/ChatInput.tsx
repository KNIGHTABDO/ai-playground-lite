import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Paperclip, Square, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isTyping?: boolean;
}

export const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Ask anything...",
  isTyping = false
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const handleStop = () => {
    // Stop generation logic would go here
    console.log("Stopping generation...");
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const quickPrompts = [
    "Explain quantum computing",
    "Write a poem about nature",
    "Help me plan a project",
    "Create a learning plan"
  ];

  return (
    <TooltipProvider>
      <div className="border-t border-border bg-gradient-background relative">
        {/* Quick Prompts (show when empty) */}
        {!message && !isFocused && (
          <div className="max-w-4xl mx-auto px-4 pt-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage(prompt)}
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 animate-fade-in border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto p-4">
          <div className={cn(
            "relative flex items-end gap-3 transition-all duration-300",
            isFocused && "transform scale-[1.02]"
          )}>
            {/* Attachment Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-12 w-12 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200 flex-shrink-0"
                  disabled={disabled}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach files</p>
              </TooltipContent>
            </Tooltip>

            {/* Input Container */}
            <div className="flex-1 relative">
              <div className={cn(
                "relative rounded-2xl border transition-all duration-200",
                isFocused 
                  ? "border-primary shadow-glow bg-card" 
                  : "border-border bg-chat-input hover:shadow-soft"
              )}>
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={cn(
                    "min-h-[48px] max-h-[120px] resize-none border-0 bg-transparent text-foreground placeholder:text-muted-foreground",
                    "focus:ring-0 focus:outline-none p-4 pr-14 rounded-2xl",
                    "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                  )}
                  rows={1}
                />
                
                {/* Character count */}
                {message.length > 100 && (
                  <div className="absolute bottom-2 left-4 text-xs text-muted-foreground">
                    {message.length}/2000
                  </div>
                )}
                
                {/* Send/Stop Button */}
                {isTyping ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleStop}
                        size="sm"
                        className="absolute right-3 bottom-3 h-8 w-8 p-0 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all duration-200 hover:scale-110"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stop generating</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSend}
                        disabled={!message.trim() || disabled}
                        size="sm"
                        className={cn(
                          "absolute right-3 bottom-3 h-8 w-8 p-0 rounded-lg transition-all duration-200",
                          message.trim() && !disabled
                            ? "bg-gradient-primary hover:shadow-glow text-white hover:scale-110 animate-pulse-glow"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send message (Enter)</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Voice Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleVoiceToggle}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "h-12 w-12 p-0 transition-all duration-200 flex-shrink-0",
                    isRecording 
                      ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse-glow" 
                      : "hover:bg-chat-hover hover:scale-110"
                  )}
                  disabled={disabled}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRecording ? "Stop recording" : "Voice input"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Footer Text */}
          <div className="flex justify-center mt-4">
            <p className="text-xs text-muted-foreground text-center bg-muted/30 px-3 py-1 rounded-full backdrop-blur-sm">
              ChatGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-glow opacity-0 hover:opacity-5 transition-opacity duration-700 pointer-events-none"></div>
      </div>
    </TooltipProvider>
  );
};