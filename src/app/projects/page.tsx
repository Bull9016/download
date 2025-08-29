
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ProjectCard } from "@/components/project-card";
import type { IProject } from "@/models/Project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Filter, PlusCircle, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        toast({ title: "Error", description: "Could not fetch project data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [toast]);

  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <div key={`skeleton-${i}`} className="flex flex-col h-full shadow-lg border rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    ))
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2">Projects Overview</h1>
            <p className="text-lg text-muted-foreground">
              Manage and track all your ongoing and completed projects from the database.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/projects/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Project
            </Link>
          </Button>
        </section>

        <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card shadow">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search by project name or client..." className="pl-10 w-full" aria-label="Search projects" />
          </div>
          <div className="flex gap-2 items-center">
            <Select defaultValue="all-status">
              <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by status">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Statuses</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="hidden md:inline-flex">Apply Filters</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeleton()}
          </div>
        ) : error ? (
           <div className="text-center py-10 text-destructive">
            <AlertTriangle className="mx-auto h-12 w-12 mb-3" />
            <h3 className="font-semibold">Failed to load data</h3>
            <p>{error}</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-headline text-xl font-semibold">No Projects Found</h3>
            <p className="text-muted-foreground">Create a new project to get started.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
