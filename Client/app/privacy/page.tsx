import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="font-bold text-xl">ContentFlow</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to ContentFlow. We respect your privacy and are committed to protecting your
              personal data. This privacy policy will inform you about how we look after your
              personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Data We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of personal data about you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Identity Data: name, username, or similar identifier</li>
              <li>Contact Data: email address, telephone numbers</li>
              <li>Technical Data: IP address, browser type and version, time zone setting</li>
              <li>Usage Data: information about how you use our website and services</li>
              <li>Marketing Data: your preferences in receiving marketing from us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Data</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use your data to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide and maintain our service</li>
              <li>Notify you about changes to our service</li>
              <li>Provide customer support</li>
              <li>Monitor the usage of our service</li>
              <li>Detect, prevent and address technical issues</li>
              <li>Provide you with news and offers (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from
              being accidentally lost, used or accessed in an unauthorized way, altered or
              disclosed. We limit access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We will only retain your personal data for as long as necessary to fulfil the purposes
              we collected it for, including for the purposes of satisfying any legal, accounting,
              or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Legal Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to
              your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track the activity on our service
              and store certain information. You can instruct your browser to refuse all cookies or
              to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Email: privacy@contentflow.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
