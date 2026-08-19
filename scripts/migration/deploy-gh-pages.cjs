/**
 * Reliable GitHub Pages deployment script avoiding Windows ENAMETOOLONG
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve('dist');

console.log('🚀 DEPLOYING DIST TO GH-PAGES BRANCH...');

try {
  // Ensure dist/.git is initialized or clean
  const gitDirInDist = path.join(distDir, '.git');
  if (fs.existsSync(gitDirInDist)) {
    fs.rmSync(gitDirInDist, { recursive: true, force: true });
  }

  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.name "Vishal Singh Shekhawat"', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.email "vishalsinghshekhawat18@gmail.com"', { cwd: distDir, stdio: 'inherit' });
  execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "deploy: publish latest live webapp with Jan/Feb 2026 CA"', { cwd: distDir, stdio: 'inherit' });
  
  console.log('Pushing to remote gh-pages branch...');
  execSync('git push -f https://github.com/vishalsinghshekhawat18-glitch/A18.git gh-pages', { cwd: distDir, stdio: 'inherit' });

  console.log('\n✅ GH-PAGES DEPLOYMENT SUCCESSFUL!');
} catch (err) {
  console.error('Deployment error:', err.message);
  process.exit(1);
}
