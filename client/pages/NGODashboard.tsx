import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchResult } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Heart,
  TrendingUp,
  Search,
  Edit3,
  FileText,
  Mail,
  Bookmark,
  Loader2,
  ExternalLink,
  Building2,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/lib/stores/userStore";

// Mock data for demo - replace with Supabase queries
const mockDraftPPTs = [
  { id: "ppt-1", title: "Partnership Proposal - ABC Foundation", createdAt: "2024-12-20", orgName: "ABC Foundation" },
  { id: "ppt-2", title: "Collaboration Overview - Green CSR", createdAt: "2024-12-19", orgName: "Green CSR" },
];

const mockDraftEmails = [
  { id: "email-1", subject: "Introduction & Partnership Request", recipient: "partnerships@abcfoundation.org", createdAt: "2024-12-20" },
];

export default function NGODashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { hasOrganization } = useUserStore();

  const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
  const [savedOrgs, setSavedOrgs] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("matches");

  // Stats
  const [stats, setStats] = useState({
    matchedOrgs: 0,
    savedOrgs: 0,
    draftPPTs: mockDraftPPTs.length,
    draftEmails: mockDraftEmails.length,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch recommendations
        const response = await fetch("/api/matches/recommendations?org_id=org-001&limit=8");
        const data = await response.json();
        const orgs = data.organizations || [];
        setRecommendations(orgs);

        // Mock saved orgs (would come from Supabase shortlist table)
        setSavedOrgs(orgs.slice(0, 3));

        setStats({
          matchedOrgs: orgs.length,
          savedOrgs: 3,
          draftPPTs: mockDraftPPTs.length,
          draftEmails: mockDraftEmails.length,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 md:p-8 border border-emerald-500/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
                </h1>
                <p className="text-muted-foreground">
                  Discover partners and manage your collaboration journey
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Link to="/search">
                    <Search className="w-4 h-4" />
                    Find Partners
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <Link to="/org-submit">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => setActiveTab("matches")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.matchedOrgs}</p>
                  <p className="text-xs text-muted-foreground">Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-rose-500/50 transition-colors" onClick={() => setActiveTab("saved")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-lg">
                  <Heart className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.savedOrgs}</p>
                  <p className="text-xs text-muted-foreground">Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setActiveTab("ppts")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.draftPPTs}</p>
                  <p className="text-xs text-muted-foreground">PPTs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-amber-500/50 transition-colors" onClick={() => setActiveTab("emails")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Mail className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.draftEmails}</p>
                  <p className="text-xs text-muted-foreground">Emails</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 gap-2">
            <TabsTrigger value="matches" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Matched</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="ppts" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">PPTs</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Emails</span>
            </TabsTrigger>
          </TabsList>

          {/* Matched Organizations Tab */}
          <TabsContent value="matches" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Matched Organizations</h2>
                <p className="text-sm text-muted-foreground">Partners aligned with your focus areas and geography</p>
              </div>
              <Button variant="outline" asChild size="sm">
                <Link to="/search">View All</Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : recommendations.length === 0 ? (
              <Card className="p-8 text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No matches yet</h3>
                <p className="text-muted-foreground mb-4">Complete your profile to see matched partners</p>
                <Button asChild>
                  <Link to="/org-submit">Complete Profile</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((org) => (
                  <OrgCard key={org.id} org={org} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Organizations Tab */}
          <TabsContent value="saved" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Saved Organizations</h2>
                <p className="text-sm text-muted-foreground">Organizations you've shortlisted for outreach</p>
              </div>
              <Button variant="outline" asChild size="sm">
                <Link to="/shortlist">Manage List</Link>
              </Button>
            </div>

            {savedOrgs.length === 0 ? (
              <Card className="p-8 text-center">
                <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No saved organizations</h3>
                <p className="text-muted-foreground mb-4">Save partners from matches to prepare outreach</p>
                <Button asChild variant="outline">
                  <Link to="/search">Find Partners</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {savedOrgs.map((org) => (
                  <OrgCard key={org.id} org={org} showNotes />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Draft PPTs Tab */}
          <TabsContent value="ppts" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Draft PPTs</h2>
                <p className="text-sm text-muted-foreground">Partnership proposals for internal decision-making</p>
              </div>
            </div>

            {mockDraftPPTs.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No PPT drafts</h3>
                <p className="text-muted-foreground mb-4">Generate PPTs from saved organizations</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {mockDraftPPTs.map((ppt) => (
                  <Card key={ppt.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{ppt.title}</p>
                          <p className="text-xs text-muted-foreground">
                            For {ppt.orgName} • Created {ppt.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/ppt/${ppt.id}`}>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/50 rounded">
                      📋 This PPT is for internal decision-making and board discussion.
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Draft Emails Tab */}
          <TabsContent value="emails" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Draft Emails</h2>
                <p className="text-sm text-muted-foreground">Outreach emails ready to send</p>
              </div>
            </div>

            {mockDraftEmails.length === 0 ? (
              <Card className="p-8 text-center">
                <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No email drafts</h3>
                <p className="text-muted-foreground mb-4">Draft outreach emails from organization profiles</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {mockDraftEmails.map((email) => (
                  <Card key={email.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Mail className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{email.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            To: {email.recipient} • Created {email.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">
                          Copy
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/50 rounded">
                      ⚠️ Email is draft only. Review before sending via your email client.
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

// Organization Card Component
function OrgCard({ org, showNotes = false }: { org: SearchResult; showNotes?: boolean }) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-foreground">{org.name}</h3>
              <Badge variant="outline" className="text-xs">{org.type}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{org.region}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">{org.alignmentScore}%</div>
            <p className="text-xs text-muted-foreground">Match</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{org.mission}</p>

        {/* Why this matches */}
        <div className="mb-3 p-2 bg-muted/50 rounded text-xs">
          <p className="font-medium text-foreground mb-1">Why this matches:</p>
          <ul className="text-muted-foreground space-y-1">
            {org.focusAreas.slice(0, 2).map((area) => (
              <li key={area}>• Aligned on {area}</li>
            ))}
            <li>• Active in {org.region}</li>
          </ul>
        </div>

        {showNotes && (
          <div className="mb-3 p-2 bg-amber-500/10 rounded text-xs border border-amber-500/20">
            <p className="font-medium text-amber-800 dark:text-amber-200">📝 Your notes:</p>
            <p className="text-amber-700 dark:text-amber-300 italic">
              "Good fit for our education initiative in rural areas"
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link to={`/organization/${org.id}`}>
              View Profile <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
