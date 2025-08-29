
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Brain, History, Loader2, Map, Save, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import type { IProject, RoadmapPhase, EditHistory } from "@/models/Project";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { generateProjectRoadmap } from "@/ai/flows/generate-project-roadmap";
import { format } from "date-fns";

export default function ProjectRoadmapPage() {
  const [project, setProject] = useState<IProject | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params?.id;

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error("Project not found");
        const data: IProject = await response.json();
        setProject(data);
        setRoadmap(JSON.parse(JSON.stringify(data.roadmap || []))); // Deep copy
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: "Could not fetch project data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId, toast]);

  const handleGenerateRoadmap = async () => {
    if (!project) return;
    setIsGenerating(true);
    try {
      const result = await generateProjectRoadmap({
        projectDescription: project.description,
        startDate: new Date(project.startDate).toISOString(),
        deadline: new Date(project.deadline).toISOString(),
      });
      setRoadmap(result.roadmap);
      toast({ title: "Roadmap Generated", description: "The initial AI-powered roadmap has been created." });
    } catch (err: any) {
      toast({ title: "Generation Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveRoadmap = async () => {
    if (!project) return;
    setIsSaving(true);
    
    const newHistory: EditHistory = {
        timestamp: new Date(),
        editor: "Demo User", // In real app, get from auth context
        change: "Updated the project roadmap."
    };

    try {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                roadmap: roadmap,
                editHistory: [...project.editHistory, newHistory] 
            }),
        });
        if (!response.ok) throw new Error("Failed to save roadmap.");
        const updatedProject = await response.json();
        setProject(updatedProject);
        setRoadmap(JSON.parse(JSON.stringify(updatedProject.roadmap)));
        toast({ title: "Roadmap Saved", description: "Your changes have been saved successfully." });
    } catch(err: any) {
        toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleRoadmapChange = (phaseIndex: number, milestoneIndex: number, field: string, value: string) => {
    const newRoadmap = [...roadmap];
    (newRoadmap[phaseIndex].milestones[milestoneIndex] as any)[field] = value;
    setRoadmap(newRoadmap);
  };

  if (isLoading) {
    return <AppLayout><RoadmapSkeleton /></AppLayout>;
  }

  if (error) {
    return <AppLayout><div>Error: {error}</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <section>
          <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
            <Map className="mr-3 h-8 w-8 text-primary" /> Project Roadmap
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-generated project plan for "{project?.name}". Edit and track milestones.
          </p>
        </section>

        {roadmap.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">No Roadmap Yet</CardTitle>
              <CardDescription>Generate an initial roadmap using AI to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={handleGenerateRoadmap} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                {isGenerating ? "Generating..." : "Generate AI Roadmap"}
              </Button>
            </CardContent>
          </Card>
        ) : (
            <>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleGenerateRoadmap} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                    Regenerate
                </Button>
                <Button onClick={handleSaveRoadmap} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Roadmap
                </Button>
            </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                {roadmap.map((phase, phaseIndex) => (
                  <AccordionItem key={phase.id} value={`item-${phaseIndex}`}>
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        {phase.name}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">{phase.description}</p>
                      {phase.milestones.map((milestone, milestoneIndex) => (
                        <Card key={milestone.id} className="p-4">
                          <div className="space-y-3">
                            <Label htmlFor={`milestone-name-${milestone.id}`}>Milestone Name</Label>
                            <Input 
                                id={`milestone-name-${milestone.id}`} 
                                value={milestone.name}
                                onChange={(e) => handleRoadmapChange(phaseIndex, milestoneIndex, 'name', e.target.value)}
                                className="font-semibold"
                            />
                             <Label htmlFor={`milestone-desc-${milestone.id}`}>Description</Label>
                            <Textarea 
                                id={`milestone-desc-${milestone.id}`} 
                                value={milestone.description} 
                                onChange={(e) => handleRoadmapChange(phaseIndex, milestoneIndex, 'description', e.target.value)}
                                rows={2}
                            />
                            <Label htmlFor={`milestone-status-${milestone.id}`}>Status</Label>
                            <Select
                                value={milestone.status}
                                onValueChange={(value) => handleRoadmapChange(phaseIndex, milestoneIndex, 'status', value)}
                            >
                                <SelectTrigger id={`milestone-status-${milestone.id}`}>
                                    <SelectValue placeholder="Set status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                          </div>
                        </Card>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center">
                    <History className="mr-2 h-5 w-5" /> Edit History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project?.editHistory && project.editHistory.length > 0 ? (
                    <ul className="space-y-4">
                      {[...project.editHistory].reverse().map((entry, index) => (
                        <li key={index} className="text-sm">
                          <p className="font-semibold">{entry.editor}</p>
                          <p className="text-muted-foreground">{entry.change}</p>
                           <p className="text-xs text-muted-foreground/80 mt-0.5">{format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No edits have been made yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

function RoadmapSkeleton() {
    return (
        <div className="space-y-8">
            <section>
                <Skeleton className="h-10 w-1/2 mb-2" />
                <Skeleton className="h-6 w-3/4" />
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
}
