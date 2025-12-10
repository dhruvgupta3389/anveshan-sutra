/**
 * Sync organizations from server/data/organizations.ts to client/data/organizations.json
 * 
 * Run manually with: npx tsx server/scripts/sync-organizations.ts
 * Or add to package.json: "sync:orgs": "tsx server/scripts/sync-organizations.ts"
 */

import fs from "fs";
import path from "path";
import { mockOrganizations } from "../data/organizations";
import { SearchResult } from "@shared/api";

// Transform Organization to SearchResult format (adding alignmentScore)
function transformToSearchResult(org: typeof mockOrganizations[0]): SearchResult {
    return {
        id: org.id,
        name: org.name,
        type: org.type,
        website: org.website,
        headquarters: org.headquarters,
        region: org.region,
        focusAreas: org.focusAreas,
        mission: org.mission,
        description: org.description,
        verificationStatus: org.verificationStatus,
        projects: org.projects,
        fundingType: org.fundingType,
        targetBeneficiaries: org.targetBeneficiaries,
        partnerHistory: org.partnerHistory,
        confidence: org.confidence,
        // Use confidence as alignmentScore, or provide a default
        alignmentScore: org.confidence || 75,
    };
}

function syncOrganizations() {
    const outputPath = path.join(process.cwd(), "client", "data", "organizations.json");

    // Transform all organizations
    const searchResults = mockOrganizations.map(transformToSearchResult);

    // Write to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(searchResults, null, 2), "utf8");

    console.log(`✅ Synced ${searchResults.length} organizations to ${outputPath}`);
}

syncOrganizations();
