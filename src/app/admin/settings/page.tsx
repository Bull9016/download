
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, Save } from "lucide-react";

// This is a placeholder settings page.
// Actual settings would require backend integration.

export default function SystemSettingsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
          <SlidersHorizontal className="mr-3 h-8 w-8 text-primary" /> System Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Configure platform-wide settings and preferences.
        </p>
      </section>

      <form className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">General Settings</CardTitle>
            <CardDescription>Basic platform configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="Geo 3D Hub" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Administrator Email</Label>
              <Input id="adminEmail" type="email" defaultValue="admin@geo3dhub.com" />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="maintenanceMode" />
              <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Notification Settings</CardTitle>
            <CardDescription>Manage how users receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="emailNotifications" defaultChecked />
              <Label htmlFor="emailNotifications">Enable Email Notifications for New Messages</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="projectUpdates" defaultChecked />
              <Label htmlFor="projectUpdates">Notify Users of Project Status Changes</Label>
            </div>
             <div className="space-y-2">
              <Label htmlFor="defaultNotificationSender">Default Notification Sender Email</Label>
              <Input id="defaultNotificationSender" type="email" defaultValue="noreply@geo3dhub.com" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">AI Feature Settings</CardTitle>
            <CardDescription>Configure parameters for AI-powered tools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
                <Switch id="aiProjectTrackerEnabled" defaultChecked />
                <Label htmlFor="aiProjectTrackerEnabled">Enable AI Project Tracker</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="aiDataScienceStatsEnabled" defaultChecked />
                <Label htmlFor="aiDataScienceStatsEnabled">Enable Data Science Statistics Generation</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiModelPreference">Preferred AI Model (Conceptual)</Label>
              <Input id="aiModelPreference" defaultValue="Default High-Performance Model" disabled />
              <p className="text-xs text-muted-foreground">Model selection is handled by Genkit configuration.</p>
            </div>
          </CardContent>
        </Card>


        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled> {/* Saving is conceptual without backend */}
            <Save className="mr-2 h-5 w-5" /> Save All Settings 
          </Button>
        </div>
      </form>
    </div>
  );
}
