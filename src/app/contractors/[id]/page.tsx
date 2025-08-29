
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Briefcase, CheckCircle, MapPin, MessageSquare, CalendarDays, ExternalLink, Loader2, AlertTriangle, User, FileText, Check } from "lucide-react";
import Link from "next/link";
import { ContractorAnalytics } from "@/components/ai/contractor-analytics";
import { useState, useEffect } from "react";
import type { IUser } from "@/models/User";
import type { IProject } from "@/models/Project";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useParams } from "next/navigation";

export default function ContractorProfilePage() {
  const params = useParams<{ id: string }>();
  const contractorId = params?.id;

  const [contractor, setContractor] = useState<IUser | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!contractorId) {
        setIsLoading(false);
        setError("No contractor ID provided.");
        return;
    };

    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [userRes, projectsRes] = await Promise.all([
          fetch(`/api/users/${contractorId}`),
          fetch('/api/projects')
        ]);
        
        if (!userRes.ok) throw new Error('Failed to fetch contractor data.');
        const userData: IUser = await userRes.json();
        setContractor(userData);

        if(!projectsRes.ok) throw new Error('Failed to fetch project data.');
        const allProjects: IProject[] = await projectsRes.json();

        // Filter projects where this contractor is assigned
        const contractorProjects = allProjects.filter(p => 
          p.assignedContractors.some(id => id.toString() === contractorId)
        );
        setProjects(contractorProjects);

      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [contractorId, toast]);


  if (isLoading) {
    return <AppLayout><ProfileSkeleton /></AppLayout>;
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-destructive p-4">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold">Error loading profile</h2>
          <p className="text-center">{error}</p>
        </div>
      </AppLayout>
    );
  }

  if (!contractor) {
    return <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
          <User className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold">Contractor Not Found</h2>
          <p>The requested contractor profile does not exist.</p>
        </div>
    </AppLayout>;
  }

  const initials = contractor.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "NA";
  
  // Mock data for things not in the models yet
  const mockData = {
      rating: 4.8,
      reviewsCount: 125,
      ratingsDistribution: [
        { stars: 5, percentage: 70 },
        { stars: 4, percentage: 20 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 3 },
        { stars: 1, percentage: 2 },
      ],
      testimonials: [
        { id: "t1", author: "Ethan Carter", time: "3 months ago", text: "Exceptional engineer with a keen eye for detail and a strong work ethic. Consistently delivered high-quality work ahead of schedule.", rating: 5, avatarUrl: "https://placehold.co/100x100.png?text=EC" },
        { id: "t2", author: "Olivia Harper", time: "6 months ago", text: "Talented developer and a pleasure to work with. Communication skills are excellent, and always goes the extra mile.", rating: 4, avatarUrl: "https://placehold.co/100x100.png?text=OH" },
      ]
  };

  const projectHistoryForAI = projects.map(p => ({
    name: p.name,
    role: contractor.professionalTitle || 'Contractor', // We don't store role per project yet
    duration: `${new Date(p.startDate).toLocaleDateString()} - ${new Date(p.deadline).toLocaleDateString()}`
  }));

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
              <AvatarImage src={contractor.avatarUrl} alt={contractor.name} data-ai-hint="person avatar" />
              <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-headline text-3xl font-bold">{contractor.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{contractor.professionalTitle}</p>
              <p className="text-green-600 font-medium mt-1">Available now</p>
            </div>
             <Button size="lg" asChild className="shadow-lg hover:shadow-primary/30 transition-shadow mt-4 sm:mt-0">
              <Link href={`/chat/${contractor._id}`}>
                <MessageSquare className="mr-2 h-4 w-4" /> Contact
              </Link>
            </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger value="overview" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Overview</TabsTrigger>
                <TabsTrigger value="portfolio" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Reviews</TabsTrigger>
                <TabsTrigger value="availability" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Availability</TabsTrigger>
            </TabsList>
            <Card className="mt-4 shadow-none border-0">
            <CardContent className="pt-6 space-y-10">
                <TabsContent value="overview">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-3">
                            {contractor.skills?.map(skill => (
                                <Badge key={skill} variant="outline" className="text-base px-4 py-2 rounded-lg bg-muted hover:bg-muted/80">{skill}</Badge>
                            ))}
                        </div>
                    </section>
                    <Separator className="my-8" />
                     <section>
                        <h2 className="text-2xl font-semibold mb-4">AI Performance Forecast</h2>
                         <ContractorAnalytics contractorData={{
                            id: contractor._id,
                            skills: contractor.skills || [],
                            projectHistory: projectHistoryForAI,
                            rating: mockData.rating,
                        }} />
                    </section>
                    <Separator className="my-8" />
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Project History</h2>
                        <div className="space-y-6">
                            {projects.length > 0 ? projects.map(project => (
                                <div key={project._id} className="flex gap-4">
                                    <div className="flex items-center justify-center h-12 w-12 bg-muted rounded-lg">
                                        <Briefcase className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <Link href={`/projects/${project._id}`} className="font-semibold hover:underline text-primary">{project.name}</Link>
                                        <p className="text-muted-foreground text-sm">{project.description}</p>
                                        <p className="text-muted-foreground text-xs mt-0.5">{new Date(project.startDate).getFullYear()} - {new Date(project.deadline).getFullYear()}</p>
                                    </div>
                                </div>
                            )) : <p className="text-muted-foreground text-sm">No projects to display.</p>}
                        </div>
                    </section>
                </TabsContent>
                <TabsContent value="reviews">
                     <section>
                        <h2 className="text-2xl font-semibold mb-4">Client Feedback (Demo Data)</h2>
                        <div className="space-y-8">
                           {mockData.testimonials.map(review => (
                             <div key={review.id} className="flex gap-4">
                               <Avatar className="h-12 w-12">
                                 <AvatarImage src={review.avatarUrl} alt={review.author} data-ai-hint="person avatar"/>
                                 <AvatarFallback>{review.author.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
                               </Avatar>
                               <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{review.author}</h3>
                                    <span className="text-xs text-muted-foreground">{review.time}</span>
                                 </div>
                                 <div className="flex items-center gap-0.5 mb-2">
                                     {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30 fill-muted-foreground/30'}`} />
                                    ))}
                                 </div>
                                 <p className="text-muted-foreground">{review.text}</p>
                               </div>
                             </div>
                           ))}
                        </div>
                     </section>
                </TabsContent>
                <TabsContent value="portfolio">
                  <div className="text-center py-10 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-3" />
                    <p>Portfolio feature coming soon.</p>
                  </div>
                </TabsContent>
                 <TabsContent value="availability">
                  <div className="text-center py-10 text-muted-foreground">
                    <CheckCircle className="mx-auto h-12 w-12 mb-3 text-green-500" />
                    <p className="font-semibold text-lg">This contractor is currently available for new projects.</p>
                  </div>
                </TabsContent>
            </CardContent>
            </Card>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header Skeleton */}
      <div className="flex items-start gap-6 mb-8">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="flex-1 space-y-2 mt-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-1/4" />
        </div>
        <Skeleton className="h-12 w-28 rounded-lg" />
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="h-10 w-full mb-4" />

      <Card className="shadow-none border-0">
        <CardContent className="pt-6 space-y-10">
           {/* Skills Skeleton */}
          <section>
              <Skeleton className="h-8 w-1/4 mb-4" />
              <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-10 w-24 rounded-lg" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                  <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
          </section>
          <Separator className="my-8" />
          {/* AI Forecast Skeleton */}
           <section>
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-48 w-full" />
           </section>
        </CardContent>
      </Card>
    </div>
  )
}
