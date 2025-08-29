
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Users2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { IUser } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
  // All roles in the image have a similar muted background
  return "secondary";
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    if (status === "Active") return "secondary";
    // A different style could be used for inactive, but the image is consistent
    return "secondary";
};


export default function UserManagementPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users from the database.');
            }
            const data: IUser[] = await response.json();
            setUsers(data);
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
    fetchUsers();
  }, [toast]);

  const renderSkeleton = () => (
    [...Array(10)].map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24 rounded-md" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20 rounded-md" /></TableCell>
        <TableCell><Skeleton className="h-4 w-10" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight">
          User Management
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Manage user accounts, roles, and permissions.
        </p>
      </section>

      <Card>
        <CardHeader>
            <CardTitle>User List</CardTitle>
             <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="search" placeholder="Search users" className="pl-10 w-full md:w-1/3" aria-label="Search users" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? renderSkeleton() : users.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href={`/contractors/${user._id}`} className="hover:underline text-primary">
                            {user.name}
                          </Link>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="font-normal">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                           {/* Using a static "Active" for now as it's not in the DB model */}
                           <Badge variant={getStatusBadgeVariant("Active")} className="font-normal">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/contractors/${user._id}`} className="text-sm font-medium text-primary hover:underline">View</Link>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
             {!isLoading && !error && users.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    <Users2 className="mx-auto h-12 w-12 mb-3" />
                    <p>No users found in the database.</p>
                </div>
             )}
             {error && (
                <div className="text-center py-10 text-destructive">
                    <AlertTriangle className="mx-auto h-12 w-12 mb-3" />
                    <h3 className="font-semibold">Failed to load data</h3>
                    <p>{error}</p>
                </div>
            )}
        </CardContent>
      </Card>

        {!isLoading && (
             <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">10</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )}
    </div>
  );
}
