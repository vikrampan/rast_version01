const { execSync } = require('child_process');
const path = require('path');

try {
  // Compile TypeScript file
  console.log('Compiling TypeScript...');
  execSync('npx tsc src/scripts/createSuperAdmin.ts --esModuleInterop --outDir dist');

  // Run compiled JavaScript
  console.log('Running seeder...');
  execSync('node dist/scripts/createSuperAdmin.js', { stdio: 'inherit' });

  console.log('Seeder completed successfully');
} catch (error) {
  console.error('Error running seeder:', error);
  process.exit(1);
}