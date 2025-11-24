import { Link } from "react-router-dom";
import { Search, Plus, Heart, Clock, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-display-md mb-2 text-foreground">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Welcome back! Search for organizations, manage your favorites, and generate partnership materials.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by organization name, focus area, region, or funding type..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Total Searches</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Saved Organizations</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Generated Materials</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-secondary rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-heading-md mb-2 text-foreground">Start Your Search</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Use the search bar above to discover organizations, or create a new organization profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Start Searching
              </button>
              <Link
                to="/org-submit"
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Submit Organization
              </Link>
            </div>
          </div>

          {/* Sections Placeholder */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-accent" />
                <h3 className="text-heading-md text-foreground">Saved Organizations</h3>
              </div>
              <p className="text-muted-foreground mb-4">No saved organizations yet. Start searching to save your favorites!</p>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-heading-md text-foreground">Recent Activity</h3>
              </div>
              <p className="text-muted-foreground mb-4">Your recent searches and actions will appear here.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
