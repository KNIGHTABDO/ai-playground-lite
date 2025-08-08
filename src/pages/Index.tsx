import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInterface } from "@/components/ChatInterface";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Getting started with AI",
      timestamp: "2 hours ago",
      messages: [
        {
          id: "1",
          content: "Hello! How can I help you today?",
          role: "assistant",
          timestamp: "2 hours ago"
        }
      ]
    },
    {
      id: "2", 
      title: "JavaScript concepts explained",
      timestamp: "Yesterday",
      messages: []
    },
    {
      id: "3",
      title: "Creative writing tips",
      timestamp: "3 days ago", 
      messages: []
    }
  ]);
  
  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [messages, setMessages] = useState<Message[]>(
    chats.find(chat => chat.id === activeChat)?.messages || []
  );

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New conversation",
      timestamp: "Just now",
      messages: []
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    const selectedChat = chats.find(chat => chat.id === chatId);
    setMessages(selectedChat?.messages || []);
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: Math.random() > 0.5 ? "user" : "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update the chat in the chats array
    setChats(prev => prev.map(chat => 
      chat.id === activeChat 
        ? { 
            ...chat, 
            messages: [...chat.messages, newMessage],
            title: chat.messages.length === 0 ? content.slice(0, 30) + "..." : chat.title,
            timestamp: "Just now"
          }
        : chat
    ));
  };

  return (
    <div className="h-screen flex bg-chat-background text-foreground">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <ChatInterface
        chatId={activeChat}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Index;
