
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Logo size="md" />
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/enroll/client">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/40 bg-muted/50 py-8 text-muted-foreground">
        <div className="container text-center">
          <div className="mb-4 flex justify-center">
            <Logo size="sm" />
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Geo 3D Hub. All rights reserved.
          </p>
          <nav className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link> {/* Assuming a contact page might exist or be added */}
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
