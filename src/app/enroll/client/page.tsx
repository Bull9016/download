
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientEnrollmentPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    location: "",
    projectInterest: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'client',
        location: formData.location,
        companyName: formData.companyName,
        projectInterest: formData.projectInterest,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({ title: "Enrollment Failed", description: errorData.message || 'Failed to save user profile.', variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ title: "Enrollment Successful", description: "Welcome! You can now log in." });
    router.push("/login");
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl flex items-center justify-center">
            <Briefcase className="mr-3 h-8 w-8 text-primary" /> Client Enrollment
          </CardTitle>
          <CardDescription>Join Geo 3D Hub to find and manage expert contractors for your projects.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="Your Full Name" required value={formData.fullName} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="you@company.com" required value={formData.email} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input id="companyName" name="companyName" placeholder="Your Company LLC" value={formData.companyName} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="e.g., New York, NY" required value={formData.location} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectInterest">Tell us about your project needs (Optional)</Label>
              <Textarea id="projectInterest" name="projectInterest" placeholder="Briefly describe the type of projects or skills you're looking for." rows={3} value={formData.projectInterest} onChange={handleChange} disabled={isLoading} />
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-3 pt-6">
            <Button type="submit" className="w-full font-semibold text-base py-3" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Client Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
             <p className="text-sm text-muted-foreground">
              Are you a contractor?{" "}
              <Link href="/enroll/contractor" className="font-medium text-primary hover:underline">
                Enroll as Contractor
              </Link>
            </p>
            <Link href="/about-us" className="text-sm text-muted-foreground hover:text-primary hover:underline pt-2">
                Learn more about Geo 3D Hub
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
