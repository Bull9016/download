
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, ClipboardCheck, Target, Users, ShieldCheck, Briefcase } from "lucide-react";

export default function AboutUsPage() {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Verified Contractors",
      description: "Access a network of vetted, licensed, and insured construction professionals.",
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
      title: "Transparent Bidding",
      description: "Receive clear, competitive bids for your project, ensuring fair pricing and scope.",
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Seamless Project Management",
      description: "Track project progress, communicate with your team, and manage milestones all in one place.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Secure Payments",
      description: "Trust in a secure platform for all your project transactions and payments.",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background pt-20 pb-16 md:pt-32 md:pb-24 text-center">
        <div className="container mx-auto px-4">
           <div className="mb-6">
            <Globe className="mx-auto h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            About Geo 3D Hub
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Building the Future, Together. We bridge the gap between visionary clients and skilled construction professionals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="shadow-lg hover:shadow-primary/30 transition-shadow">
              <Link href="/matching">Find a Contractor <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-accent/30 transition-shadow">
              <Link href="/">Join as Contractor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              At Geo 3D Hub, our mission is to revolutionize how clients and construction contractors connect and collaborate. We aim to empower property owners and businesses by providing easy access to top-tier talent in all construction trades, fostering transparency and driving project success.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe in quality craftsmanship and strive to create an efficient and trustworthy ecosystem for project-based construction work.
            </p>
          </div>
           <div className="order-1 md:order-2">
            <Image
              src="https://placehold.co/700x500.png"
              alt="Construction team collaborating on a blueprint"
              width={700}
              height={500}
              className="rounded-xl shadow-2xl mx-auto"
              data-ai-hint="construction team blueprint"
            />
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-left shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-3" />
                <CardTitle className="font-headline text-xl text-foreground">Connect Talent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">We provide a platform for clients to discover and hire skilled contractors specializing in all areas of construction.</p>
              </CardContent>
            </Card>
            <Card className="text-left shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <CardHeader>
                <Briefcase className="h-10 w-10 text-primary mb-3" />
                <CardTitle className="font-headline text-xl text-foreground">Facilitate Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Our tools support seamless project management from bidding and hiring to tracking progress and payments.</p>
              </CardContent>
            </Card>
            <Card className="text-left shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <CardHeader>
                <ClipboardCheck className="h-10 w-10 text-primary mb-3" />
                <CardTitle className="font-headline text-xl text-foreground">Ensure Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">By verifying contractors and providing a transparent environment, we help bring your construction projects to life.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground mb-12">Why Choose Geo 3D Hub?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                {feature.icon}
                <h3 className="font-headline text-xl font-semibold text-foreground mt-4 mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Next Project?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Whether you're looking to hire top talent or find your next construction gig, Geo 3D Hub is your gateway to success.
          </p>
          <div className="flex flex-wrap justify-end gap-4">
            <Button size="lg" variant="secondary" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-all">
              <Link href="/">Enroll as a Client</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 shadow-lg hover:shadow-xl transition-all">
              <Link href="/">Join as a Contractor</Link>
            </Button>
             <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 shadow-lg hover:shadow-xl transition-all">
              <Link href="/projects">Explore Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
