import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using ContentFlow, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to these Terms of Service, please do
              not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Permission is granted to use ContentFlow for commercial and personal purposes under
              the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You must not misuse or abuse the service</li>
              <li>You must not attempt to gain unauthorized access to any part of the service</li>
              <li>You must not use the service for any illegal purposes</li>
              <li>You must not violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you create an account with us, you must provide accurate, complete, and current
              information. Failure to do so constitutes a breach of the Terms. You are responsible
              for safeguarding the password and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Content</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our service allows you to create, upload, and manage content. You retain ownership of
              any intellectual property rights that you hold in that content. By uploading content,
              you grant us a license to use, modify, and display that content for the purpose of
              operating and providing the service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for the content you create and must ensure it does not violate any
              laws or infringe on the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Prohibited Uses</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may not use ContentFlow:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>In any way that violates any applicable laws or regulations</li>
              <li>
                To transmit, or procure the sending of, any unsolicited or unauthorized advertising
              </li>
              <li>To impersonate or attempt to impersonate the company or another user</li>
              <li>
                To engage in any conduct that restricts or inhibits anyone's use of the service
              </li>
              <li>To interfere with or circumvent the security features of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Subscription and Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some parts of the service are billed on a subscription basis. You will be billed in
              advance on a recurring and periodic basis. Billing cycles are set on a monthly or
              annual basis, depending on the type of subscription plan you select.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation if you breach the
              Terms. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall ContentFlow, nor its directors, employees, partners, agents,
              suppliers, or affiliates, be liable for any indirect, incidental, special,
              consequential or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is
              material, we will try to provide at least 30 days' notice prior to any new terms
              taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Email: legal@contentflow.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
