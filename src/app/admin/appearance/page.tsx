
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Image as ImageIcon, Save, Upload, PaletteIcon } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Default HSL values from globals.css (light theme)
const DEFAULT_THEME_COLORS = {
  background: "210 20% 95%",
  primary: "210 70% 50%",
  accent: "180 60% 40%",
};

// Mock data for site images (these should match actual placeholders in use)
const siteImages = [
  {
    id: "aboutUsMission",
    label: "About Us: Mission Image",
    currentSrc: "https://placehold.co/700x500.png",
    aiHint: "team collaboration",
    width: 700,
    height: 500,
  },
  {
    id: "dashboardProjects",
    label: "Dashboard: Projects Card Image",
    currentSrc: "https://placehold.co/600x400.png",
    aiHint: "project management",
    width: 600,
    height: 400,
  },
  {
    id: "dashboardContractors",
    label: "Dashboard: Contractors Card Image",
    currentSrc: "https://placehold.co/600x400.png",
    aiHint: "team collaboration",
    width: 600,
    height: 400,
  },
  {
    id: "dashboardSmartMatch",
    label: "Dashboard: Smart Match Card Image",
    currentSrc: "https://placehold.co/600x400.png",
    aiHint: "network connection",
    width: 600,
    height: 400,
  },
];

export default function AppearanceManagementPage() {
  const { toast } = useToast();
  const [themeColors, setThemeColors] = useState(DEFAULT_THEME_COLORS);
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});

  // Effect to set initial colors when component mounts, in case defaults change later
  useEffect(() => {
    // In a real app, you might fetch current values if they are stored dynamically
    // For now, we rely on DEFAULT_THEME_COLORS
    setThemeColors(DEFAULT_THEME_COLORS);
  }, []);


  const handleThemeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeColors({ ...themeColors, [e.target.name]: e.target.value });
  };

  const handleImageFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFiles({ ...imageFiles, [id]: e.target.files[0] });
    } else {
      setImageFiles({ ...imageFiles, [id]: null });
    }
  };

  const handleUpdateImages = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Mock updating images:", imageFiles);
    // This is a prototype. Actual image upload and path update is not implemented.
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Image Update (Prototype)",
      description: "Image update functionality is a prototype. No changes have been persisted.",
    });
  };
  
  // This function will be passed as the content for globals.css modification
  // It's defined here to be available when needed by the XML response generation.
  const generateNewGlobalsCssContent = (newColors: typeof DEFAULT_THEME_COLORS) => {
    // This is a simplified representation. The actual function would need the full current globals.css content.
    // The thinking process in the AI will construct the actual string replacement.
    // For now, this is a placeholder.
    return `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    body {
      font-family: 'PT Sans', sans-serif; /* Default body font */
    }

    @layer base {
      :root {
        --background: ${newColors.background}; /* Light desaturated blue */
        --foreground: 224 71.4% 4.1%; /* Dark blue, good contrast on light bg */

        --card: 0 0% 100%; /* White cards */
        --card-foreground: 224 71.4% 4.1%;

        --popover: 0 0% 100%;
        --popover-foreground: 224 71.4% 4.1%;

        --primary: ${newColors.primary}; /* Bright saturated blue */
        --primary-foreground: 210 40% 98%; /* Near white for text on primary */

        --secondary: 210 20% 88%; /* Slightly darker/muted blue for secondary elements */
        --secondary-foreground: 224 71.4% 4.1%;

        --muted: 210 20% 80%; /* Muted blue */
        --muted-foreground: 210 10% 45%; /* Lighter text for muted contexts */

        --accent: ${newColors.accent}; /* Analogous cyan */
        --accent-foreground: 0 0% 100%; /* White text on accent for better contrast */

        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 0 0% 98%;

        --border: 210 20% 80%; /* Border color matching muted tones */
        --input: 210 20% 85%; /* Input background */
        --ring: 210 70% 50%; /* Ring color matching primary */

        --radius: 0.5rem;

        /* Sidebar specific colors */
        --sidebar-background: 210 25% 90%; /* Slightly darker shade of main background */
        --sidebar-foreground: 224 71.4% 4.1%; /* Dark text for sidebar */
        --sidebar-primary: 210 70% 50%; /* Match app primary */
        --sidebar-primary-foreground: 210 40% 98%; /* Match app primary foreground */
        --sidebar-accent: 180 60% 45%; /* Slightly adjusted accent for sidebar if needed, or match app accent */
        --sidebar-accent-foreground: 0 0% 100%;
        --sidebar-border: 210 20% 75%; /* Border for sidebar elements */
        --sidebar-ring: 180 60% 40%; /* Ring color for sidebar focus, matching accent */

        --chart-1: 12 76% 61%;
        --chart-2: 173 58% 39%;
        --chart-3: 197 37% 24%;
        --chart-4: 43 74% 66%;
        --chart-5: 27 87% 67%;
      }

      .dark {
        /* Define dark theme variables if needed, or adjust existing ones */
        --background: 224 71.4% 4.1%;
        --foreground: 210 20% 95%;

        --card: 224 71.4% 6.1%;
        --card-foreground: 210 20% 95%;

        --popover: 224 71.4% 6.1%;
        --popover-foreground: 210 20% 95%;

        --primary: 210 70% 55%; /* Slightly lighter primary for dark mode */
        --primary-foreground: 210 40% 98%;

        --secondary: 210 20% 15%;
        --secondary-foreground: 210 20% 95%;

        --muted: 210 20% 20%;
        --muted-foreground: 210 10% 65%;

        --accent: 180 60% 45%; /* Slightly lighter accent for dark mode */
        --accent-foreground: 0 0% 100%;

        --destructive: 0 72.2% 50.6%;
        --destructive-foreground: 0 0% 98%;

        --border: 210 20% 25%;
        --input: 210 20% 22%;
        --ring: 210 70% 55%;

        /* Dark Sidebar specific colors */
        --sidebar-background: 224 71.4% 8.1%;
        --sidebar-foreground: 210 20% 95%;
        --sidebar-primary: 210 70% 55%;
        --sidebar-primary-foreground: 210 40% 98%;
        --sidebar-accent: 180 60% 50%;
        --sidebar-accent-foreground: 0 0% 100%;
        --sidebar-border: 210 20% 30%;
        --sidebar-ring: 180 60% 45%;
      }
    }

    @layer base {
      * {
        @apply border-border;
      }
      body {
        @apply bg-background text-foreground;
      }
    }
    `;
  };

  // IMPORTANT: The actual handleUpdateThemeColors needs to be generated by the AI
  // when the user confirms, by creating a <change> block for globals.css.
  // This client-side function is just for the UI interaction.
  const handleUpdateThemeColorsFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // This function will be called by the form, but the actual file modification
    // will be specified in the AI's XML response if the user confirms this action.
    // For now, it shows a toast indicating what would happen.
    console.log("Updating theme colors to:", themeColors);
    toast({
      title: "Theme Colors Ready to Update",
      description: "Confirm this change in the chat to apply the new theme colors to globals.css.",
    });
  };


  return (
    <AppLayout>
      <div className="space-y-8">
        <section>
          <h1 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center">
            <PaletteIcon className="mr-3 h-8 w-8 text-primary" /> Appearance Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Customize site images and theme colors.
          </p>
        </section>

        <Tabs defaultValue="siteImages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="siteImages"><ImageIcon className="mr-1 h-4 w-4 sm:mr-2" />Site Images</TabsTrigger>
            <TabsTrigger value="themeColors"><Palette className="mr-1 h-4 w-4 sm:mr-2" />Theme Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="siteImages">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Manage Site Images (Prototype)</CardTitle>
                <CardDescription>
                    This section is a prototype for managing site-wide images.
                    Actual image uploads and updates are not implemented in this version.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateImages}>
                <CardContent className="space-y-8">
                  {siteImages.map((img) => (
                    <div key={img.id} className="p-4 border rounded-lg space-y-3">
                      <Label htmlFor={img.id} className="text-md font-semibold">{img.label}</Label>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <Image
                          src={img.currentSrc}
                          alt={img.label}
                          width={img.width / 3} // Show smaller preview
                          height={img.height / 3}
                          className="rounded-md border object-contain"
                          data-ai-hint={img.aiHint}
                        />
                        <div className="flex-grow space-y-2">
                           <p className="text-xs text-muted-foreground">Current AI Hint: "{img.aiHint}"</p>
                          <Input
                            id={img.id}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(img.id, e)}
                          />
                           {imageFiles[img.id] && <p className="text-xs text-muted-foreground">Selected: {imageFiles[img.id]?.name}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardContent className="border-t pt-6 flex justify-end">
                  <Button type="submit" size="lg">
                    <Save className="mr-2 h-4 w-4" /> Update Images (Prototype)
                  </Button>
                </CardContent>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="themeColors">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Customize Light Theme Colors</CardTitle>
                <CardDescription>
                  Modify the HSL values for core light theme colors. Changes will affect <code>:root</code> variables in <code>globals.css</code>.
                  <br /> Enter HSL values as space-separated numbers (e.g., "210 20% 95%").
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateThemeColorsFormSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color (HSL)</Label>
                      <Input
                        id="backgroundColor"
                        name="background"
                        value={themeColors.background}
                        onChange={handleThemeColorChange}
                        placeholder="e.g., 210 20% 95%"
                      />
                      <p className="text-xs text-muted-foreground">Default: {DEFAULT_THEME_COLORS.background}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color (HSL)</Label>
                      <Input
                        id="primaryColor"
                        name="primary"
                        value={themeColors.primary}
                        onChange={handleThemeColorChange}
                        placeholder="e.g., 210 70% 50%"
                      />
                      <p className="text-xs text-muted-foreground">Default: {DEFAULT_THEME_COLORS.primary}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color (HSL)</Label>
                      <Input
                        id="accentColor"
                        name="accent"
                        value={themeColors.accent}
                        onChange={handleThemeColorChange}
                        placeholder="e.g., 180 60% 40%"
                      />
                       <p className="text-xs text-muted-foreground">Default: {DEFAULT_THEME_COLORS.accent}</p>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="border-t pt-6 flex justify-end">
                  <Button type="submit" size="lg">
                    <Palette className="mr-2 h-4 w-4" /> Save Theme Colors
                  </Button>
                </CardContent>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
