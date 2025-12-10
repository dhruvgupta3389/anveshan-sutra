/**
 * DRIVYA.AI - Database Seed Script
 * Seeds focus areas and sample organizations
 * Run with: npx ts-node prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

const db = new Database("./dev.db");
const adapter = require("@prisma/adapter-better-sqlite3").PrismaBetterSqlite3;

const prisma = new PrismaClient({
  adapter: new adapter(db),
});

const DRIVYA_FOCUS_AREAS = [
  { name: "Education & STEM", icon: "BookOpen", color: "#3B82F6" },
  { name: "School Education", icon: "School", color: "#3B82F6" },
  { name: "Digital Education", icon: "Monitor", color: "#3B82F6" },
  { name: "STEM / Robotics", icon: "Cpu", color: "#3B82F6" },
  { name: "Scholarships", icon: "GraduationCap", color: "#3B82F6" },
  { name: "Teacher Training", icon: "Users", color: "#3B82F6" },
  { name: "Adult Literacy", icon: "Book", color: "#3B82F6" },
  
  { name: "Skill Development & Livelihood", icon: "Briefcase", color: "#8B5CF6" },
  { name: "Vocational Training", icon: "Wrench", color: "#8B5CF6" },
  { name: "Entrepreneurship Support", icon: "Rocket", color: "#8B5CF6" },
  { name: "Self-Employment", icon: "Users", color: "#8B5CF6" },
  { name: "Rural Livelihood", icon: "TreePine", color: "#8B5CF6" },
  { name: "Urban Livelihood", icon: "Building", color: "#8B5CF6" },
  
  { name: "Health & Nutrition", icon: "Heart", color: "#EF4444" },
  { name: "Preventive Healthcare", icon: "Shield", color: "#EF4444" },
  { name: "Maternal & Child Health", icon: "Baby", color: "#EF4444" },
  { name: "Sanitation & Hygiene", icon: "Droplet", color: "#EF4444" },
  { name: "Nutrition Programs", icon: "Apple", color: "#EF4444" },
  { name: "Medical Camps", icon: "Stethoscope", color: "#EF4444" },
  
  { name: "Women Empowerment", icon: "Users", color: "#EC4899" },
  { name: "Women Skilling", icon: "Briefcase", color: "#EC4899" },
  { name: "Women Safety & Rights", icon: "Shield", color: "#EC4899" },
  { name: "Financial Inclusion (Women)", icon: "DollarSign", color: "#EC4899" },
  { name: "Leadership Development (Women)", icon: "Crown", color: "#EC4899" },
  
  { name: "Environment & Sustainability", icon: "Leaf", color: "#10B981" },
  { name: "Waste Management", icon: "Trash", color: "#10B981" },
  { name: "Water Conservation", icon: "Droplet", color: "#10B981" },
  { name: "Renewable Energy", icon: "Zap", color: "#10B981" },
  { name: "Energy Efficiency", icon: "Lightbulb", color: "#10B981" },
  { name: "Climate Action", icon: "Cloud", color: "#10B981" },
  { name: "Urban Green Spaces", icon: "Trees", color: "#10B981" },
  
  { name: "Agriculture & Rural Development", icon: "TreePine", color: "#92400E" },
  { name: "Farmer Training", icon: "Users", color: "#92400E" },
  { name: "Agri-Tech", icon: "Cpu", color: "#92400E" },
  { name: "Supply Chain Improvement", icon: "TrendingUp", color: "#92400E" },
  { name: "Irrigation Support", icon: "Droplet", color: "#92400E" },
  { name: "Animal Husbandry", icon: "Bird", color: "#92400E" },
  
  { name: "Community Development", icon: "Users", color: "#6366F1" },
  { name: "Village Development", icon: "Home", color: "#6366F1" },
  { name: "Infrastructure Support", icon: "Building", color: "#6366F1" },
  { name: "Slum Development", icon: "Building", color: "#6366F1" },
  { name: "Migrant Support", icon: "Users", color: "#6366F1" },
  { name: "Disaster Relief", icon: "AlertTriangle", color: "#6366F1" },
  { name: "Public Utilities", icon: "Zap", color: "#6366F1" },
  
  { name: "Innovation, Research & Technology", icon: "Cpu", color: "#06B6D4" },
  { name: "Innovation Labs", icon: "Lightbulb", color: "#06B6D4" },
  { name: "Incubation Support", icon: "Rocket", color: "#06B6D4" },
  { name: "R&D Projects", icon: "Flask", color: "#06B6D4" },
  { name: "Social Innovation", icon: "Lightbulb", color: "#06B6D4" },
  { name: "Startup & Entrepreneurship Programs", icon: "Rocket", color: "#06B6D4" },
  { name: "Digital Transformation", icon: "Monitor", color: "#06B6D4" },
  
  { name: "Differently-Abled Support", icon: "Users", color: "#F97316" },
  { name: "Assistive Devices", icon: "Accessibility", color: "#F97316" },
  { name: "Special Education", icon: "School", color: "#F97316" },
  { name: "Accessibility Initiatives", icon: "Accessibility", color: "#F97316" },
  
  { name: "Youth Development & Sports", icon: "Trophy", color: "#0EA5E9" },
  { name: "Sports Training", icon: "Trophy", color: "#0EA5E9" },
  { name: "Sports Infrastructure", icon: "Building", color: "#0EA5E9" },
  { name: "Youth Leadership Programs", icon: "Crown", color: "#0EA5E9" },
  { name: "Volunteering Programs", icon: "Heart", color: "#0EA5E9" },
  
  { name: "Arts, Culture & Heritage", icon: "Palette", color: "#F59E0B" },
  { name: "Cultural Preservation", icon: "Book", color: "#F59E0B" },
  { name: "Museums & Heritage", icon: "Building", color: "#F59E0B" },
  { name: "Cultural Programs", icon: "Music", color: "#F59E0B" },
  
  { name: "Governance, Policy & Civic Engagement", icon: "Building", color: "#6B7280" },
  { name: "Good Governance", icon: "Shield", color: "#6B7280" },
  { name: "Digital Governance", icon: "Monitor", color: "#6B7280" },
  { name: "Transparency Initiatives", icon: "Eye", color: "#6B7280" },
  { name: "Citizen Engagement Platforms", icon: "Users", color: "#6B7280" },
  { name: "RTI Awareness", icon: "AlertCircle", color: "#6B7280" },
];

const SAMPLE_NGOS: Array<{
  name: string;
  website: string;
  description: string;
  city: string;
  focusAreas: string[];
}> = [
  {
    name: "Pratham Education Foundation",
    website: "https://www.pratham.org",
    description: "Provides quality education to disadvantaged children",
    city: "Mumbai",
    focusAreas: ["School Education", "Digital Education", "Teacher Training"],
  },
  {
    name: "Teach For India",
    website: "https://www.teachforindia.org",
    description: "Building a movement of young changemakers in education",
    city: "Mumbai",
    focusAreas: ["School Education", "Teacher Training", "Youth Development & Sports"],
  },
  {
    name: "Give India",
    website: "https://www.giveindia.org",
    description: "India's largest online fundraising platform for nonprofits",
    city: "Mumbai",
    focusAreas: ["Education & STEM", "Health & Nutrition", "Community Development"],
  },
  {
    name: "Akshaya Patra Foundation",
    website: "https://www.akshayapatra.org",
    description: "World's largest mid-day meal program provider",
    city: "Bangalore",
    focusAreas: ["Nutrition Programs", "School Education", "Health & Nutrition"],
  },
  {
    name: "Barefoot College",
    website: "https://www.barefootcollege.org",
    description: "Training rural communities in solar energy and sustainable living",
    city: "Tilonia",
    focusAreas: ["Renewable Energy", "Rural Livelihood", "Education & STEM"],
  },
];

const SAMPLE_CSRS: Array<{
  name: string;
  website: string;
  description: string;
  city: string;
  focusAreas: string[];
}> = [
  {
    name: "Infosys Foundation",
    website: "https://www.infosys.org",
    description: "Focuses on education, rural development, and social outreach",
    city: "Bangalore",
    focusAreas: ["Education & STEM", "Rural Development", "Community Development"],
  },
  {
    name: "TCS Foundation",
    website: "https://www.tcs.com/about/foundation",
    description: "Creating inclusive communities by fostering social development",
    city: "Mumbai",
    focusAreas: ["Education & STEM", "Health & Nutrition", "Skill Development & Livelihood"],
  },
  {
    name: "Microsoft TEALS",
    website: "https://www.microsoft.com/teals",
    description: "Supporting tech education in underserved communities",
    city: "Bangalore",
    focusAreas: ["Digital Education", "STEM / Robotics", "Youth Development & Sports"],
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.organizationFocusArea.deleteMany({});
    await prisma.focusArea.deleteMany({});
    await prisma.organization.deleteMany({});

    // Seed Focus Areas
    console.log("📚 Seeding focus areas...");
    for (const area of DRIVYA_FOCUS_AREAS) {
      await prisma.focusArea.create({
        data: {
          name: area.name,
          icon: area.icon,
          color: area.color,
          description: `Focus area: ${area.name}`,
        },
      });
    }
    console.log(`✅ Seeded ${DRIVYA_FOCUS_AREAS.length} focus areas`);

    // Seed Sample NGOs
    console.log("🏢 Seeding sample NGOs...");
    for (const ngo of SAMPLE_NGOS) {
      const org = await prisma.organization.create({
        data: {
          name: ngo.name,
          slug: ngo.name.toLowerCase().replace(/\s+/g, "-"),
          website: ngo.website,
          description: ngo.description,
          type: "NGO" as OrganizationType,
          headquartersCity: ngo.city,
          headquartersCountry: "India",
        },
      });

      // Add focus areas
      const focusAreas = await prisma.focusArea.findMany({
        where: { name: { in: ngo.focusAreas } },
      });

      for (let i = 0; i < focusAreas.length; i++) {
        await prisma.organizationFocusArea.create({
          data: {
            organizationId: org.id,
            focusAreaId: focusAreas[i].id,
            isPrimary: i === 0,
            yearsOfExperience: Math.floor(Math.random() * 20) + 1,
          },
        });
      }

      console.log(`  ✓ Created NGO: ${ngo.name}`);
    }

    // Seed Sample CSRs
    console.log("🏭 Seeding sample CSR organizations...");
    for (const csr of SAMPLE_CSRS) {
      const org = await prisma.organization.create({
        data: {
          name: csr.name,
          slug: csr.name.toLowerCase().replace(/\s+/g, "-"),
          website: csr.website,
          description: csr.description,
          type: "CSR" as OrganizationType,
          headquartersCity: csr.city,
          headquartersCountry: "India",
        },
      });

      // Add focus areas
      const focusAreas = await prisma.focusArea.findMany({
        where: { name: { in: csr.focusAreas } },
      });

      for (let i = 0; i < focusAreas.length; i++) {
        await prisma.organizationFocusArea.create({
          data: {
            organizationId: org.id,
            focusAreaId: focusAreas[i].id,
            isPrimary: i === 0,
            yearsOfExperience: Math.floor(Math.random() * 25) + 5,
          },
        });
      }

      console.log(`  ✓ Created CSR: ${csr.name}`);
    }

    console.log("✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
