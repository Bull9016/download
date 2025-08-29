
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center">
              <FileText className="mr-3 h-8 w-8 text-primary" /> Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to Geo 3D Hub ("Platform", "we", "us", or "our"). 
              By accessing or using our Platform, you agree to be bound by these Terms of Service ("Terms") 
              and our Privacy Policy. If you do not agree to these Terms, please do not use the Platform.
            </p>

            <h2>2. Platform Services</h2>
            <p>
              Geo 3D Hub provides a platform to connect clients with contractors for projects primarily 
              related to construction, renovation, and other building trades. We facilitate 
              smart matching, communication, project tracking, and work allocation.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To use certain features of the Platform, you may be required to create an account. 
              You are responsible for maintaining the confidentiality of your account information 
              and for all activities that occur under your account. You agree to notify us immediately 
              of any unauthorized use of your account.
            </p>

            <h2>4. User Conduct</h2>
            <p>
              You agree not to use the Platform for any unlawful purpose or in any way that could 
              harm the Platform, its users, or third parties. Prohibited activities include, but are 
              not limited to: [Placeholder for specific prohibited activities].
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content and materials available on the Platform, including but not limited to text, 
              graphics, website name, code, images, and logos are the intellectual property of 
              Geo 3D Hub or its licensors and are protected by applicable copyright and trademark law.
            </p>

            <h2>6. Disclaimers and Limitation of Liability</h2>
            <p>
              The Platform is provided on an "as is" and "as available" basis. We make no warranties, 
              expressed or implied, regarding the operation of the Platform or the information, content, 
              materials, or products included on the Platform. [Placeholder for further disclaimers].
            </p>

            <h2>7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the Platform, without prior 
              notice or liability, for any reason, including if you breach these Terms.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], 
              without regard to its conflict of law provisions.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              We will provide notice of any changes by posting the new Terms on the Platform.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at [Your Contact Email/Link].
            </p>
            
            <p className="mt-8 text-sm text-muted-foreground">
              This is a template and should be reviewed and customized by a legal professional.
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
