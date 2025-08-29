
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisualTimeline, type Milestone } from "@/components/visual-timeline";
import { DailyUpdateForm } from "@/components/daily-update-form";
import { AiProjectTracker } from "@/components/ai/project-tracker"; 
import { Briefcase, CalendarDays, Users, MessageSquare, Edit, Trash2, AlertTriangle, Edit2, ClipboardEdit, FolderArchive, MessageCircle, Loader2, Map } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { IProject, RoadmapPhase } from "@/models/Project";
import type { IUser } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

// The timeline component expects a slightly different shape
// We'll map our RoadmapPhase[] to Milestone[]
const mapRoadmapToMilestones = (roadmap: RoadmapPhase[]): Milestone[] => {
  if (!roadmap) return [];
  return roadmap.flatMap(phase => 
    phase.milestones.map(m => ({
      id: m.id,
      name: m.name,
      // The timeline component needs a due date, but our model doesn't have it per milestone
      // We will use the project deadline as a placeholder for all.
      // A more complex implementation might calculate this.
      dueDate: new Date(), // Placeholder due date
      status: m.status,
      description: m.description,
    }))
  );
};


type ProjectDetailsPageProps = {
  params: { id: string };
};

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const [project, setProject] = useState<IProject | null>(null);
  const [team, setTeam] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const routerParams = useParams<{ id: string }>();
  const projectId = routerParams?.id;

  useEffect(() => {
    if (!projectId) return;
    const fetchProjectAndTeam = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const projectRes = await fetch(`/api/projects/${projectId}`);
        if (!projectRes.ok) {
          throw new Error('Project not found');
        }
        const projectData: IProject = await projectRes.json();
        setProject(projectData);

        // Fetch all users and then filter for the team
        const usersRes = await fetch('/api/users');
        if (!usersRes.ok) throw new Error('Could not fetch user data');
        const allUsers: IUser[] = await usersRes.json();
        
        const projectTeam: IUser[] = [];
        if (projectData.manager) {
            const manager = allUsers.find(u => u._id.toString() === projectData.manager?.toString());
            if (manager) projectTeam.push(manager);
        }
        projectData.assignedContractors.forEach(contractorId => {
            const contractor = allUsers.find(u => u._id.toString() === contractorId.toString());
            if(contractor) projectTeam.push(contractor);
        });
        setTeam(projectTeam);

      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: "Could not fetch project data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectAndTeam();
  }, [projectId, toast]);
  

  const getStatusBadgeVariant = (status?: IProject['status']) => {
    if (!status) return 'bg-gray-500';
    switch (status) {
      case 'In Progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'Completed': return 'bg-green-500 hover:bg-green-600';
      case 'On Hold': return 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600';
      case 'Planning': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (isLoading) {
    return <AppLayout><ProjectSkeleton /></AppLayout>;
  }

  if (error || !project) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-destructive">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold">Error loading project</h2>
          <p>{error || "The project could not be found."}</p>
        </div>
      </AppLayout>
    );
  }

  const timelineMilestones = mapRoadmapToMilestones(project.roadmap);

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-0">
        {/* Header Section */}
        <Card className="mb-8 shadow-xl overflow-hidden">
          <div className="relative h-48 md:h-64 w-full">
            <Image 
              src="https://placehold.co/1200x400.png" 
              alt={`${project.name} banner image`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="construction site"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 md:p-8">
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-white">{project.name}</h1>
              <p className="text-lg text-gray-200 mt-1">Client: {project.clientName}</p>
            </div>
          </div>
           <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Badge className={`text-xs text-white border-none px-3 py-1 ${getStatusBadgeVariant(project.status)}`}>
                        {project.status}
                    </Badge>
                    <div className="mt-2">
                        <Progress value={project.progress} aria-label={`Project progress: ${project.progress}%`} className="w-full md:w-72 h-2.5" />
                        <p className="text-sm text-muted-foreground mt-1">{project.progress}% complete</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Project</Button>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700"><Trash2 className="mr-2 h-4 w-4" /> Delete Project</Button>
                </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="font-headline text-xl">Project Description</CardTitle></CardHeader>
              <CardContent><p className="text-foreground leading-relaxed">{project.description}</p></CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-xl">Key Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary" /> Start Date: {new Date(project.startDate).toLocaleDateString()}</div>
                        <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary" /> Deadline: {new Date(project.deadline).toLocaleDateString()}</div>
                        <div className="flex items-center"><span className="font-semibold mr-2">₹</span> Budget: {project.budget.toLocaleString()} INR</div>
                        <div className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-primary" /> Tags: {project.tags.map(tag => <Badge key={tag} variant="secondary" className="mr-1 bg-accent/20 text-accent-foreground">{tag}</Badge>)}</div>
                    </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="font-headline text-xl">AI Progress Analysis</CardTitle></CardHeader>
                  <CardContent>
                    <AiProjectTracker 
                      projectDescription={project.description} 
                      contractorUpdates={"No updates submitted yet."} 
                      currentTimeline={`Starts ${new Date(project.startDate).toLocaleDateString()}, Ends ${new Date(project.deadline).toLocaleDateString()}`}
                    />
                  </CardContent>
                </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap">
             <Link href={`/projects/${project._id}/roadmap`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center">
                          <Map className="mr-2 h-6 w-6 text-primary" /> Project Roadmap
                        </CardTitle>
                        <CardDescription>View and edit the AI-generated project roadmap.</CardDescription>
                    </CardHeader>
                     <CardContent className="text-center">
                        <Button>Go to Roadmap</Button>
                    </CardContent>
                </Card>
             </Link>
          </TabsContent>

          <TabsContent value="timeline">
            <VisualTimeline milestones={timelineMilestones} projectStartDate={project.startDate} projectEndDate={project.deadline} />
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <DailyUpdateForm projectId={project._id} />
            <Card>
              <CardHeader><CardTitle className="font-headline text-xl">Recent Updates</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No updates submitted yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <FolderArchive className="mr-2 h-6 w-6 text-primary" /> Project Documents
                </CardTitle>
                <CardDescription>Manage and share project-related files.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  <FolderArchive className="mx-auto h-12 w-12 mb-3" />
                  <p>Document management feature coming soon.</p>
                  <Button variant="outline" className="mt-4" disabled>Upload Document</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <MessageCircle className="mr-2 h-6 w-6 text-primary" /> Project Comments & Discussion
                </CardTitle>
                <CardDescription>Collaborate and discuss project details with the team.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  <MessageCircle className="mx-auto h-12 w-12 mb-3" />
                  <p>Project discussion and commenting feature coming soon.</p>
                  <Button variant="outline" className="mt-4" disabled>Add Comment</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="font-headline text-xl">Project Team</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {team.length > 0 ? team.map(member => (
                  <div key={member._id} className="flex items-center justify-between gap-4 p-3 rounded-md border bg-background hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/contractors/${member._id}`} className="font-semibold text-primary hover:underline">{member.name}</Link>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm">No team members assigned yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}


function ProjectSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="mb-8 shadow-xl overflow-hidden">
        <Skeleton className="h-48 md:h-64 w-full" />
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
       <Skeleton className="h-10 w-full mb-6" />
       <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
       </Card>
    </div>
  )
}
