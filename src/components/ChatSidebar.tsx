import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Plus, 
  Search, 
  Library, 
  Sparkles, 
  Zap, 
  Image,
  MessageSquare,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  MoreHorizontal,
  Trash2,
  Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  chats: Array<{ id: string; title: string; timestamp: string }>;
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export const ChatSidebar = ({ 
  chats, 
  activeChat, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  onRenameChat 
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Responsive collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: Library, label: "Library", href: "#", badge: null },
    { icon: Sparkles, label: "Sora", href: "#", badge: "New" },
    { icon: Zap, label: "GPTs", href: "#", badge: "4" },
    { icon: Image, label: "Image generator", href: "#", badge: null },
  ];

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (chatId: string, currentTitle: string) => {
    setEditingChat(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = () => {
    if (editingChat && editTitle.trim()) {
      onRenameChat(editingChat, editTitle.trim());
    }
    setEditingChat(null);
    setEditTitle("");
  };

  const handleCancelEdit = () => {
    setEditingChat(null);
    setEditTitle("");
  };

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "bg-chat-sidebar border-r border-border flex flex-col h-full transition-all duration-300 ease-elastic shadow-medium relative",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Collapse Toggle */}
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="sm"
          className={cn(
            "absolute -right-3 top-4 z-10 h-6 w-6 rounded-full bg-card border border-border shadow-medium hover:shadow-glow transition-all duration-200",
            "hover:scale-110 hover:bg-primary hover:text-primary-foreground"
          )}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-3 w-3" />
          ) : (
            <PanelLeftClose className="h-3 w-3" />
          )}
        </Button>

        {/* Header */}
        <div className={cn("p-4 space-y-3", isCollapsed && "p-2")}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onNewChat}
                  size="sm"
                  className="w-10 h-10 bg-gradient-primary hover:shadow-glow transition-all duration-200 animate-fade-in"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>New chat</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Button 
                onClick={onNewChat}
                variant="outline"
                className="w-full justify-start gap-3 bg-transparent border-border hover:bg-chat-hover hover:shadow-soft transition-all duration-200 group animate-fade-in"
              >
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                New chat
              </Button>
              
              <div className="relative animate-fade-in-up">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search chats"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-chat-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all duration-200 hover:shadow-soft"
                />
              </div>
            </>
          )}
        </div>

        {/* Menu Items */}
        <div className={cn("space-y-1", isCollapsed ? "px-2" : "px-4")}>
          {menuItems.map((item, index) => (
            <div key={item.label} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 relative hover:bg-chat-hover hover:scale-105 transition-all duration-200"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-medium">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-chat-hover hover:scale-[1.02] transition-all duration-200 relative"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto h-5 px-2 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4 bg-border animate-fade-in" />

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          {!isCollapsed && (
            <div className="px-4 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground animate-fade-in">Recent Chats</h3>
            </div>
          )}
          
          <ScrollArea className="flex-1 chat-scroll" style={{ height: isCollapsed ? "auto" : "calc(100vh - 320px)" }}>
            <div className={cn("space-y-1", isCollapsed ? "px-1" : "px-2")}>
              {filteredChats.map((chat, index) => (
                <div 
                  key={chat.id} 
                  className="group animate-fade-in-up relative"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => onSelectChat(chat.id)}
                          size="sm"
                          className={cn(
                            "w-10 h-10 transition-all duration-200",
                            activeChat === chat.id 
                              ? "bg-chat-hover text-foreground shadow-soft" 
                              : "text-muted-foreground hover:text-foreground hover:bg-chat-hover hover:scale-105"
                          )}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="max-w-xs truncate">{chat.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="relative">
                      {editingChat === chat.id ? (
                        <div className="px-3 py-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="w-full px-2 py-1 text-sm bg-chat-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() => onSelectChat(chat.id)}
                          className={cn(
                            "w-full justify-start px-3 py-2 h-auto text-left transition-all duration-200 hover:scale-[1.02]",
                            activeChat === chat.id 
                              ? "bg-chat-hover text-foreground shadow-soft" 
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
                      )}
                      
                      {/* Chat Actions */}
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(chat.id, chat.title);
                          }}
                          className="h-6 w-6 p-0 hover:bg-accent hover:scale-110 transition-all duration-200"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground hover:scale-110 transition-all duration-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className={cn("border-t border-border", isCollapsed ? "p-2 space-y-1" : "p-4 space-y-1")}>
          {isCollapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 hover:bg-chat-hover hover:scale-105 transition-all duration-200"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 hover:bg-chat-hover hover:scale-105 transition-all duration-200"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Help & FAQ</p>
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-chat-hover hover:scale-[1.02] transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-chat-hover hover:scale-[1.02] transition-all duration-200"
              >
                <HelpCircle className="h-4 w-4" />
                Help & FAQ
              </Button>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};