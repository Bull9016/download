
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { MessageSquare, Search, UserPlus, AlertTriangle, Users2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { IUser } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: IUser[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: "Could not fetch user list.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))
  );

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)] md:h-[calc(100vh-var(--header-height,4rem)-3rem)]">
        <header className="mb-6">
          <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight flex items-center">
            <MessageSquare className="mr-3 h-8 w-8 text-primary" /> Messages
          </h1>
        </header>

        <div className="flex flex-1 border rounded-lg shadow-lg overflow-hidden bg-card">
          <aside className="w-full md:w-1/3 lg:w-1/4 border-r h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9" aria-label="Search conversations" />
              </div>
              <Button variant="outline" className="w-full mt-3">
                <UserPlus className="mr-2 h-4 w-4" /> New Message
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <nav className="p-2 space-y-1">
                {isLoading ? renderSkeleton() :
                 error ? (
                  <div className="text-center p-4 text-destructive text-sm">
                    <AlertTriangle className="mx-auto h-6 w-6 mb-2" />
                    <p>{error}</p>
                  </div>
                 ) :
                 users.map(user => (
                  <Link 
                    key={user._id} 
                    href={`/chat/${user._id}`} 
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar"/>
                        <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium truncate group-hover:text-primary">{user.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                      </div>
                  </Link>
                ))}
                {!isLoading && users.length === 0 && !error && (
                    <div className="text-center p-4 text-muted-foreground text-sm">
                        <Users2 className="mx-auto h-6 w-6 mb-2" />
                        <p>No other users found.</p>
                    </div>
                )}
              </nav>
            </ScrollArea>
          </aside>

          <main className="hidden md:flex flex-1 flex-col items-center justify-center p-6 bg-background">
            <MessageSquare className="h-24 w-24 text-muted-foreground/50 mb-4" />
            <h2 className="font-headline text-2xl font-semibold text-muted-foreground">Select a conversation</h2>
            <p className="text-muted-foreground">Choose a user from the list to start chatting.</p>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
