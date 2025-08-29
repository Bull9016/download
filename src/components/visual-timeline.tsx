"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, Target, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Milestone {
  id: string;
  name: string;
  dueDate: Date | string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  description?: string;
}

interface VisualTimelineProps {
  milestones: Milestone[];
  projectStartDate: Date | string;
  projectEndDate: Date | string;
}

const getStatusIcon = (status: Milestone['status']) => {
  switch (status) {
    case 'Completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'In Progress': return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
    case 'Delayed': return <Flag className="h-5 w-5 text-red-500" />;
    case 'Pending': default: return <Circle className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusColor = (status: Milestone['status']) => {
  switch (status) {
    case 'Completed': return 'bg-green-500';
    case 'In Progress': return 'bg-blue-500';
    case 'Delayed': return 'bg-red-500';
    case 'Pending': default: return 'bg-muted-foreground';
  }
}

export function VisualTimeline({ milestones, projectStartDate, projectEndDate }: VisualTimelineProps) {
  const startDate = new Date(projectStartDate);
  const endDate = new Date(projectEndDate);
  const totalDuration = endDate.getTime() - startDate.getTime();

  // Sort milestones by due date
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Target className="mr-2 h-6 w-6 text-primary" />
          Project Timeline & Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedMilestones.length === 0 ? (
          <p className="text-muted-foreground">No milestones defined for this project yet.</p>
        ) : (
          <div className="relative space-y-8 py-4">
            {/* Timeline Axis */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border"></div>
            
            {sortedMilestones.map((milestone, index) => {
              const milestoneDate = new Date(milestone.dueDate);
              const positionPercent = totalDuration > 0 ? ((milestoneDate.getTime() - startDate.getTime()) / totalDuration) * 100 : 0;
              const clampedPosition = Math.max(0, Math.min(100, positionPercent));

              return (
                <div key={milestone.id} className="relative pl-12">
                  {/* Milestone Dot on Axis */}
                  <div className={cn(
                    "absolute left-[1.10rem] -translate-x-1/2 top-1 h-4 w-4 rounded-full border-2 border-background",
                    getStatusColor(milestone.status)
                  )} style={{ 
                    // This positioning is relative to the item, not the whole timeline axis
                    // For actual visual timeline bar, a different approach for dots on a single bar is needed.
                    // Here, we are representing a list of milestones with status indicators.
                   }}>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-md text-primary">{milestone.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        Due: {milestoneDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      {getStatusIcon(milestone.status)}
                      <span>{milestone.status}</span>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
