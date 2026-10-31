#!/usr/bin/env node

/**
 * Solar System Explorer - Release Script
 * 
 * Creates a new release with proper versioning and git tags.
 * The GitHub Actions workflow will automatically build the APK.
 * 
 * Usage:
 *   node release.js patch    # v1.0.0 → v1.0.1
 *   node release.js minor    # v1.0.1 → v1.1.0
 *   node release.js major    # v1.1.0 → v2.0.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

function log(msg, color = RESET) {
  console.log(`${color}${msg}${RESET}`);
}

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

function getCurrentVersion() {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  return pkg.version || '0.0.0';
}

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);
  switch (type) {
    case 'major': return `${major + 1}.0.0`;
    case 'minor': return `${major}.${minor + 1}.0`;
    case 'patch': return `${major}.${minor}.${patch + 1}`;
    default:
      log(`❌ Invalid version type: ${type}. Use: major, minor, or patch`, RED);
      process.exit(1);
  }
}

function main() {
  const type = process.argv[2];
  
  if (!type || !['major', 'minor', 'patch'].includes(type)) {
    log('\n🚀 Solar System Explorer - Release Script\n', BLUE);
    log('Usage:', YELLOW);
    log('  node release.js patch    # Bug fixes (v1.0.0 → v1.0.1)', RESET);
    log('  node release.js minor    # New features (v1.0.0 → v1.1.0)', RESET);
    log('  node release.js major    # Breaking changes (v1.0.0 → v2.0.0)', RESET);
    log('\nExample:', YELLOW);
    log('  node release.js patch', RESET);
    process.exit(1);
  }

  log('\n🚀 Solar System Explorer - Creating Release\n', BLUE);
  log('═'.repeat(50), CYAN);

  // Get current version
  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersion(currentVersion, type);
  const tagName = `v${newVersion}`;

  log(`\n📌 Current version: v${currentVersion}`, RESET);
  log(`📌 New version: ${tagName}`, GREEN);

  // Check git status
  try {
    const status = run('git status --porcelain');
    if (status) {
      log('\n⚠️  You have uncommitted changes. Commit them first:', YELLOW);
      log('   git add . && git commit -m "your message"', RESET);
      process.exit(1);
    }
  } catch {
    log('\n⚠️  Not a git repository. Initialize with: git init', YELLOW);
    process.exit(1);
  }

  // Update package.json version
  log('\n📝 Updating package.json...', BLUE);
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  pkg.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  log('  ✅ package.json updated', GREEN);

  // Update capacitor config version
  log('\n📝 Updating capacitor.config.ts...', BLUE);
  let capConfig = fs.readFileSync('capacitor.config.ts', 'utf-8');
  // Add version if not present
  if (!capConfig.includes('version:')) {
    capConfig = capConfig.replace(
      "appName: 'Solar System Explorer',",
      `appName: 'Solar System Explorer',\n  version: '${newVersion}',`
    );
    fs.writeFileSync('capacitor.config.ts', capConfig);
  }
  log('  ✅ capacitor.config.ts updated', GREEN);

  // Create git commit
  log('\n📦 Creating git commit...', BLUE);
  run('git add package.json capacitor.config.ts');
  run(`git commit -m "chore: release ${tagName}"`);
  log('  ✅ Commit created', GREEN);

  // Create tag
  log('\n🏷️  Creating git tag...', BLUE);
  run(`git tag -a ${tagName} -m "Release ${tagName}"`);
  log(`  ✅ Tag ${tagName} created`, GREEN);

  // Push
  log('\n📤 Pushing to remote...', BLUE);
  try {
    run('git push && git push --tags');
    log('  ✅ Pushed to remote', GREEN);
  } catch {
    log('  ⚠️  Could not push. Push manually:', YELLOW);
    log(`     git push && git push --tags`, RESET);
  }

  // Summary
  log('\n' + '═'.repeat(50), CYAN);
  log('\n🎉 RELEASE CREATED SUCCESSFULLY!\n', GREEN);
  log(`  📌 Version: ${tagName}`, GREEN);
  log(`  🏷️  Tag: ${tagName}`, GREEN);
  log('', RESET);
  log('  🤖 GitHub Actions will now:', BLUE);
  log('     1. Build the Android APK automatically', RESET);
  log('     2. Create a GitHub Release', RESET);
  log('     3. Attach the APK for download', RESET);
  log('', RESET);
  log('  📱 Go to your GitHub repo → Releases tab to download the APK!', YELLOW);
  log('', RESET);
  log('  💡 Or build locally with: node build-apk.js', RESET);
  log('', RESET);
}

main();
