"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  // You can add more providers here as your app grows
  // For example, ThemeProvider, AuthenticationProvider, etc.
  return (
    <SidebarProvider defaultOpen={true}>
      {children}
    </SidebarProvider>
  );
}
