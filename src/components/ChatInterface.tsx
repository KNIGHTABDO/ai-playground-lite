import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Sparkles, MoreHorizontal, Share, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  onRegenerateMessage: (messageId: string) => void;
}

export const ChatInterface = ({ 
  chatId, 
  messages, 
  onSendMessage, 
  onRegenerateMessage 
}: ChatInterfaceProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };

    const scrollElement = scrollAreaRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    onSendMessage(message);
    setIsTyping(true);
    
    // Simulate AI response with dynamic delay
    const responseDelay = Math.min(message.length * 50 + 1000, 3000);
    setTimeout(() => {
      const responses = [
        "I understand you're looking for help with that. Let me break this down for you step by step and provide a comprehensive solution.",
        "That's a great question! Here's what I think based on the information you've provided, along with some additional insights that might be helpful.",
        "I'd be happy to help you with that. Let me provide you with a detailed answer that covers all the important aspects you should consider.",
        "Thanks for asking! This is an interesting topic that has several dimensions to explore. Let me walk you through my analysis.",
        "I can definitely assist you with this. Here's my detailed response to your query, including some practical examples and recommendations."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      onSendMessage(randomResponse);
      setIsTyping(false);
    }, responseDelay);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExportChat = () => {
    const chatContent = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${chatId}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col h-full bg-gradient-background relative">
        {/* Enhanced Chat Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm shadow-soft">
          <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">ChatGPT Pro</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  Always ready to help
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportChat}
                    className="h-9 w-9 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export chat</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share chat</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-chat-hover hover:scale-110 transition-all duration-200"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More options</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden relative">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-2xl mx-auto px-4 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-8 shadow-glow animate-float">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-semibold text-foreground mb-3">
                  Ready when you are.
                </h2>
                <p className="text-muted-foreground text-lg">
                  Ask me anything, and I'll do my best to help you out with detailed, thoughtful responses.
                </p>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: "💡", title: "Creative Ideas", desc: "Generate innovative solutions" },
                    { icon: "📚", title: "Deep Knowledge", desc: "Access vast information" },
                    { icon: "🚀", title: "Fast Responses", desc: "Get instant assistance" }
                  ].map((feature, index) => (
                    <div 
                      key={feature.title}
                      className="p-4 rounded-xl bg-card/50 border border-border hover:shadow-soft transition-all duration-200 hover:scale-105 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h3 className="font-medium text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea 
                className="h-full chat-scroll" 
                ref={scrollAreaRef}
              >
                <div className="pb-6">
                  {messages.map((message, index) => (
                    <div 
                      key={message.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ChatMessage 
                        message={message} 
                        onRegenerate={() => onRegenerateMessage(message.id)}
                      />
                    </div>
                  ))}
                  
                  {/* Enhanced Typing Indicator */}
                  {isTyping && (
                    <div className="py-6 px-4 bg-gradient-message/10 animate-fade-in">
                      <div className="max-w-4xl mx-auto flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-message flex items-center justify-center shadow-soft">
                          <span className="text-xs font-medium">AI</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-foreground">ChatGPT</span>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-primary rounded-full animate-typing"></div>
                              <div className="w-1 h-1 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-1 h-1 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-3 h-3 bg-muted-foreground rounded-full animate-typing"></div>
                            <div className="w-3 h-3 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.3s' }}></div>
                            <div className="w-3 h-3 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.6s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Scroll to bottom button */}
              {showScrollButton && (
                <Button
                  onClick={scrollToBottom}
                  className="absolute bottom-20 right-6 rounded-full shadow-strong bg-primary hover:bg-primary/90 text-primary-foreground animate-fade-in z-10"
                  size="sm"
                >
                  ↓ New messages
                </Button>
              )}
            </>
          )}
        </div>

        {/* Enhanced Input Area */}
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          isTyping={isTyping}
          placeholder={messages.length === 0 ? "Ask anything..." : "Type your message..."}
        />
      </div>
    </TooltipProvider>
  );
};