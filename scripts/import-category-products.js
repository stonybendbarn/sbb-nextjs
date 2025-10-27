const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key.trim()] = value;
    }
  });
}

async function importCategoryProducts() {
  try {
    console.log('Starting category products import...');
    
    // First, add UUID default to id column
    console.log('\n1. Adding UUID default to id column...');
    const uuidPath = path.join(__dirname, '../lib/migrations/add-uuid-default.sql');
    const uuidSQL = fs.readFileSync(uuidPath, 'utf8');
    await sql.query(uuidSQL);
    console.log('   ✅ Added UUID default to id column');
    
    // Then, run the migration to add the inc_products_page column
    console.log('\n2. Adding inc_products_page column...');
    const migrationPath = path.join(__dirname, '../lib/migrations/add-inc-products-page-flag.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    await sql.query(migrationSQL);
    console.log('   ✅ Added inc_products_page column');
    
    // Then, insert the products
    console.log('\n3. Inserting category page products...');
    const insertPath = path.join(__dirname, '../lib/migrations/insert-category-page-products.sql');
    const insertSQL = fs.readFileSync(insertPath, 'utf8');
    
    // Split the SQL by semicolon and execute each statement
    const statements = insertSQL.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql.query(statement + ';');
        } catch (err) {
          // Skip duplicate key errors and continue
          if (err.message && err.message.includes('duplicate')) {
            console.log('   ⚠️  Skipping duplicate entry');
          } else {
            console.error('   ❌ Error with statement:', statement.substring(0, 50));
            throw err;
          }
        }
      }
    }
    
    console.log('   ✅ Products inserted successfully');
    
    // Get count of products
    const countResult = await sql`SELECT COUNT(*) as count FROM products WHERE inc_products_page = true`;
    console.log(`\n✅ Import complete! Total products with inc_products_page=true: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

importCategoryProducts();

