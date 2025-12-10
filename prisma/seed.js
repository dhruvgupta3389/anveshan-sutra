// DRIVYA.AI - Database Seed Script (Node.js + better-sqlite3)
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

// Set DATABASE_URL for Prisma if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const db = new Database('./dev.db');
const adapter = new PrismaBetterSqlite3(db);
const prisma = new PrismaClient({ 
  adapter,
  // Suppress logs during seed
  log: [],
});

const DRIVYA_FOCUS_AREAS = [
  { name: 'Education & STEM', icon: 'BookOpen', color: '#3B82F6' },
  { name: 'School Education', icon: 'School', color: '#3B82F6' },
  { name: 'Digital Education', icon: 'Monitor', color: '#3B82F6' },
  { name: 'STEM / Robotics', icon: 'Cpu', color: '#3B82F6' },
  { name: 'Scholarships', icon: 'GraduationCap', color: '#3B82F6' },
  { name: 'Teacher Training', icon: 'Users', color: '#3B82F6' },
  { name: 'Adult Literacy', icon: 'Book', color: '#3B82F6' },
  { name: 'Skill Development & Livelihood', icon: 'Briefcase', color: '#8B5CF6' },
  { name: 'Vocational Training', icon: 'Wrench', color: '#8B5CF6' },
  { name: 'Entrepreneurship Support', icon: 'Rocket', color: '#8B5CF6' },
];

const SAMPLE_NGOS = [
  {
    name: 'Pratham Education Foundation',
    website: 'https://www.pratham.org',
    description: 'Provides quality education to disadvantaged children',
    city: 'Mumbai',
    focusAreas: ['School Education', 'Digital Education', 'Teacher Training'],
  },
];

async function main() {
  try {
    console.log('🌱 Starting database seed...');
    
    console.log('🧹 Clearing existing data...');
    await prisma.organizationFocusArea.deleteMany();
    await prisma.focusArea.deleteMany();
    await prisma.organization.deleteMany();

    console.log('📚 Seeding focus areas...');
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

    console.log('🏢 Seeding sample NGOs...');
    for (const ngo of SAMPLE_NGOS) {
      const org = await prisma.organization.create({
        data: {
          name: ngo.name,
          slug: ngo.name.toLowerCase().replace(/\s+/g, '-'),
          website: ngo.website,
          description: ngo.description,
          type: 'NGO',
          headquartersCity: ngo.city,
          headquartersCountry: 'India',
        },
      });

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

    console.log('✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});