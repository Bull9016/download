
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function PublicPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center">
              <FileText className="mr-3 h-8 w-8 text-primary" /> Public Page Title
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-6">
              This is a starter template for a public-facing page like "About Us", "Contact", etc.
            </p>
            <p className="mb-4">
              It uses the `PublicLayout`, which includes a public header and footer, separate from the main application layout that has a sidebar. This is ideal for informational pages that should be accessible to users who are not logged in.
            </p>
            <p>
              You can start building out your content here using standard HTML and React components, as well as the custom components provided in this project.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Dashboard (if logged in)</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
