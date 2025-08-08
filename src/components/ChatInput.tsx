import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Ask anything..." 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="relative flex items-end gap-3">
          {/* Attachment Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-chat-hover transition-smooth"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Input Container */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "min-h-[44px] max-h-32 resize-none rounded-xl border-border bg-chat-input text-foreground placeholder:text-muted-foreground",
                "focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth",
                "pr-12" // Space for send button
              )}
              rows={1}
            />
            
            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              size="sm"
              className={cn(
                "absolute right-2 bottom-2 h-8 w-8 p-0 rounded-lg transition-smooth",
                message.trim() && !disabled
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Voice Button */}
          <Button
            onClick={handleVoiceToggle}
            size="sm"
            variant="ghost"
            className={cn(
              "h-10 w-10 p-0 transition-smooth",
              isRecording 
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
                : "hover:bg-chat-hover"
            )}
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          ChatGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};