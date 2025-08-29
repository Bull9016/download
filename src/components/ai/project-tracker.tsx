
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2, AlertTriangle, CheckCircle, AlertCircle, TrendingUp, CalendarCheck2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  analyzeContractorUpdates,
  type AnalyzeContractorUpdatesInput,
  type AnalyzeContractorUpdatesOutput,
} from '@/ai/flows/analyze-contractor-updates';

interface AiProjectTrackerProps {
  projectDescription: string;
  contractorUpdates: string;
  currentTimeline?: string;
}

export function AiProjectTracker({ projectDescription, contractorUpdates, currentTimeline }: AiProjectTrackerProps) {
  const [analysis, setAnalysis] = useState<AnalyzeContractorUpdatesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Debounce or logic to prevent re-running on every keystroke if updates are live
    const getAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const input: AnalyzeContractorUpdatesInput = {
          projectDescription,
          contractorUpdates,
          currentTimeline,
        };
        const result = await analyzeContractorUpdates(input);
        setAnalysis(result);
      } catch (e: any) {
        console.error("Error fetching AI project analysis:", e);
        setError("Could not generate AI analysis. Please check your network connection and API key configuration.");
      } finally {
        setIsLoading(false);
      }
    };
    if (contractorUpdates) {
        getAnalysis();
    } else {
        setIsLoading(false);
    }
  }, [projectDescription, contractorUpdates, currentTimeline]);

  if (isLoading) {
    return <TrackerSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-md">
        <AlertTriangle className="h-5 w-5" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!analysis) {
     return <p className="text-sm text-muted-foreground">No analysis available. Submit an update to begin.</p>;
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-2">
        {analysis.isOnTrack ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-500" />
        )}
        <p className="font-semibold">
          Project Status: <span className={analysis.isOnTrack ? 'text-green-600' : 'text-yellow-600'}>{analysis.isOnTrack ? 'On Track' : 'Potential Delays'}</span>
        </p>
      </div>
      <div>
         <p className="font-semibold mb-1 flex items-center"><TrendingUp className="mr-2 h-4 w-4" />Progress Summary</p>
         <p className="text-muted-foreground">{analysis.progressSummary}</p>
      </div>
       <div>
         <p className="font-semibold mb-1 flex items-center"><AlertCircle className="mr-2 h-4 w-4" />Identified Delays</p>
         <p className="text-muted-foreground">{analysis.potentialDelays || 'None identified.'}</p>
      </div>
      {analysis.revisedTimeline && (
         <div>
             <p className="font-semibold mb-1 flex items-center"><CalendarCheck2 className="mr-2 h-4 w-4" />Revised Timeline</p>
             <p className="text-muted-foreground">{analysis.revisedTimeline}</p>
         </div>
      )}
    </div>
  );
}


function TrackerSkeleton() {
    return (
        <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-32" />
             </div>
             <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-10 w-full" />
             </div>
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-2/3" />
             </div>
        </div>
    )
}
