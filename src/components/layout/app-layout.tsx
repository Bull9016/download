
"use client";

import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMenu } from "./nav-menu";
import { Header } from "./header";
import { Logo } from "@/components/logo";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="group-data-[collapsible=icon]:hidden">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent className="flex-grow p-0">
          <ScrollArea className="h-full">
             <NavMenu />
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4">
          {/* Sidebar footer content if any */}
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
