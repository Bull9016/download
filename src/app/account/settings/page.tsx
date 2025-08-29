
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Shield, Bell, Palette, Save, Upload, KeyRound } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSettingsPage() {
  const [profileData, setProfileData] = useState({
    name: "Demo User",
    email: "demo@example.com",
    title: "Software Engineer", 
    location: "San Francisco, CA",
    bio: "A passionate developer and lifelong learner.",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Updating profile:", profileData, avatarFile);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };
  
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    console.log("Updating password for:", profileData.email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Password Updated", description: "Your password has been changed successfully." });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };
  
  const initials = profileData.name.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  return (
    <AppLayout>
      <div className="space-y-8">
        <section>
          <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
            <UserCircle className="mr-3 h-8 w-8 text-primary" /> Account Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your profile, security, and notification preferences.
          </p>
        </section>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="profile"><UserCircle className="mr-1 h-4 w-4 sm:mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="security"><Shield className="mr-1 h-4 w-4 sm:mr-2" />Security</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-1 h-4 w-4 sm:mr-2" />Notifications</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="mr-1 h-4 w-4 sm:mr-2" />Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Public Profile</CardTitle>
                <CardDescription>This information will be displayed publicly.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2">
                      <AvatarImage src={avatarPreview || undefined} alt={profileData.name} data-ai-hint="person avatar" />
                      <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow space-y-1 text-center sm:text-left">
                      <Label htmlFor="avatarUpload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        <Upload className="mr-2 h-4 w-4" /> Change Avatar
                      </Label>
                      <input type="file" id="avatarUpload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" value={profileData.email} readOnly />
                    </div>
                  </div>
                   <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input id="title" name="title" placeholder="e.g., Senior Developer" value={profileData.title} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" placeholder="e.g., San Francisco, CA" value={profileData.location} onChange={handleProfileChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" placeholder="Tell us a bit about yourself" value={profileData.bio} onChange={handleProfileChange} rows={4} />
                  </div>
                </CardContent>
                <CardContent className="border-t pt-6 flex justify-end">
                  <Button type="submit" size="lg">
                    <Save className="mr-2 h-4 w-4" /> Save Profile
                  </Button>
                </CardContent>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Password & Security</CardTitle>
                <CardDescription>Manage your password and account security settings.</CardDescription>
              </CardHeader>
               <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                        </div>
                    </div>
                    {/* Placeholder for 2FA settings */}
                    <div className="pt-4 border-t">
                        <h3 className="text-md font-semibold mb-2">Two-Factor Authentication (2FA)</h3>
                        <p className="text-sm text-muted-foreground mb-3">Enhance your account security by enabling 2FA.</p>
                        <Button variant="outline" disabled>Enable 2FA (Coming Soon)</Button>
                    </div>
                </CardContent>
                <CardContent className="border-t pt-6 flex justify-end">
                    <Button type="submit" size="lg">
                        <KeyRound className="mr-2 h-4 w-4" /> Update Password
                    </Button>
                </CardContent>
               </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Notification Preferences</CardTitle>
                    <CardDescription>Choose how you receive notifications from the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">Notification settings are currently managed globally by administrators. User-level preferences coming soon.</p>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <p className="text-muted-foreground">Theme customization (Light/Dark mode toggle) is handled globally. More appearance settings might be available in the future.</p>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
