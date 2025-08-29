
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center">
              <Shield className="mr-3 h-8 w-8 text-primary" /> Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Introduction</h2>
            <p>
              Geo 3D Hub ("Platform", "we", "us", or "our") is committed to 
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our Platform.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We may collect personal information that you provide directly to us, such as your name, 
              email address, company information, skills, project details, and payment information. 
              We may also collect information automatically when you use the Platform, such as your IP address, 
              browser type, and usage data. [Placeholder: Be more specific about data collected].
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, operate, and maintain the Platform.</li>
              <li>Improve, personalize, and expand the Platform.</li>
              <li>Understand and analyze how you use the Platform.</li>
              <li>Develop new products, services, features, and functionality.</li>
              <li>Communicate with you, either directly or through one of our partners.</li>
              <li>Process your transactions.</li>
              <li>Find and prevent fraud.</li>
              <li>[Placeholder: Add other uses]</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>
              We may share your information with third parties in the following situations: [Placeholder: Specify sharing practices, e.g., with contractors/clients for matching, service providers, legal requirements]. We do not sell your personal information.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no 
              electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2>6. Your Data Rights</h2>
            <p>
              Depending on your jurisdiction, you may have certain rights regarding your personal information, 
              such as the right to access, correct, or delete your data. [Placeholder: Detail user rights].
            </p>

            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We may use cookies and similar tracking technologies to track activity on our Platform and 
              store certain information. [Placeholder: Detail cookie usage].
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our Platform is not intended for use by children under the age of 13 (or other applicable age). 
              We do not knowingly collect personal information from children.
            </p>

            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at [Your Contact Email/Link].
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
