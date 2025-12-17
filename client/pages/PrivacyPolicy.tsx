import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: December 2024
        </p>

        <p className="text-foreground/80 leading-relaxed mb-8">
          Drivya.ai values your privacy. This Privacy Policy explains how we collect,
          use, and protect information shared on our platform.
        </p>

        <div className="space-y-8">
          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Information We Collect
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We may collect the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Organization details (name, focus areas, location, description)</li>
              <li>Contact details shared voluntarily</li>
              <li>Platform usage data (basic analytics)</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              We do not collect sensitive personal data unless explicitly provided.
            </p>
          </section>

          {/* 2. How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. How We Use Information
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Information is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Display organization profiles</li>
              <li>Enable discovery and collaboration between NGOs, Incubators, and CSR teams</li>
              <li>Improve platform functionality and user experience</li>
            </ul>
          </section>

          {/* 3. Data Visibility */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Data Visibility
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Information shared by users may be visible to other registered users
              for collaboration purposes.
            </p>
            <p className="text-foreground/80 leading-relaxed font-medium">
              Drivya.ai does not sell or rent user data to third parties.
            </p>
          </section>

          {/* 4. Data Accuracy */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Data Accuracy
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Users are responsible for the accuracy of the information they submit.
              Drivya.ai does not fully verify all submitted data.
            </p>
          </section>

          {/* 5. Data Protection */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Data Protection
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              We take reasonable measures to protect data stored on the platform.
              However, no digital platform can guarantee complete security.
            </p>
          </section>

          {/* 6. Data Removal */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Data Removal
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Users may request profile or data removal by contacting us.
              Requests will be reviewed and processed within a reasonable time.
            </p>
          </section>

          {/* 7. Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Policy Updates
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              This Privacy Policy may be updated as the platform evolves.
              Continued use of the platform indicates acceptance of the updated policy.
            </p>
          </section>

          {/* 8. Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Contact
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              For privacy-related concerns, contact us at our{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact page
              </a>.
            </p>
          </section>

          {/* Summary Box */}
          <section className="bg-muted/50 rounded-lg p-6 mt-8">
            <p className="text-foreground/80 leading-relaxed text-center">
              By using Drivya.ai, you acknowledge that you have read and understood
              this Privacy Policy.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
