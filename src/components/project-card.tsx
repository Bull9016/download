
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, CalendarDays } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { IProject } from '@/models/Project';

// Re-using the IProject interface for props
export type Project = IProject;

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'On Hold': return 'bg-yellow-500';
      case 'Planning': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const deadlineStr = typeof project.deadline === 'string' ? project.deadline : project.deadline.toISOString();
  const timeToDeadline = formatDistanceToNow(new Date(deadlineStr), { addSuffix: true });

  const teamSize = project.assignedContractors?.length || 0;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-1">{project.name}</CardTitle>
          <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)} text-white border-none`}>
            {project.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">Client: {project.clientName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-sm text-foreground mb-3 line-clamp-2">{project.description}</p>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>{teamSize} contractor(s) assigned</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-primary" />
            <span>Deadline: {new Date(deadlineStr).toLocaleDateString()} ({timeToDeadline})</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} aria-label={`Project progress: ${project.progress}%`} className="h-2" />
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0,3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground hover:bg-accent/30">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full">
          <Link href={`/projects/${project._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
