
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, Map } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { useEffect, useState } from "react";
import type { IProject } from "@/models/Project";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusBadgeVariant = (status: 'In Progress' | 'Completed' | 'Planning' | 'On Hold') => {
  switch (status) {
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    case 'Completed':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    case 'Planning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
    case 'On Hold':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    default:
      return 'secondary';
  }
};


export default function DashboardPage() {
  const { user } = useSession();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        } finally {
            setIsLoading(false);
        }
    };
    fetchProjects();
  }, []);


  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <section>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-1">
            Welcome back, {user?.name || 'User'}! Here&apos;s an overview of your projects and contractors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          <Card className="shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Roadmap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                   <TableRow>
                    <TableCell colSpan={5} className="text-center text-destructive h-24">
                        <AlertTriangle className="inline-block mr-2" /> {error}
                    </TableCell>
                   </TableRow>
                ) : projects.length > 0 ? (
                    projects.slice(0, 5).map((project) => ( // Show latest 5 projects
                    <TableRow key={project._id}>
                        <TableCell className="font-medium">
                        <Link href={`/projects/${project._id}`} className="text-primary hover:underline">
                            {project.name}
                        </Link>
                        </TableCell>
                        <TableCell>
                        <Badge variant="outline" className={getStatusBadgeVariant(project.status)}>
                            {project.status}
                        </Badge>
                        </TableCell>
                        <TableCell>{project.clientName}</TableCell>
                        <TableCell>{project.progress}%</TableCell>
                        <TableCell>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/projects/${project._id}/roadmap`}>
                            <Map className="mr-2 h-4 w-4" /> View
                            </Link>
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                            No projects found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
           <div className="flex justify-end mt-2">
            <Button asChild variant="link">
              <Link href="/projects">View All Projects</Link>
            </Button>
           </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Communication</h2>
           <Card>
            <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>This section will show recent messages soon.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-8">
                    <p>Message previews will be displayed here.</p>
                     <Button asChild variant="default" className="mt-4">
                        <Link href="/chat">Go to Messages</Link>
                    </Button>
                </div>
            </CardContent>
           </Card>
        </section>
      </div>
    </AppLayout>
  );
}
