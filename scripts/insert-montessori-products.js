const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Running Montessori products migration...');
    
    const migrationPath = path.join(__dirname, '../lib/migrations/insert-montessori-products.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await sql.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('Added 4 Montessori products to the database (IDs 1255-1258):');
    console.log('  - Stackable Tables (ID: 1255)');
    console.log('  - Tee Balance Board (ID: 1256)');
    console.log('  - Nuts & Bolts Board (ID: 1257)');
    console.log('  - Metal Inset (ID: 1258)');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

