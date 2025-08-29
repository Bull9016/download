
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, UserCog, Edit2, Trash2, Eye, MapPin, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { IUser } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  if (status === "Active") return "default"; // Using 'default' for active (primary color based)
  return "outline"; // Using 'outline' for inactive or other statuses
};

export default function ManagerManagementPage() {
  const [managers, setManagers] = useState<IU ser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchManagers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users?role=manager');
        if (!response.ok) {
          throw new Error('Failed to fetch managers');
        }
        const managerUsers: IUser[] = await response.json();
        setManagers(managerUsers);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error fetching data",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchManagers();
  }, [toast]);
  
  const renderSkeleton = () => (
      [...Array(3)].map((_, i) => (
          <TableRow key={i}>
              <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-md" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
          </TableRow>
      ))
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
            <UserCog className="mr-3 h-8 w-8 text-primary" /> Manager Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Add, edit, and manage project managers on the platform.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/managers/new"> {/* Assuming a /admin/managers/new route */}
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Manager
          </Link>
        </Button>
      </section>

      <div className="p-4 border rounded-lg bg-card shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Search managers by name or email..." className="pl-10 w-full md:w-1/3" aria-label="Search managers" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Projects Managed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? renderSkeleton() : error ? (
                <TableRow>
                    <TableCell colSpan={8} className="text-center h-24 text-destructive">
                        <AlertTriangle className="inline-block mr-2" /> {error}
                    </TableCell>
                </TableRow>
            ) : managers.length > 0 ? (
                managers.map((manager) => (
              <TableRow key={manager._id} className="hover:bg-muted/50">
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={manager.avatarUrl} alt={manager.name} data-ai-hint="person avatar"/>
                    <AvatarFallback>{manager.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{manager.name}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{manager.location}</TableCell>
                <TableCell className="text-center">{0}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant("Active")}
                         className={"bg-green-100 text-green-700 border-green-300"}>
                    Active
                  </Badge>
                </TableCell>
                <TableCell>{new Date(manager.joinedDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {/* Link to a manager's profile page, if it exists */}
                      <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" /> Edit Manager</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Manager
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))) : (
              <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                       No managers found. Add a new one to get started.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
