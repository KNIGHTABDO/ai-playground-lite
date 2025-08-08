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

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id);
        setMessages(remainingChats[0].messages);
      } else {
        setActiveChat(null);
        setMessages([]);
      }
    }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  const handleRegenerateMessage = (messageId: string) => {
    // Find and regenerate the specific message
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      const responses = [
        "Here's an alternative perspective on your question...",
        "Let me approach this differently and provide another viewpoint...",
        "I can offer a fresh take on this topic...",
        "Allow me to reconsider and give you an updated response..."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const updatedMessage = {
        ...messages[messageIndex],
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const newMessages = [...messages];
      newMessages[messageIndex] = updatedMessage;
      setMessages(newMessages);
      
      // Update chat in chats array
      setChats(prev => prev.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: newMessages }
          : chat
      ));
    }
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
    <div className="h-screen flex bg-gradient-background text-foreground overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <ChatInterface
        chatId={activeChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        onRegenerateMessage={handleRegenerateMessage}
      />
    </div>
  );
};

export default Index;
