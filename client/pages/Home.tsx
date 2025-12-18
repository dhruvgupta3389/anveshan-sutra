import { Link } from "react-router-dom";
import { Search, Zap, Target, ArrowRight, Clock, Users, CheckCircle, Heart, Rocket, Building } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Section 1: Hero with Matching Preview */}
      <section className="pt-16 pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline + CTA */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Find Organizations That Match Your Mission
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Discover aligned partners using intelligent matching — no more endless research.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-4">
                <Link
                  to="/search"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  Explore Matching Organizations
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/org-submit"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-all duration-300 font-bold text-lg"
                >
                  Set up your organization
                </Link>
              </div>

              {/* Helper text */}
              <p className="text-sm text-muted-foreground">
                Organizations submit once to receive relevant collaboration matches.
              </p>
            </div>


            {/* Right: Miniature Matching Preview */}
            <div className="flex flex-col items-center lg:items-end">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Sample matching result
              </p>
              <div className="w-full max-w-xs bg-muted rounded-2xl p-6 border border-border shadow-lg">
                {/* Organizations */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center mx-auto mb-2 border border-border">
                      <span className="text-primary font-bold">G</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">Green Earth Foundation</p>
                  </div>
                  <div className="text-muted-foreground">↔</div>
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center mx-auto mb-2 border border-border">
                      <span className="text-secondary font-bold">C</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">Climate Action Network</p>
                  </div>
                </div>
                {/* Alignment Score */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Alignment Score</p>
                  <span className="text-3xl font-bold text-foreground">82%</span>
                </div>
              </div>
              {/* Intelligence Cue */}
              <div className="flex items-center gap-2 mt-4">
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" />
                <p className="text-xs text-muted-foreground">
                  Matched using focus areas & mission alignment
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: Role-Based Sections - Who is Drivya.AI for? */}
      <section id="for-you" className="py-16 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Who is Drivya.AI for?
            </h2>
            <p className="text-muted-foreground text-lg">
              Identify your role and discover what you can do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* For NGOs - Green Theme */}
            <div
              id="for-ngos"
              className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                  For NGOs
                </h3>
              </div>

              <p className="text-foreground/80 mb-5 leading-relaxed">
                Find aligned partners, funding opportunities, and incubators without wasting weeks on outreach.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Discover relevant CSR and incubator partners</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>See why an organization aligns before contacting</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Submit your organization for visibility</span>
                </li>
              </ul>

              <Link
                to="/search"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Find Partners
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For Incubators - Blue Theme */}
            <div
              id="for-incubators"
              className="bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  For Incubators
                </h3>
              </div>

              <p className="text-foreground/80 mb-5 leading-relaxed">
                Identify NGOs and corporates that align with your focus areas, geography, and stage.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Find NGOs for pilots and programs</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Identify CSR partners for funding and scale</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Evaluate alignment before collaboration</span>
                </li>
              </ul>

              <Link
                to="/search"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Explore Matches
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For CSR Teams - Orange Theme */}
            <div
              id="for-csr"
              className="bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                  For CSR Teams
                </h3>
              </div>

              <p className="text-foreground/80 mb-5 leading-relaxed">
                Reduce CSR discovery risk by finding credible, aligned organizations with verified data.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Discover NGOs aligned with CSR themes</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Review impact data before outreach</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Shortlist partners faster</span>
                </li>
              </ul>

              <Link
                to="/search"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Discover Organizations
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Primary Feature Explanation */}


      <section className="py-16 px-4 sm:px-6 bg-secondary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Intelligent Organization Matching
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Drivya.AI helps you discover organizations that align with your mission using intelligent matching based on focus areas, region, and goals.
          </p>
        </div>
      </section>

      {/* Section 3: How It Works (3 steps only) */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                step: "1",
                title: "Explore Organizations",
                description: "Browse our curated network of verified NGOs and partners",
              },
              {
                icon: Zap,
                step: "2",
                title: "See Alignment Matches",
                description: "Get instant compatibility scores based on shared goals",
              },
              {
                icon: Users,
                step: "3",
                title: "Connect with Partners",
                description: "Reach out to organizations that align with your mission",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Why This Helps You (Short - 3 bullets) */}
      <section className="py-16 px-4 sm:px-6 bg-secondary/5">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
            Why This Helps
          </h2>
          <div className="space-y-4">
            {[
              { icon: Clock, text: "Saves hours of research time" },
              { icon: Target, text: "Reduces mismatched outreach" },
              { icon: CheckCircle, text: "Improves collaboration clarity" },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground font-medium">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Single CTA (End of page) */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Find Your Partners?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start exploring aligned organizations today.
          </p>
          <Link
            to="/search"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
          >
            Explore Matching Organizations
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
