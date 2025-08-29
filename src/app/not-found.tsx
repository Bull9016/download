
"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <PublicLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertTriangle className="h-24 w-24 text-destructive mb-6" />
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground mb-4">
                404 - Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
                Oops! The page you&apos;re looking for doesn&apos;t seem to exist. It might have been moved or deleted.
            </p>
            <div className="flex gap-4">
                <Button asChild size="lg">
                <Link href="/">Go to Homepage</Link>
                </Button>
            </div>
        </div>
    </PublicLayout>
  );
}
