#!/usr/bin/env node

/**
 * Script to help add inventory items with images to the repository
 * 
 * Usage:
 *   node scripts/add-inventory-with-image.js [image-path]
 * 
 * Examples:
 *   node scripts/add-inventory-with-image.js public/images/cutting-boards/my-board.jpeg
 *   node scripts/add-inventory-with-image.js --validate-db
 *   node scripts/add-inventory-with-image.js --check-git
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images');
const SUPPORTED_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];

const categories = [
  'cutting-boards',
  'cheese-boards',
  'coasters',
  'bar-ware',
  'furniture',
  'game-boards',
  'outdoor-items',
  'laser-engraving',
  'montessori',
  'barn-finds'
];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`ERROR: ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function validateImagePath(imagePath) {
  // Convert to absolute path if relative
  const fullPath = path.isAbsolute(imagePath) 
    ? imagePath 
    : path.resolve(process.cwd(), imagePath);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    error(`Image file not found: ${fullPath}`);
  }

  // Check if it's an image
  const ext = path.extname(fullPath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    error(`Unsupported image extension: ${ext}. Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`);
  }

  // Check if it's in the public/images directory structure
  const relativePath = path.relative(PROJECT_ROOT, fullPath).replace(/\\/g, '/');
  if (!relativePath.startsWith('public/images/')) {
    error(`Image must be in public/images/{category}/ directory. Current: ${relativePath}`);
  }

  // Extract category from path (normalize separators)
  const pathParts = relativePath.split('/');
  const categoryIndex = pathParts.indexOf('images') + 1;
  if (categoryIndex === 0 || categoryIndex >= pathParts.length) {
    error(`Could not determine category from path: ${relativePath}`);
  }

  const category = pathParts[categoryIndex];
  if (!categories.includes(category)) {
    error(`Invalid category: ${category}. Valid categories: ${categories.join(', ')}`);
  }

  const filename = path.basename(fullPath);
  const dbPath = `/images/${category}/${filename}`;

  return {
    fullPath,
    relativePath,
    category,
    filename,
    dbPath,
    ext
  };
}

function checkGitStatus(imagePath) {
  const relativePath = path.relative(PROJECT_ROOT, imagePath).replace(/\\/g, '/');
  
  try {
    // Check if file is tracked by git
    execSync(`git ls-files --error-unmatch "${relativePath}"`, {
      cwd: PROJECT_ROOT,
      stdio: 'pipe'
    });
    return { tracked: true, staged: false, modified: false };
  } catch (e) {
    // File not in git yet
  }

  try {
    // Check if file is staged
    const stagedFiles = execSync('git diff --cached --name-only', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8'
    }).split('\n').filter(Boolean).map(p => p.replace(/\\/g, '/'));
    
    if (stagedFiles.includes(relativePath)) {
      return { tracked: false, staged: true, modified: false };
    }
  } catch (e) {
    // Ignore
  }

  try {
    // Check if file is modified
    const status = execSync(`git status --porcelain "${relativePath}"`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8'
    });
    
    if (status.trim()) {
      if (status.startsWith('??')) {
        return { tracked: false, staged: false, modified: false, untracked: true };
      }
      return { tracked: true, staged: false, modified: true };
    }
  } catch (e) {
    // Ignore
  }

  return { tracked: false, staged: false, modified: false, untracked: true };
}

function generateGitCommands(imagePath, dbChanges = false) {
  const relativePath = path.relative(PROJECT_ROOT, imagePath).replace(/\\/g, '/');
  const commands = [];

  const gitStatus = checkGitStatus(imagePath);
  
  if (gitStatus.untracked || !gitStatus.tracked) {
    commands.push(`git add "${relativePath}"`);
  }

  if (dbChanges) {
    commands.push('# Add database migration/changes if needed:');
    commands.push('# git add lib/migrations/your-migration.sql');
  }

  commands.push(`git commit -m "Add inventory image: ${path.basename(imagePath)}"`);
  commands.push('# git push origin feature/your-branch-name');

  return commands;
}

function checkDatabasePaths() {
  info('Checking database for image paths...');
  warning('Note: This requires database connection. Implement based on your needs.');
  info('You can manually verify image paths match files in public/images/');
}

function printWorkflow() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('📋 WORKFLOW: Adding Inventory with Images', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  
  log('\n1. Place your image file in the correct folder:', 'cyan');
  log('   public/images/{category}/your-image-name.jpeg', 'yellow');
  log('   Categories: ' + categories.join(', '), 'yellow');
  
  log('\n2. Add the product via Admin Panel:', 'cyan');
  log('   - Go to /admin/products', 'yellow');
  log('   - Click "Add Product"', 'yellow');
  log('   - Enter product details', 'yellow');
  log('   - In Images field, add: /images/{category}/your-image-name.jpeg', 'yellow');
  
  log('\n3. Add image to git:', 'cyan');
  log('   git add public/images/{category}/your-image-name.jpeg', 'yellow');
  
  log('\n4. Commit both database changes and image:', 'cyan');
  log('   git commit -m "Add inventory item: Product Name"', 'yellow');
  
  log('\n5. Push and create PR:', 'cyan');
  log('   git push origin feature/your-branch', 'yellow');
  log('   Then create Pull Request on GitHub/GitLab', 'yellow');
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright');
}

function main() {
  const args = process.argv.slice(2);
  
  // Show workflow if no arguments
  if (args.length === 0) {
    printWorkflow();
    return;
  }

  // Handle flags
  if (args[0] === '--validate-db' || args[0] === '--check-db') {
    checkDatabasePaths();
    return;
  }

  if (args[0] === '--workflow' || args[0] === '--help' || args[0] === '-h') {
    printWorkflow();
    return;
  }

  // Validate image path
  const imagePath = args[0];
  if (!imagePath) {
    error('Please provide an image path or use --help for workflow');
  }

  log('\n🔍 Validating image file...\n', 'bright');
  
  const imageInfo = validateImagePath(imagePath);
  
  success(`Image file found: ${imageInfo.filename}`);
  success(`Category: ${imageInfo.category}`);
  success(`Database path: ${imageInfo.dbPath}`);
  
  // Check file size
  const stats = fs.statSync(imageInfo.fullPath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  info(`File size: ${fileSizeMB} MB`);
  
  if (stats.size > 5 * 1024 * 1024) {
    warning('Image is larger than 5MB. Consider optimizing for web use.');
  }

  // Check git status
  log('\n📦 Checking git status...\n', 'bright');
  const gitStatus = checkGitStatus(imageInfo.fullPath);
  
  if (gitStatus.tracked && !gitStatus.modified) {
    success('Image is already tracked in git');
  } else if (gitStatus.staged) {
    info('Image is staged for commit');
  } else if (gitStatus.untracked) {
    warning('Image is not tracked in git yet');
  } else if (gitStatus.modified) {
    warning('Image has been modified');
  }

  // Generate git commands
  log('\n💻 Git Commands:\n', 'bright');
  const commands = generateGitCommands(imageInfo.fullPath);
  commands.forEach(cmd => {
    if (cmd.startsWith('#')) {
      log(cmd, 'yellow');
    } else {
      log(cmd, 'green');
    }
  });

  // Summary
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log('📝 Next Steps:', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright');
  log(`\n1. Use this path in your database: ${imageInfo.dbPath}`, 'cyan');
  log('2. Add product via Admin Panel at /admin/products', 'cyan');
  log('3. Run the git commands shown above', 'cyan');
  log('4. Commit and push to create a PR', 'cyan');
  log('');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateImagePath, checkGitStatus, generateGitCommands };

