
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";

interface DailyUpdateFormProps {
  projectId: string;
  // In a real app, you'd also pass contractorId or get it from auth
}

export function DailyUpdateForm({ projectId }: DailyUpdateFormProps) {
  const [updateText, setUpdateText] = useState("");
  const [milestoneAchieved, setMilestoneAchieved] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Submitting update for project", projectId, { 
      updateText, 
      milestoneAchieved,
      imageName: imageFile?.name,
      imageType: imageFile?.type,
      // In a real app, you would upload the 'imageFile' or send 'imagePreview' (data URI)
    });
    
    // In a real app, you'd send this data to your backend
    // and potentially trigger the AI Project Tracker analysis

    setIsLoading(false);
    setUpdateText("");
    setMilestoneAchieved(false);
    removeImage();
    toast({
      title: "Update Submitted",
      description: "Your daily work update has been successfully recorded.",
      variant: "default", 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Submit Daily Update</CardTitle>
        <CardDescription>
          Keep the project stakeholders informed about your progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="updateText" className="block text-sm font-medium text-foreground">
              What did you work on today?
            </Label>
            <Textarea
              id="updateText"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Describe your tasks, progress, and any blockers..."
              rows={5}
              required
              className="focus:ring-primary focus:border-primary"
              aria-label="Daily update text"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUpload">Attach an Image (Optional)</Label>
            <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
          </div>

          {imagePreview && (
            <div className="relative w-48 h-48 border rounded-md">
              <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" className="rounded-md" />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="milestoneAchieved" 
              checked={milestoneAchieved}
              onCheckedChange={(checked) => setMilestoneAchieved(checked as boolean)}
            />
            <Label htmlFor="milestoneAchieved" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Achieved a significant milestone today?
            </Label>
          </div>

          <Button type="submit" disabled={isLoading || !updateText.trim()} className="w-full md:w-auto">
            {isLoading ? "Submitting..." : "Submit Update"}
            {!isLoading && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
