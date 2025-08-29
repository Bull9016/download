
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Loader2, AlertTriangle, LineChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  predictContractorPerformance,
  type PredictContractorPerformanceInput,
  type PredictContractorPerformanceOutput,
} from '@/ai/flows/predict-contractor-performance';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ContractorAnalyticsProps {
  contractorData: {
    id: string;
    skills: string[];
    projectHistory: { name: string; role: string; duration: string }[];
    rating: number;
  };
}

export function ContractorAnalytics({ contractorData }: ContractorAnalyticsProps) {
  const [prediction, setPrediction] = useState<PredictContractorPerformanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPrediction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const input: PredictContractorPerformanceInput = {
          contractorId: contractorData.id,
          skills: contractorData.skills,
          projectHistory: contractorData.projectHistory,
          rating: contractorData.rating,
        };
        const result = await predictContractorPerformance(input);
        setPrediction(result);
      } catch (e: any) {
        console.error("Error fetching contractor performance prediction:", e);
        setError("Could not generate AI forecast. Please check your network connection and API key configuration.");
      } finally {
        setIsLoading(false);
      }
    };
    getPrediction();
  }, [contractorData]);

  const earningsData = prediction ? [
    { name: 'Next 6 Months', earnings: prediction.predictedEarnings.nextSixMonths },
    { name: 'Next 12 Months', earnings: prediction.predictedEarnings.nextYear },
  ] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            AI-Powered Forecast
          </CardTitle>
          <CardDescription>
            Predictive analytics for contractor performance based on their profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <AnalyticsSkeleton />}
          {error && (
             <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-md">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-medium">{error}</p>
             </div>
          )}
          {!isLoading && !error && prediction && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Predicted Earnings (INR)</h3>
                 <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={earningsData}>
                       <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--muted))', radius: 'var(--radius)' }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                        }}
                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Earnings']}
                      />
                      <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Likely Project Types</h3>
                    <ul className="list-disc list-inside text-foreground space-y-1">
                        {prediction.predictedProjectTypes.map(type => <li key={type}>{type}</li>)}
                    </ul>
                  </div>
                   <div>
                    <h3 className="font-semibold text-lg mb-2">Prediction Summary</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{prediction.predictionSummary}</p>
                  </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


function AnalyticsSkeleton() {
  return (
     <div className="grid md:grid-cols-2 gap-6">
        <div>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="space-y-4">
             <div>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-2/3 mb-1" />
                <Skeleton className="h-4 w-1/2" />
             </div>
             <div>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-16 w-full" />
             </div>
        </div>
    </div>
  )
}
