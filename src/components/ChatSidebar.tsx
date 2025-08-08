import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Library, 
  Sparkles, 
  Zap, 
  Image,
  MessageSquare,
  Settings,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  chats: Array<{ id: string; title: string; timestamp: string }>;
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

export const ChatSidebar = ({ chats, activeChat, onNewChat, onSelectChat }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { icon: Library, label: "Library", href: "#" },
    { icon: Sparkles, label: "Sora", href: "#" },
    { icon: Zap, label: "GPTs", href: "#" },
    { icon: Image, label: "Image generator", href: "#" },
  ];

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-chat-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-3">
        <Button 
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-start gap-3 bg-transparent border-border hover:bg-chat-hover transition-smooth"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-chat-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground transition-smooth"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-chat-hover transition-smooth"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>

      <Separator className="my-4 bg-border" />

      {/* Chat History */}
      <div className="flex-1 overflow-hidden">
        <div className="px-4 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Chats</h3>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full justify-start px-3 py-2 h-auto text-left transition-smooth",
                  activeChat === chat.id 
                    ? "bg-chat-hover text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-chat-hover"
                )}
              >
                <div className="flex items-start gap-3 w-full">
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 space-y-1 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-chat-hover transition-smooth"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-chat-hover transition-smooth"
        >
          <HelpCircle className="h-4 w-4" />
          Help & FAQ
        </Button>
      </div>
    </div>
  );
};