
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, UserCheck, Save, Search } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const mockProjects = [
  { id: "p1", name: "GeoSpatial 3D Mapping Initiative" },
  { id: "p2", name: "AI-Powered Logistics Optimizer" },
  { id: "p3", name: "E-commerce Platform Upgrade" },
];

const mockContractors = [
  { id: "c1", name: "Alice Johnson", avatarUrl: "https://placehold.co/100x100.png?text=AJ", skills: ["React", "Node.js"], currentLoad: "Medium" },
  { id: "c2", name: "Bob Smith", avatarUrl: "https://placehold.co/100x100.png?text=BS", skills: ["UX/UI", "Figma"], currentLoad: "Low" },
  { id: "c3", name: "Charlie Brown", avatarUrl: "https://placehold.co/100x100.png?text=CB", skills: ["DevOps", "AWS"], currentLoad: "High" },
  { id: "c4", name: "Diana Prince", avatarUrl: "https://placehold.co/100x100.png?text=DP", skills: ["Python", "Data Science"], currentLoad: "Medium" },
];

interface Assignment {
  projectId: string;
  contractorIds: string[];
}

export default function WorkAllocationPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [selectedContractorIds, setSelectedContractorIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleContractorSelect = (contractorId: string, checked: boolean) => {
    setSelectedContractorIds(prev => 
      checked ? [...prev, contractorId] : prev.filter(id => id !== contractorId)
    );
  };

  const handleAssign = async () => {
    if (!selectedProjectId || selectedContractorIds.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select a project and at least one contractor.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Assigning contractors:", selectedContractorIds, "to project:", selectedProjectId);
    setIsLoading(false);
    toast({
      title: "Work Allocated",
      description: `${selectedContractorIds.length} contractor(s) have been assigned to the project.`,
    });
    setSelectedContractorIds([]);
    // Optionally reset selectedProjectId or refresh data
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
          <ClipboardList className="mr-3 h-8 w-8 text-primary" /> Work Allocation
        </h1>
        <p className="text-lg text-muted-foreground">
          Assign contractors to specific projects or tasks efficiently.
        </p>
      </section>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Assign Contractors to Project</CardTitle>
          <CardDescription>Select a project and then choose contractors to assign.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="project-select" className="block text-sm font-medium text-foreground mb-1">Select Project</label>
            <Select onValueChange={setSelectedProjectId} value={selectedProjectId}>
              <SelectTrigger id="project-select" className="w-full md:w-[400px]">
                <SelectValue placeholder="Choose a project..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Active Projects</SelectLabel>
                  {mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedProjectId && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Available Contractors</h3>
               <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search contractors by name or skill..." className="pl-9 w-full md:w-1/2" aria-label="Search available contractors" />
              </div>
              <div className="max-h-[400px] overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Current Load</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockContractors.map(contractor => (
                      <TableRow key={contractor.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox
                            id={`contractor-${contractor.id}`}
                            checked={selectedContractorIds.includes(contractor.id)}
                            onCheckedChange={(checked) => handleContractorSelect(contractor.id, checked as boolean)}
                            aria-label={`Select ${contractor.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={contractor.avatarUrl} alt={contractor.name} data-ai-hint="person avatar" />
                              <AvatarFallback>{contractor.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{contractor.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{contractor.skills.join(", ")}</TableCell>
                        <TableCell className="text-xs">{contractor.currentLoad}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleAssign} 
              disabled={isLoading || !selectedProjectId || selectedContractorIds.length === 0}
              size="lg"
            >
              <UserCheck className="mr-2 h-5 w-5" />
              {isLoading ? "Assigning..." : "Assign Selected Contractors"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for "Current Allocations" view */}
      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-xl">Current Project Allocations</CardTitle>
            <CardDescription>Overview of contractors assigned to projects.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">List of projects and their assigned contractors will be displayed here...</p>
            {/* Example: A table or list showing Project -> Contractor(s) */}
        </CardContent>
      </Card>
    </div>
  );
}
