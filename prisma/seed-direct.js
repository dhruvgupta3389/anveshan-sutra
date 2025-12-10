const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const { randomUUID } = require('crypto');
const dbPath = './dev.db';
console.log('📁 Database path:', dbPath);
console.log('📁 Database exists:', fs.existsSync(dbPath));

try {
  const db = new Database(dbPath);
  console.log('✓ Connected to database');
  
  // Pragma settings for safety
  db.pragma('journal_mode = WAL');
  
  // Check if tables exist
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('✓ Tables in database:', tables.map(t => t.name).join(', '));
  
  if (tables.length === 0) {
    console.log('❌ No tables found! Run `pnpm prisma db:push` first');
    process.exit(1);
  }
  
  // Check focus area count
  const focusCount = db.prepare('SELECT COUNT(*) as count FROM "FocusArea"').get();
  console.log('📊 Current FocusArea count:', focusCount.count);
  
  // Insert focus areas
  const insertFocus = db.prepare(`
    INSERT INTO "FocusArea" (id, name, icon, color, description, "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  
  const focusAreas = [
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
  
  console.log('📚 Inserting focus areas...');
  let insertedCount = 0;
  focusAreas.forEach(area => {
    const id = randomUUID(); insertFocus.run(id, area.name, area.icon, area.color, `Focus area: ${area.name}`);
    insertedCount++;
  });
  
  console.log(`✓ Inserted ${insertedCount} focus areas`);
  
  // Get inserted focus area IDs and insert organization
  const focusAreasFromDb = db.prepare('SELECT id, name FROM "FocusArea"').all();
  console.log('✓ Focus areas in DB:', focusAreasFromDb.length);
  
  // Insert sample NGO (provide id explicitly)
  const insertOrg = db.prepare(`
    INSERT INTO "Organization" ( 
      id, name, slug, type, description, website, "headquartersCity", "headquartersCountry",
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const orgId = randomUUID();
  insertOrg.run(
    orgId,
    'Pratham Education Foundation',
    'pratham-education-foundation',
    'NGO',
    'Provides quality education to disadvantaged children',
    'https://www.pratham.org',
    'Mumbai',
    'India'
  );

  console.log(`✓ Created NGO with ID: ${orgId}`);
  
  // Link focus areas to organization
  const insertOrgFocus = db.prepare(`
    INSERT INTO "OrganizationFocusArea" ( 
      id, "organizationId", "focusAreaId", "isPrimary", "yearsOfExperience",
      "createdAt", "updatedAt"
    ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  
  const focusNames = ['School Education', 'Digital Education', 'Teacher Training'];
  const linkedAreas = focusAreasFromDb.filter(f => focusNames.includes(f.name));
  
  console.log('🔗 Linking focus areas...');
  linkedAreas.forEach((area, idx) => {
    insertOrgFocus.run(randomUUID(), orgId, area.id, idx === 0 ? 1 : 0, Math.floor(Math.random() * 20) + 1);
  });
  
  console.log(`✓ Linked ${linkedAreas.length} focus areas`);
  
  // Final verification
  const finalCount = db.prepare('SELECT COUNT(*) as count FROM "FocusArea"').get();
  console.log('\n✨ Database seeding completed successfully!');
  console.log(`   Total FocusAreas: ${finalCount.count}`);
  console.log(`   Organizations: 1 (Pratham Education Foundation)`);
  
  db.close();
} catch (error) {
  console.error('❌ Seed error:', error.message);
  process.exit(1);
}
