
"use client";

import { AppLayout } from "@/components/layout/app-layout"; // Use the main AppLayout
import { DataScienceDashboard } from "@/components/ai/data-science-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Briefcase, Settings, UserCog, ClipboardList, LayoutDashboard, ShieldCheck, Palette, History } from "lucide-react";

export default function AdminDashboardPage() {
  const quickStats = [
    { title: "Total Users", value: "1,250", icon: Users, change: "+5% this month" },
    { title: "Active Projects", value: "78", icon: Briefcase, change: "+2 this week" },
    { title: "Pending Approvals", value: "12", icon: UserCog, change: "Action needed" },
  ];

  const adminActions = [
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/managers", label: "Manage Managers", icon: UserCog },
    { href: "/admin/roles", label: "Role Management", icon: ShieldCheck },
    { href: "/admin/work-allocation", label: "Allocate Work", icon: ClipboardList },
    { href: "/admin/appearance", label: "Appearance", icon: Palette },
    { href: "/admin/activity-log", label: "Activity Log", icon: History },
    { href: "/admin/settings", label: "System Settings", icon: Settings },
  ];

  return (
    // AppLayout is handled by src/app/admin/layout.tsx
    <div className="space-y-8">
      <section>
        <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
          <LayoutDashboard className="mr-3 h-8 w-8 text-primary" /> Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Oversee platform operations, manage users, and view key metrics.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickStats.map(stat => (
          <Card key={stat.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Administrative Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {adminActions.map(action => (
            <Button key={action.label} asChild variant="outline" className="p-6 h-auto text-left flex flex-col items-start gap-2 hover:bg-accent hover:text-accent-foreground">
              <Link href={action.href}>
                <action.icon className="h-7 w-7 text-primary mb-1" />
                <span className="font-semibold text-md">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section>
        <DataScienceDashboard />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Recent Platform Activity (Example)</CardTitle>
          <CardDescription>Overview of recent user registrations, project creations, etc. (Actual data from Activity Log)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This section would ideally show a summary from the Activity Log. For now, please refer to the dedicated <Link href="/admin/activity-log" className="text-primary hover:underline">Activity Log page</Link>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
