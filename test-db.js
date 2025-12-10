console.log('Starting test...');

setTimeout(() => {
  console.log('Timeout reached, exiting');
  process.exit(0);
}, 5000);

const Database = require('better-sqlite3');
console.log('About to open database...');

const db = new Database('./dev.db');
console.log('Database opened!');

process.exit(0);
