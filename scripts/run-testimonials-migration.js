// scripts/run-testimonials-migration.js
// Run the testimonials table migration

const fs = require('fs');
const path = require('path');
const { sql } = require('@vercel/postgres');

async function runMigration() {
  try {
    console.log('🚀 Running testimonials migration...');
    
    const migrationPath = path.join(__dirname, '..', 'lib', 'migrations', 'create-testimonials-table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await sql.query(migrationSQL);
    
    console.log('✅ Testimonials table created successfully!');
    console.log('📝 You can now use the admin panel at /admin/testimonials to manage testimonials');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();


