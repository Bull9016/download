
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, MessageSquare, Paperclip, Send, Search, UserPlus, MoreVertical, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import type { IUser } from "@/models/User";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  self: boolean;
}

export default function ChatDetailsPage() {
  const routeParams = useParams<{ id: string }>();
  const chatId = routeParams?.id;

  const [chatPartner, setChatPartner] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); 
  
  useEffect(() => {
    if (!chatId) {
        setIsLoading(false);
        setError("No chat selected.");
        return;
    };
    const fetchChatPartner = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${chatId}`);
        if (!response.ok) throw new Error('Could not load user data for this chat.');
        const data = await response.json();
        setChatPartner(data);
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatPartner();
  }, [chatId, toast]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const newMsg = {
      id: `m${messages.length + 1}`,
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true,
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
    // In a real app, send this to a backend/WebSocket
  };
  
  const initials = chatPartner?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  return (
    <AppLayout>
     <div className="flex h-[calc(100vh-var(--header-height,4rem)-2rem)] md:h-[calc(100vh-var(--header-height,4rem)-3rem)] border rounded-lg shadow-lg overflow-hidden bg-card">
        {/* Main Chat Area */}
        <main className="flex flex-1 flex-col bg-background">
          {/* Chat Header */}
          <header className="flex items-center justify-between p-4 border-b bg-card">
            {isLoading ? (
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            ) : error || !chatPartner ? (
                <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Error loading chat</span>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link href="/chat" className="md:hidden">
                        <Button variant="ghost" size="icon" aria-label="Back to conversations">
                        <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={chatPartner.avatarUrl} alt={chatPartner.name} data-ai-hint="person avatar"/>
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold text-md">{chatPartner.name}</h2>
                        {/* <p className="text-xs text-green-500">Online</p> */}
                    </div>
                </div>
            )}
            <Button variant="ghost" size="icon" aria-label="More options">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </header>

          {/* Message Area */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-4" />
                    <p>No messages yet.</p>
                    <p className="text-sm">Start the conversation below.</p>
                </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg shadow ${msg.self ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {!msg.self && <p className="text-xs font-semibold mb-0.5 text-primary">{chatPartner?.name || 'User'}</p>}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.self ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-right"}`}>{msg.time}</p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>

          {/* Message Input Area */}
          <footer className="p-4 border-t bg-card">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Button variant="ghost" size="icon" type="button" aria-label="Attach file">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                aria-label="Message input"
                disabled={isLoading || !!error}
              />
              <Button type="submit" size="icon" aria-label="Send message" disabled={isLoading || !!error}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </footer>
        </main>
      </div>
    </AppLayout>
  );
}
