
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Brain, Loader2, AlertTriangle, Users, CheckCircle, Construction, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  generateDataScienceStats,
  type GenerateDataScienceStatsOutput,
} from '@/ai/flows/generate-data-science-stats';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarPicker } from '../ui/calendar';
import { format } from 'date-fns';

export function DataScienceDashboard() {
  const [stats, setStats] = useState<GenerateDataScienceStatsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  });

  useEffect(() => {
    const getStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateDataScienceStats({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        });
        setStats(result);
      } catch (e: any) {
        console.error("Error generating data science stats:", e);
        setError("Could not generate AI statistics. Please check your network connection and API key configuration.");
      } finally {
        setIsLoading(false);
      }
    };
    getStats();
  }, [dateRange]);

  const statCards = stats ? [
    { icon: <Calendar className="h-6 w-6 text-muted-foreground" />, label: "Avg. Project Time", value: stats.averageProjectCompletionTime },
    { icon: <CheckCircle className="h-6 w-6 text-muted-foreground" />, label: "Project Success Rate", value: stats.projectSuccessRate },
    { icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />, label: "New Clients", value: stats.newUserGrowth.clients },
    { icon: <Users className="h-6 w-6 text-muted-foreground" />, label: "New Contractors", value: stats.newUserGrowth.contractors },
  ] : [];

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                 <CardTitle className="font-headline text-2xl flex items-center">
                    <BarChart className="mr-2 h-6 w-6 text-primary" />
                    Data Science Statistics
                </CardTitle>
                <CardDescription>
                    AI-powered insights into platform activity and contractor performance.
                </CardDescription>
            </div>
            {/* Date range picker would go here */}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
            <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-md">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-medium">{error}</p>
             </div>
        ) : stats ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map(item => (
                    <Card key={item.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                           {item.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
             <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Top Companies</CardTitle>
                  <CardDescription>Companies contractors worked with the most.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {stats.topCompaniesWorkedWith.map(company => <li key={company} className="flex items-center"><Construction className="h-4 w-4 mr-2 text-primary/70" />{company}</li>)}
                  </ul>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Most In-Demand Skills</CardTitle>
                  <CardDescription>Top skills based on project requirements.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ul className="space-y-2 text-sm">
                    {stats.mostInDemandSkills.map(skill => <li key={skill} className="flex items-center"><Brain className="h-4 w-4 mr-2 text-primary/70" />{skill}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <p>No statistics available.</p>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
    return (
         <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <Skeleton className="h-5 w-2/3" />
                           <Skeleton className="h-6 w-6 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-1/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
             <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3 mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-2">
                   {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3 mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-2">
                   {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
                </CardContent>
              </Card>
            </div>
          </div>
    )
}
