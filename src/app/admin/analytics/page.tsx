
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, BarChart, Users, CheckCircle, Construction, Calendar, TrendingUp, Brain, Briefcase, RefreshCw } from "lucide-react";
import type { IProject } from '@/models/Project';
import type { IUser } from '@/models/User';
import { analyzeProjectSkills } from '@/ai/flows/analyze-project-skills';
import { differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';

interface CalculatedStats {
  averageProjectCompletionTime: string;
  projectSuccessRate: string;
  newUserGrowth: {
    clients: number;
    contractors: number;
  };
  topCompaniesWorkedWith: string[];
  mostInDemandSkills: string[];
}

export default function AnalyticsDashboardPage() {
  const [stats, setStats] = useState<CalculatedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projectsRes, usersRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/users'),
      ]);

      if (!projectsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch platform data. If you just seeded the DB, try refetching.');
      }

      const projects: IProject[] = await projectsRes.json();
      const users: IUser[] = await usersRes.json();

      // Perform calculations
      const completedProjects = projects.filter(p => p.status === 'Completed');
      const totalCompletionDays = completedProjects.reduce((acc, p) => {
          return acc + differenceInDays(new Date(p.deadline), new Date(p.startDate));
      }, 0);
      const averageTime = completedProjects.length > 0 ? Math.round(totalCompletionDays / completedProjects.length) : 0;
      
      const successRate = projects.length > 0 ? Math.round((completedProjects.length / projects.length) * 100) : 0;

      const clients = users.filter(u => u.role === 'client');
      const contractors = users.filter(u => u.role === 'contractor');
      
      const companyCounts: Record<string, number> = {};
      clients.forEach(c => {
          if(c.companyName) {
              companyCounts[c.companyName] = (companyCounts[c.companyName] || 0) + 1;
          }
      });
      const topCompanies = Object.entries(companyCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(entry => entry[0]);

      // Get AI-powered skill analysis
      const projectDescriptions = projects.map(p => p.description);
      const skillAnalysis = await analyzeProjectSkills({ projectDescriptions });

      setStats({
        averageProjectCompletionTime: `${averageTime} days`,
        projectSuccessRate: `${successRate}%`,
        newUserGrowth: {
          clients: clients.length,
          contractors: contractors.length,
        },
        topCompaniesWorkedWith: topCompanies,
        mostInDemandSkills: skillAnalysis.mostInDemandSkills,
      });

    } catch (e: any) {
      console.error("Error generating data science stats:", e);
      setError(e.message || "Could not generate AI statistics. Please check your network connection and API key configuration.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getStats();
  }, [getStats]);
  
  const statCards = stats ? [
    { icon: <Calendar className="h-6 w-6 text-muted-foreground" />, label: "Avg. Project Time", value: stats.averageProjectCompletionTime },
    { icon: <CheckCircle className="h-6 w-6 text-muted-foreground" />, label: "Project Success Rate", value: stats.projectSuccessRate },
    { icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />, label: "New Clients", value: stats.newUserGrowth.clients },
    { icon: <Users className="h-6 w-6 text-muted-foreground" />, label: "New Contractors", value: stats.newUserGrowth.contractors },
  ] : [];

  const renderDashboardSkeleton = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4"><Skeleton className="h-6 w-1/4" /></h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
          ))}
        </div>
      </section>
       <section>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2 mb-1" /><Skeleton className="h-4 w-3/4" /></CardHeader>
                <CardContent className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2 mb-1" /><Skeleton className="h-4 w-3/4" /></CardHeader>
                <CardContent className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</CardContent>
            </Card>
        </div>
      </section>
    </div>
  );

  return (
      <div className="space-y-8">
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
                <BarChart className="mr-3 h-8 w-8 text-primary" /> Analytics Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                AI-generated overview of platform performance and key metrics.
              </p>
            </div>
             <Button variant="outline" onClick={getStats} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refetch Data'}
            </Button>
          </div>
        </section>

        {isLoading ? (
          renderDashboardSkeleton()
        ) : error ? (
           <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-md">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                  <Card key={item.label} className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                      {item.icon}
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{item.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            <section>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-headline text-lg">Top Companies</CardTitle>
                      <CardDescription>Clients with the most projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.topCompaniesWorkedWith.length > 0 ? (
                        <ul className="space-y-2 text-sm">
                          {stats.topCompaniesWorkedWith.map(company => <li key={company} className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-primary/70" />{company}</li>)}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No company data available.</p>
                      )}
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
            </section>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No analytics data available.</p>
          </div>
        )}
      </div>
  );
}
