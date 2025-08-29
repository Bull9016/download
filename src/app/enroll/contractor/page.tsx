
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const availableSkills = ["General Contracting", "Plumbing", "Electrical", "HVAC", "Framing", "Roofing", "Painting", "Drywall", "Flooring", "Landscaping", "Concrete", "Masonry"];

export default function ContractorEnrollmentPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    professionalTitle: "",
    location: "",
    skills: [] as string[],
    portfolioLink: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData(prev => {
      const newSkills = checked 
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill);
      return { ...prev, skills: newSkills };
    });
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
        role: 'contractor',
        location: formData.location,
        professionalTitle: formData.professionalTitle,
        skills: formData.skills,
        portfolioLink: formData.portfolioLink,
        bio: formData.bio,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({ title: "Enrollment Failed", description: errorData.message || 'Failed to save user profile.', variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ title: "Enrollment Successful", description: "Welcome! Your profile is ready to be completed."});
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
            <UserPlus className="mr-3 h-8 w-8 text-primary" /> Contractor Enrollment
          </CardTitle>
          <CardDescription>Join our network of skilled construction professionals and get matched with exciting projects.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="Your Full Name" required value={formData.fullName} onChange={handleChange} disabled={isLoading}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} disabled={isLoading}/>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="professionalTitle">Professional Title / Trade</Label>
                    <Input id="professionalTitle" name="professionalTitle" placeholder="e.g., General Contractor" required value={formData.professionalTitle} onChange={handleChange} disabled={isLoading}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="e.g., New York, NY" required value={formData.location} onChange={handleChange} disabled={isLoading}/>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Primary Skills (Select up to 5)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-md max-h-48 overflow-y-auto">
                  {availableSkills.map(skill => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`skill-${skill}`} 
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                        disabled={isLoading || (formData.skills.length >= 5 && !formData.skills.includes(skill))}
                      />
                      <Label htmlFor={`skill-${skill}`} className="font-normal text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
                 {formData.skills.length >= 5 && <p className="text-xs text-muted-foreground">Maximum 5 skills can be selected.</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolioLink">Portfolio/Website Link (Optional)</Label>
              <Input id="portfolioLink" name="portfolioLink" type="url" placeholder="https://yourportfolio.com" value={formData.portfolioLink} onChange={handleChange} disabled={isLoading}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio (Optional)</Label>
              <Textarea id="bio" name="bio" placeholder="Briefly describe your experience and expertise (max 200 characters)." rows={3} maxLength={200} value={formData.bio} onChange={handleChange} disabled={isLoading}/>
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} disabled={isLoading}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} disabled={isLoading}/>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-3 pt-6">
            <Button type="submit" className="w-full font-semibold text-base py-3" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Contractor Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Are you a client looking to hire?{" "}
              <Link href="/enroll/client" className="font-medium text-primary hover:underline">
                Enroll as Client
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
