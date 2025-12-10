const Database = require('better-sqlite3');
const db = new Database('./dev.db');
try {
  const fa = db.prepare('SELECT COUNT(*) as c FROM "FocusArea"').get();
  const org = db.prepare('SELECT COUNT(*) as c FROM "Organization"').get();
  const of = db.prepare('SELECT COUNT(*) as c FROM "OrganizationFocusArea"').get();
  console.log('FocusArea:', fa.c);
  console.log('Organization:', org.c);
  console.log('OrganizationFocusArea:', of.c);
} catch (e) {
  console.error('Error querying DB:', e.message);
  process.exit(1);
} finally {
  db.close();
}
