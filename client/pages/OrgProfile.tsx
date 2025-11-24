import { Link } from "react-router-dom";
import { ArrowLeft, Download, Share2, FileText, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrgProfile() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          {/* Organization Header */}
          <div className="bg-card rounded-xl border border-border p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-display-md text-foreground">Organization Name</h1>
                  <div className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </div>
                </div>
                <p className="text-muted-foreground">NGO · India · Education</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Generate PPT
                </button>
                <button className="px-6 py-3 border-2 border-border hover:bg-secondary rounded-lg transition-colors font-semibold">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Alignment Score Ring */}
          <div className="bg-card rounded-xl border border-border p-8 mb-8">
            <h2 className="text-heading-md mb-6 text-foreground">Alignment Score</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="55"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="55"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeDasharray="180 360"
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">75</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  This organization has a high alignment with your mission and focus areas. 
                  Key matches include education focus, active in similar regions, and compatible funding model.
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Focus Area Match</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: "90%" }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Geographic Match</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Verification Status</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent rounded-full h-2" style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="text-heading-md mb-4 text-foreground">Mission Statement</h3>
              <p className="text-muted-foreground mb-4">
                Organization description and mission would appear here based on verified profile data.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="text-heading-md mb-4 text-foreground">Key Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold text-foreground">NGO</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Headquarters</p>
                  <p className="font-semibold text-foreground">Country Name</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Focus Areas</p>
                  <p className="font-semibold text-foreground">Education, Livelihood</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-heading-md text-foreground">Summary</h3>
              </div>
              <p className="text-muted-foreground">
                An AI-generated summary of this organization would appear here, including mission, programs, 
                regions, and why they match your profile. All summaries include source links and confidence scores.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="text-heading-md mb-4 text-foreground">Programs & Projects</h3>
              <p className="text-muted-foreground">
                List of key programs and recent projects would be displayed here with descriptions and impact metrics.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="text-heading-md mb-4 text-foreground">Partnership History</h3>
              <p className="text-muted-foreground">
                Information about past and current partnerships would appear here, helping you understand their collaboration patterns.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 text-center">
            <h3 className="text-heading-md mb-2 text-foreground">Ready to Connect?</h3>
            <p className="text-muted-foreground mb-6">
              Generate a personalized proposal or email draft to start the conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Generate Email Draft
              </button>
              <button className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold">
                Generate Proposal
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
