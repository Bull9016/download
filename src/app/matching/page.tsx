
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GitFork, Users, Search, Briefcase, MapPin, CalendarClock, Loader2 } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { ContractorCard } from "@/components/contractor-card";
import { useToast } from "@/hooks/use-toast";
import type { IUser } from "@/models/User";

const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna",
  "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali",
  "Vasai-Virar", "Varanasi"
];

const timeframes = [
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "6-12 months",
  "More than 1 year",
  "Flexible"
];

const availableSkills = ["General Contracting", "Plumbing", "Electrical", "HVAC", "Framing", "Roofing", "Painting", "Drywall", "Data Science", "AI", "Web Development", "3D Modeling"];

export default function SmartMatchingPage() {
  const [allContractors, setAllContractors] = useState<IUser[]>([]);
  const [projectRequirements, setProjectRequirements] = useState({
    title: "",
    description: "",
    projectLocation: "",
    requiredSkills: [] as string[],
    timeframe: "",
    availability: "any",
    budgetRange: "",
  });
  const [matchedContractors, setMatchedContractors] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wasSearched, setWasSearched] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch all contractors once on component mount
    const fetchAllContractors = async () => {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error("Failed to fetch contractors");
            const users: IUser[] = await response.json();
            setAllContractors(users.filter(u => u.role === 'contractor'));
        } catch(err) {
            toast({ title: "Error", description: "Could not load contractor list for matching.", variant: "destructive" });
        }
    }
    fetchAllContractors();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectRequirements(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProjectRequirements(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillChange = (skill: string, checked: boolean) => {
    setProjectRequirements(prev => {
      const newSkills = checked 
        ? [...prev.requiredSkills, skill]
        : prev.requiredSkills.filter(s => s !== skill);
      return { ...prev, requiredSkills: newSkills };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setWasSearched(true);
    console.log("Matching with requirements:", projectRequirements);

    // Simulate AI matching process - in a real app, this would be a complex API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Local filtering to simulate matching
    const results = allContractors.filter(contractor => {
        const locationMatch = !projectRequirements.projectLocation || contractor.location?.includes(projectRequirements.projectLocation);
        const skillsMatch = projectRequirements.requiredSkills.every(reqSkill => 
            contractor.skills?.includes(reqSkill)
        );
        return locationMatch && skillsMatch;
    });

    setMatchedContractors(results);
    setIsLoading(false);
    toast({
      title: "Matching Complete",
      description: `Found ${results.length} potential contractor(s).`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <section>
          <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
            <GitFork className="mr-3 h-10 w-10 text-primary" /> Smart Contractor Matching
          </h1>
          <p className="text-lg text-muted-foreground">
            Describe your project, and let our AI find the best-suited local contractors for your needs.
          </p>
        </section>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Project Requirements</CardTitle>
            <CardDescription>Fill in the details below to find suitable contractors.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Kitchen Remodel, New Deck Construction" value={projectRequirements.title} onChange={handleInputChange} required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="projectLocation">Project Location</Label>
                    <Select name="projectLocation" onValueChange={(value) => handleSelectChange("projectLocation", value)} value={projectRequirements.projectLocation}>
                        <SelectTrigger id="projectLocation">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                        <SelectContent>
                            {indianCities.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea id="description" name="description" placeholder="Provide a detailed overview of the project, scope, and deliverables." rows={5} value={projectRequirements.description} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label>Required Trades / Skills</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 border rounded-md">
                  {availableSkills.map(skill => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`skill-${skill}`} 
                        checked={projectRequirements.requiredSkills.includes(skill)}
                        onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                      />
                      <Label htmlFor={`skill-${skill}`} className="font-normal text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability Needed</Label>
                  <Select name="availability" onValueChange={(value) => handleSelectChange("availability", value)} value={projectRequirements.availability}>
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract/Project-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Budget Range (Optional)</Label>
                  <Input id="budgetRange" name="budgetRange" placeholder="e.g., ₹4,00,000 - ₹8,00,000" value={projectRequirements.budgetRange} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeframe">Project Timeframe</Label>
                 <Select name="timeframe" onValueChange={(value) => handleSelectChange("timeframe", value)} value={projectRequirements.timeframe}>
                    <SelectTrigger id="timeframe">
                      <SelectValue placeholder="Select a timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                        {timeframes.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                {isLoading ? "Finding Matches..." : "Find Best Matches"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {wasSearched && !isLoading && (
          <section className="mt-10">
            <h2 className="font-headline text-2xl font-semibold mb-6 flex items-center">
              <Users className="mr-3 h-7 w-7 text-primary" /> Matched Contractors ({matchedContractors.length})
            </h2>
            {matchedContractors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedContractors.map(contractor => (
                    <ContractorCard key={contractor._id} contractor={contractor} />
                ))}
                </div>
            ) : (
                <Card className="mt-10 text-center py-10">
                    <CardContent>
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-headline text-xl font-semibold">No Exact Matches Found</h3>
                        <p className="text-muted-foreground">Try adjusting your criteria or broadening your search.</p>
                    </CardContent>
                </Card>
            )}
          </section>
        )}
      </div>
    </AppLayout>
  );
}
