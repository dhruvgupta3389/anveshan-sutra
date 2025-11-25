import { RequestHandler } from "express";
import { SearchParams, SearchResponse, SearchResult, Organization } from "@shared/api";
import { mockOrganizations } from "../data/organizations";
import { supabase } from "../lib/supabase";

function calculateAlignmentScore(
  org: Organization,
  params: SearchParams,
): number {
  let score = 50; // Base score

  // Focus area match
  if (params.focusArea) {
    const areaMatch = org.focusAreas.some(
      (area) => area.toLowerCase() === params.focusArea?.toLowerCase(),
    );
    if (areaMatch) score += 20;
  }

  // Region match
  if (params.region) {
    const regionMatch = org.region
      .toLowerCase()
      .includes(params.region.toLowerCase());
    if (regionMatch) score += 15;
  }

  // Funding type match
  if (params.fundingType) {
    if (org.fundingType === params.fundingType) score += 10;
  }

  // Verification boost
  if (org.verificationStatus === "verified") score += 5;

  // Confidence boost
  score = score * (org.confidence / 100);

  return Math.min(100, Math.max(0, Math.round(score)));
}

function filterOrganizations(
  orgs: Organization[],
  params: SearchParams,
): Organization[] {
  return orgs.filter((org) => {
    // Query filter (name, mission, description)
    if (params.query) {
      const query = params.query.toLowerCase();
      const matchesQuery =
        org.name.toLowerCase().includes(query) ||
        org.mission.toLowerCase().includes(query) ||
        org.description.toLowerCase().includes(query) ||
        org.focusAreas.some((area) => area.toLowerCase().includes(query));

      if (!matchesQuery) return false;
    }

    // Focus area filter
    if (params.focusArea) {
      const hasArea = org.focusAreas.some(
        (area) => area.toLowerCase() === params.focusArea?.toLowerCase(),
      );
      if (!hasArea) return false;
    }

    // Region filter
    if (params.region) {
      const regionMatch = org.region
        .toLowerCase()
        .includes(params.region.toLowerCase());
      if (!regionMatch) return false;
    }

    // Funding type filter
    if (params.fundingType) {
      if (org.fundingType !== params.fundingType) return false;
    }

    // Verification status filter
    if (params.verificationStatus) {
      if (org.verificationStatus !== params.verificationStatus) return false;
    }

    return true;
  });
}

export const handleSearch: RequestHandler = async (req, res) => {
  try {
    const params: SearchParams = {
      query: (req.query.query as string) || "",
      focusArea: (req.query.focusArea as string) || "",
      region: (req.query.region as string) || "",
      fundingType: (req.query.fundingType as string) || "",
      verificationStatus: (req.query.verificationStatus as string) || "",
      sortBy:
        (req.query.sortBy as "alignment" | "recency" | "confidence" | "name") ||
        "alignment",
    };

    let allOrganizations: Organization[] = [...mockOrganizations];

    // Try to fetch from Supabase and merge with mock data
    if (supabase) {
      try {
        const { data: supabaseOrgs, error } = await supabase
          .from("organizations")
          .select("*");

        if (!error && supabaseOrgs) {
          allOrganizations = [...mockOrganizations, ...supabaseOrgs];
        }
      } catch (err) {
        console.warn("Failed to fetch from Supabase, using mock data:", err);
      }
    }

    // Filter organizations
    const results = filterOrganizations(allOrganizations, params);

    // Map to search results with alignment scores
    const searchResults: SearchResult[] = results.map((org) => ({
      ...org,
      alignmentScore: calculateAlignmentScore(org, params),
    }));

    // Sort results
    switch (params.sortBy) {
      case "alignment":
        searchResults.sort((a, b) => b.alignmentScore - a.alignmentScore);
        break;
      case "confidence":
        searchResults.sort((a, b) => b.confidence - a.confidence);
        break;
      case "name":
        searchResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recency":
      default:
        // Keep original order
        break;
    }

    const response: SearchResponse = {
      organizations: searchResults,
      total: searchResults.length,
    };

    res.json(response);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search organizations" });
  }
};

export const handleGetOrganization: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    let org = mockOrganizations.find((o) => o.id === id);

    // Try to fetch from Supabase if not found in mock data
    if (!org && supabase) {
      try {
        const { data, error } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          org = data;
        }
      } catch (err) {
        console.warn("Failed to fetch from Supabase:", err);
      }
    }

    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Calculate alignment score with empty params (baseline)
    const alignmentScore = calculateAlignmentScore(org, {});

    const result: SearchResult = {
      ...org,
      alignmentScore,
    };

    res.json(result);
  } catch (error) {
    console.error("Get organization error:", error);
    res.status(500).json({ error: "Failed to fetch organization" });
  }
};
