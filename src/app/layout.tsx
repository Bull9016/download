
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from '@/components/layout/app-providers';
import { SessionProvider } from '@/hooks/use-session';

export const metadata: Metadata = {
  title: 'Geo 3D Hub: Find Construction Contractors',
  description: 'Connecting clients with skilled construction contractors for any project.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SessionProvider>
            <AppProviders>
            {children}
            <Toaster />
            </AppProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
