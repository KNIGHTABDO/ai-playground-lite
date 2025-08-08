import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Sparkles } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatInterfaceProps {
  chatId: string | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export const ChatInterface = ({ chatId, messages, onSendMessage }: ChatInterfaceProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    onSendMessage(message);
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand you're looking for help with that. Let me break this down for you step by step.",
        "That's a great question! Here's what I think based on the information you've provided.",
        "I'd be happy to help you with that. Let me provide you with a comprehensive answer.",
        "Thanks for asking! This is an interesting topic that has several aspects to consider.",
        "I can definitely assist you with this. Here's my detailed response to your query."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      onSendMessage(randomResponse);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-chat-background">
      {/* Chat Header */}
      <div className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">ChatGPT</h1>
              <p className="text-xs text-muted-foreground">Always ready to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Ready when you are.
              </h2>
              <p className="text-muted-foreground">
                Ask me anything, and I'll do my best to help you out.
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="pb-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="py-6 px-4 bg-secondary/5">
                  <div className="max-w-4xl mx-auto flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-chat-bot flex items-center justify-center">
                      <span className="text-xs font-medium">AI</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground">ChatGPT</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isTyping}
        placeholder={messages.length === 0 ? "Ask anything..." : "Type your message..."}
      />
    </div>
  );
};