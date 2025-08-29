
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ShieldCheck } from "lucide-react";

// This is a simplified placeholder page.
// Role management can be complex, involving permissions.
// For now, it will be a basic informational page.

const roles = [
  { name: "Admin", description: "Full access to all platform features and settings." },
  { name: "Manager", description: "Manages projects, assigns contractors, and oversees progress." },
  { name: "Client", description: "Posts projects, hires contractors, and tracks project development." },
  { name: "Contractor", description: "Provides services, updates work progress, and communicates with clients/managers." },
];

export default function RoleManagementPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
                <ShieldCheck className="mr-3 h-8 w-8 text-primary" /> Role Management
            </h1>
            <p className="text-lg text-muted-foreground">
                Define and manage user roles and their associated permissions.
            </p>
        </div>
        <Button size="lg" disabled> {/* Feature not fully implemented */}
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Role
        </Button>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {roles.map(role => (
          <Card key={role.name} className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{role.description}</p>
              {/* In a real app, list permissions or link to edit permissions */}
              <Button variant="outline" size="sm" className="mt-4" disabled>Edit Permissions</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
            <CardTitle className="font-headline text-xl">Permissions Overview</CardTitle>
            <CardDescription>
                This section would typically show a detailed matrix of roles and their permissions.
                For this version, role management is primarily informational.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Detailed permission configuration is planned for a future update.
                Currently, roles are predefined with implicit permissions based on their name.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
