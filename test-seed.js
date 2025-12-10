require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

console.log('DATABASE_URL:', process.env.DATABASE_URL);

try {
  const db = new Database('./dev.db');
  console.log('✓ Database connection opened');
  
  const adapter = new PrismaBetterSqlite3(db);
  console.log('✓ Adapter created');
  
  const prisma = new PrismaClient({ adapter, log: [] });
  console.log('✓ Prisma client created');
  
  (async () => {
    try {
      const count = await prisma.focusArea.count();
      console.log(`✓ Focus areas count: ${count}`);
      await prisma.$disconnect();
      console.log('✓ Disconnected');
    } catch (e) {
      console.error('Error:', e.message);
      process.exit(1);
    }
  })();
} catch (e) {
  console.error('Setup error:', e.message);
  process.exit(1);
}
