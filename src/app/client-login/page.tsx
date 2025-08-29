
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/components/icons/google-icon"; 
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/use-session";

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useSession();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const user = await login(email, password);
        toast({
            title: "Sign In Successful",
            description: "Welcome!",
        });
        router.push('/');
    } catch (error: any) {
        toast({
            title: "Sign In Failed",
            description: error.message || "An unknown error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast({ title: "Coming Soon", description: "Google Sign-In will be enabled in a future update." });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Client Login</CardTitle>
          <CardDescription>Sign in to your Geo 3D Hub client account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@company.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full font-semibold text-base py-3" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In as Client
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full font-medium text-base py-3" onClick={handleGoogleSignIn} disabled={true}>
            <GoogleIcon />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex-col items-center justify-center space-y-3 pt-6">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have a client account?{" "}
            <Link href="/enroll/client" className="font-medium text-primary hover:underline">
              Enroll as Client
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Not a client?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login for other roles
            </Link>
          </p>
           <Link href="/about-us" className="text-sm text-muted-foreground hover:text-primary hover:underline pt-2">
            Learn more about Geo 3D Hub
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
