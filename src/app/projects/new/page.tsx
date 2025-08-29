
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, PlusCircle, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSession } from "@/hooks/use-session";

export default function CreateProjectPage() {
  const { user } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    tags: "",
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!startDate || !deadline) {
        toast({ title: "Dates Required", description: "Please select both a start and end date.", variant: "destructive" });
        return;
    }
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to create a project.", variant: "destructive" });
        return;
    }
    setIsLoading(true);

    const projectData = {
        ...formData,
        clientName: user.name, // Set client name from session
        createdBy: user._id, // Set creator ID from session
        budget: Number(formData.budget),
        startDate: startDate.toISOString(),
        deadline: deadline.toISOString(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project.');
      }

      toast({
        title: "Project Created Successfully",
        description: `The project "${formData.name}" has been posted.`,
      });
      router.push("/projects");

    } catch (error: any) {
      console.error("Failed to create project:", error);
      toast({
        title: "Error Creating Project",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <section>
          <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
            <PlusCircle className="mr-3 h-8 w-8 text-primary" /> Create a New Project
          </h1>
          <p className="text-lg text-muted-foreground">
            Post a job to find the best contractors on Geo 3D Hub.
          </p>
        </section>

        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Project Details</CardTitle>
            <CardDescription>Provide as much detail as possible for the best contractor matches.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" name="name" placeholder="e.g., Downtown Office Renovation" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea id="description" name="description" placeholder="Describe the project scope, key deliverables, and any special requirements." rows={6} required value={formData.description} onChange={handleChange} />
              </div>
               <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deadline">Project Deadline</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deadline ? format(deadline, "PPP") : <span>Pick a deadline</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (INR)</Label>
                    <Input id="budget" name="budget" type="number" placeholder="e.g., 500000" required value={formData.budget} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags / Keywords</Label>
                    <Input id="tags" name="tags" placeholder="e.g., Renovation, Commercial, HVAC" value={formData.tags} onChange={handleChange} />
                    <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
                  </div>
              </div>
            </CardContent>
            <CardContent className="border-t pt-6 flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Posting Project..." : "Post Project"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
