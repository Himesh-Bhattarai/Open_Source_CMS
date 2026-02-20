import Link from "next/link";
import { ArrowLeft, Briefcase, Mail, Rocket, Wrench, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const openRoles = [
  {
    title: "Frontend Engineer",
    location: "Remote",
    type: "Full-time",
    team: "CMS Experience",
    summary: "Build editor workflows, live previews, and consistent UI systems across the dashboard.",
  },
  {
    title: "Backend Engineer",
    location: "Remote",
    type: "Full-time",
    team: "Platform APIs",
    summary: "Design secure APIs, tenant isolation logic, and scalable data models for CMS modules.",
  },
  {
    title: "Product Designer",
    location: "Hybrid",
    type: "Contract",
    team: "Design Systems",
    summary: "Create clear content management experiences and reusable, production-ready interface patterns.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Careers at ContentFlow</h1>
            <p className="text-muted-foreground mt-2">
              We build practical CMS infrastructure for multi-tenant teams shipping real products.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back Home
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Why Join
            </CardTitle>
            <CardDescription>
              Work on architecture, UX, and developer tooling that powers publishing operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-md border p-3">
              <p className="font-medium flex items-center gap-2"><Wrench className="h-4 w-4" /> Production Focus</p>
              <p className="text-muted-foreground mt-1">We ship secure, maintainable features, not demos.</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium flex items-center gap-2"><Users className="h-4 w-4" /> Small, Senior Team</p>
              <p className="text-muted-foreground mt-1">You collaborate directly on product and system decisions.</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Real Ownership</p>
              <p className="text-muted-foreground mt-1">You own modules end-to-end, from design to operations.</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {openRoles.map((role) => (
            <Card key={role.title}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="h-4 w-4" />
                    {role.title}
                  </CardTitle>
                  <Badge variant="outline">{role.team}</Badge>
                  <Badge variant="outline">{role.location}</Badge>
                  <Badge variant="outline">{role.type}</Badge>
                </div>
                <CardDescription className="pt-2">{role.summary}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Process</CardTitle>
            <CardDescription>Simple and technical: we evaluate practical capability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Intro screen and role alignment.</p>
            <p>2. Technical discussion based on real code and architecture tradeoffs.</p>
            <p>3. Final conversation on ownership and roadmap fit.</p>
            <p className="pt-2 text-foreground font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Apply at: careers@contentflow.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
