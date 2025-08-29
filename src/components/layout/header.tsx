
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";

export function Header() {
  const router = useRouter();
  const { user, logout } = useSession();

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  if (!user) {
    // Render a simplified header or nothing if user is not logged in
    return (
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <div className="hidden md:block">
            <Logo size="sm" />
        </div>
        <div className="flex w-full items-center justify-end gap-4">
            <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
            <Button asChild><Link href="/enroll/client">Sign Up</Link></Button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <Logo size="sm" />
      </div>
      <div className="flex w-full items-center justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || 'User'} data-ai-hint="user avatar" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account/settings">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  );
}
