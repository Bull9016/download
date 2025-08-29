
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Briefcase, CheckCircle, MapPin, MessageSquare } from 'lucide-react';
import type { IUser } from '@/models/User';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export type Contractor = IUser;

interface ContractorCardProps {
  contractor: Contractor;
}

export function ContractorCard({ contractor }: ContractorCardProps) {
  
  // Using mock data for properties not in the User model yet
  const mockData = {
    rating: 4.8,
    availability: 'Available' as 'Available' | 'Busy' | 'Unavailable',
    experienceYears: 10,
  };

  const initials = contractor.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "C";


  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
         <Avatar className="h-20 w-20 border-2 border-primary p-0.5">
            <AvatarImage src={contractor.avatarUrl} alt={contractor.name} data-ai-hint="person avatar" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl mb-1">{contractor.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{contractor.professionalTitle}</CardDescription>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(mockData.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({mockData.rating.toFixed(1)})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4 mr-2 text-primary" />
            <span>{mockData.experienceYears} years of experience</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{contractor.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className={`h-4 w-4 mr-2 ${mockData.availability === 'Available' ? 'text-green-500' : 'text-orange-500'}`} />
            <span className={`${mockData.availability === 'Available' ? 'text-green-600' : 'text-orange-600'} font-medium`}>
              {mockData.availability}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 text-foreground">Top Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {contractor.skills && contractor.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="font-normal bg-accent/20 text-accent-foreground hover:bg-accent/30">
                {skill}
              </Badge>
            ))}
            {contractor.skills && contractor.skills.length > 4 && <Badge variant="outline">+{contractor.skills.length - 4} more</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col sm:flex-row gap-2">
        <Button asChild className="w-full">
          <Link href={`/contractors/${contractor._id}`}>View Profile</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
            <Link href={`/chat/${contractor._id}`}>
                <MessageSquare className="mr-2 h-4 w-4" /> Message
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
