
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ContractorCard } from "@/components/contractor-card";
import type { IUser } from "@/models/User";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContractors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users?role=contractor'); // Fetches only contractors
        if (!response.ok) {
          throw new Error('Failed to fetch contractors');
        }
        const contractorUsers: IUser[] = await response.json();
        setContractors(contractorUsers);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        toast({ title: "Error", description: "Could not fetch contractor data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContractors();
  }, [toast]);

  const renderSkeleton = () => (
    [...Array(6)].map((_, i) => (
      <CardSkeleton key={`skeleton-${i}`} />
    ))
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <section>
          <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2">Find Contractors</h1>
          <p className="text-lg text-muted-foreground">
            Discover skilled professionals for your projects.
          </p>
        </section>

        <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card shadow">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search by name, trade, or location..." className="pl-10 w-full" aria-label="Search contractors" />
          </div>
          <div className="flex gap-2 items-center">
            <Select defaultValue="all-skills">
              <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by skill">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-skills">All Trades</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="carpentry">Carpentry</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="hidden md:inline-flex">Apply Filters</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeleton()}
          </div>
        ) : error ? (
           <div className="text-center py-10 text-destructive">
            <AlertTriangle className="mx-auto h-12 w-12 mb-3" />
            <h3 className="font-semibold">Failed to load data</h3>
            <p>{error}</p>
          </div>
        ) : contractors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contractors.map((contractor) => (
              <ContractorCard key={contractor._id} contractor={contractor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-headline text-xl font-semibold">No Contractors Found</h3>
            <p className="text-muted-foreground">No contractors have registered yet.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


function CardSkeleton() {
  return (
    <div className="flex flex-col h-full shadow-lg border rounded-lg p-4 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
       <Skeleton className="h-10 w-full" />
    </div>
  )
}
