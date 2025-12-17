import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: December 2024
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Welcome to Drivya.ai
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Drivya.ai is a collaboration discovery platform designed to help NGOs,
              Incubators, and CSR teams find and connect with each other. By using
              this platform, you agree to the following terms.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What Drivya.ai Does
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We provide a platform that helps organizations discover potential
              collaboration partners. Our service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Displaying organization profiles submitted by users</li>
              <li>Providing search and filtering tools</li>
              <li>Suggesting potential alignment between organizations</li>
              <li>Facilitating initial discovery and outreach</li>
            </ul>
          </section>

          {/* What We Don't Do */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What Drivya.ai Does NOT Do
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To be clear about our role:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>We do <strong>not guarantee</strong> funding, partnerships, or any specific outcomes</li>
              <li>We do <strong>not fully verify</strong> all user-submitted information</li>
              <li>We do <strong>not mediate</strong> disputes between organizations</li>
              <li>We do <strong>not provide</strong> legal, financial, or professional advice</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Your Responsibilities
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              As a user of Drivya.ai, you are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>
                <strong>Data Accuracy:</strong> Ensuring that all information you submit
                about your organization is accurate, current, and complete
              </li>
              <li>
                <strong>Legal Compliance:</strong> Complying with all applicable laws
                and regulations in your jurisdiction
              </li>
              <li>
                <strong>Due Diligence:</strong> Conducting your own research and verification
                before entering into any collaboration or partnership
              </li>
              <li>
                <strong>Respectful Use:</strong> Using the platform ethically and not
                misrepresenting yourself or your organization
              </li>
              <li>
                <strong>Account Security:</strong> Keeping your login credentials secure
                and notifying us of any unauthorized access
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Limitation of Liability
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Drivya.ai is provided "as is" without warranties of any kind. We are
              not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Failed collaborations or partnerships</li>
              <li>Financial losses resulting from connections made through the platform</li>
              <li>Legal disputes between organizations</li>
              <li>Inaccurate information provided by other users</li>
              <li>Misuse of information by any party</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              You use this platform at your own discretion and risk. Always conduct
              independent verification before making any decisions.
            </p>
          </section>

          {/* Account Suspension */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Account Suspension & Removal
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We reserve the right to suspend, restrict, or terminate your account
              at our discretion if:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>You violate these terms</li>
              <li>You submit false or misleading information</li>
              <li>You engage in fraudulent or harmful activity</li>
              <li>Your actions negatively impact other users or the platform</li>
              <li>Required by law or regulation</li>
            </ul>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Data Usage
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              By using Drivya.ai:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>
                You grant us permission to display your organization's profile
                to other users of the platform
              </li>
              <li>
                You understand that your public profile information will be
                visible to other registered users
              </li>
              <li>
                We may use aggregated, anonymized data to improve our services
              </li>
              <li>
                We will not sell your personal information to third parties
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              For more details, please see our{" "}
              <a href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </a>.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Changes to These Terms
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              We may update these terms from time to time. Continued use of the
              platform after changes constitutes acceptance of the updated terms.
              We encourage you to review this page periodically.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              If you have questions about these terms, please contact us at{" "}
              <a href="/contact" className="text-primary hover:underline">
                our contact page
              </a>.
            </p>
          </section>

          {/* Agreement */}
          <section className="bg-muted/50 rounded-lg p-6 mt-8">
            <p className="text-foreground/80 leading-relaxed text-center">
              By creating an account or using Drivya.ai, you acknowledge that you
              have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
