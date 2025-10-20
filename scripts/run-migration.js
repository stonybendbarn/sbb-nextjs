const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Running database migration...');
    
    const migrationPath = path.join(__dirname, '../lib/migrations/create-orders-table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await sql.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
