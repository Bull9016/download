
"use client";

import React from 'react';
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Search, Filter, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";


// Mock data for activity log
const mockActivities = [
  { id: "a1", user: "Alice (Admin)", action: "Updated user role for Bob Smith to 'Manager'", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: "User Management" },
  { id: "a2", user: "Sarah (Manager)", action: "Assigned contractor 'John Doe' to project 'GeoSpatial 3D Mapping'", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), type: "Work Allocation" },
  { id: "a3", user: "Client Corp", action: "Posted new project 'E-commerce Platform Upgrade'", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), type: "Project Management" },
  { id: "a4", user: "System", action: "Generated daily performance report", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: "System" },
  { id: "a5", user: "Alice (Admin)", action: "Changed theme primary color", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: "Appearance" },
];

const getTypeBadgeVariant = (type: string): "default" | "secondary" | "outline" | "destructive" => {
  if (type === "User Management") return "default";
  if (type === "Work Allocation") return "secondary";
  if (type === "Project Management") return "outline";
  if (type === "System") return "destructive";
  return "default";
};


export default function ActivityLogPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  // TODO: Implement actual data fetching, filtering, and pagination

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
          <History className="mr-3 h-8 w-8 text-primary" /> Activity Log
        </h1>
        <p className="text-lg text-muted-foreground">
          Track important actions and events across the platform for audit and transparency.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-xl">Filter Activities</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search by user or action..." className="pl-10 w-full" aria-label="Search activities" />
          </div>
          <Select defaultValue="all-types">
            <SelectTrigger className="w-full md:w-[200px]" aria-label="Filter by type">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="user-management">User Management</SelectItem>
              <SelectItem value="project-management">Project Management</SelectItem>
              <SelectItem value="work-allocation">Work Allocation</SelectItem>
              <SelectItem value="system">System Events</SelectItem>
              <SelectItem value="appearance">Appearance</SelectItem>
            </SelectContent>
          </Select>
           <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          <Button variant="outline">Apply Filters</Button>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User/Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivities.map((activity) => (
              <TableRow key={activity.id} className="hover:bg-muted/50">
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(activity.timestamp, "MMM d, yyyy, h:mm a")}
                </TableCell>
                <TableCell className="font-medium">{activity.user}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>
                  <Badge variant={getTypeBadgeVariant(activity.type)}>{activity.type}</Badge>
                </TableCell>
              </TableRow>
            ))}
             {mockActivities.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No activities found for the selected criteria.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* TODO: Add pagination controls if many activities */}
    </div>
  );
}
