#!/usr/bin/env node

/**
 * Solar System Explorer - APK Builder
 * 
 * This script automates the entire process of building an Android APK
 * from the web application using Capacitor.
 * 
 * Usage: node build-apk.js
 * 
 * Prerequisites:
 * - Node.js v16+
 * - Android Studio with SDK installed
 * - JAVA_HOME environment variable set
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

function run(command, description) {
  log(`\n▶ ${description}`, BLUE);
  log(`  $ ${command}`, YELLOW);
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    log(`  ✅ Success`, GREEN);
    return true;
  } catch (error) {
    log(`  ❌ Failed: ${error.message}`, RED);
    return false;
  }
}

function checkPrerequisites() {
  log('\n🔍 Checking prerequisites...\n', BLUE);
  
  // Check Node.js
  try {
    const nodeVersion = execSync('node --version').toString().trim();
    log(`  ✅ Node.js: ${nodeVersion}`, GREEN);
  } catch {
    log('  ❌ Node.js not found! Install from https://nodejs.org/', RED);
    process.exit(1);
  }

  // Check Java
  try {
    const javaVersion = execSync('java -version 2>&1').toString().split('\n')[0];
    log(`  ✅ Java: ${javaVersion}`, GREEN);
  } catch {
    log('  ❌ Java not found! Install Android Studio or set JAVA_HOME', RED);
    log('  Download: https://developer.android.com/studio', YELLOW);
    process.exit(1);
  }

  // Check Android SDK
  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (androidHome) {
    log(`  ✅ Android SDK: ${androidHome}`, GREEN);
  } else {
    log('  ⚠️  ANDROID_HOME not set. Build may fail.', YELLOW);
    log('  Set it to your Android SDK path', YELLOW);
  }
}

async function main() {
  log('\n🚀 Solar System Explorer - APK Builder\n', GREEN);
  log('═'.repeat(50), BLUE);

  // Check prerequisites
  checkPrerequisites();

  // Step 1: Install dependencies
  if (!fs.existsSync('node_modules')) {
    if (!run('npm install', 'Installing dependencies')) {
      process.exit(1);
    }
  } else {
    log('\n✅ Dependencies already installed', GREEN);
  }

  // Step 2: Build web app
  if (!run('npm run build', 'Building web application')) {
    process.exit(1);
  }

  // Step 3: Check if Android platform exists
  if (!fs.existsSync('android')) {
    if (!run('npx cap add android', 'Adding Android platform')) {
      process.exit(1);
    }
  } else {
    log('\n✅ Android platform already exists', GREEN);
  }

  // Step 4: Sync
  if (!run('npx cap sync android', 'Syncing web assets with Android')) {
    process.exit(1);
  }

  // Step 5: Build APK
  const isWindows = process.platform === 'win32';
  const gradleCmd = isWindows ? 'gradlew.bat assembleDebug' : './gradlew assembleDebug';
  
  if (!run(`cd android && ${gradleCmd}`, 'Building Android APK')) {
    log('\n❌ APK build failed!', RED);
    log('\nTroubleshooting:', YELLOW);
    log('  1. Make sure Android SDK is installed', YELLOW);
    log('  2. Accept SDK licenses: sdkmanager --licenses', YELLOW);
    log('  3. Check ANDROID_HOME environment variable', YELLOW);
    process.exit(1);
  }

  // Step 6: Copy APK
  const apkSource = path.join('android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  const apkDest = 'SolarSystemExplorer.apk';

  if (fs.existsSync(apkSource)) {
    fs.copyFileSync(apkSource, apkDest);
    const stats = fs.statSync(apkDest);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    
    log('\n' + '═'.repeat(50), GREEN);
    log('\n🎉 BUILD SUCCESSFUL!\n', GREEN);
    log(`  📱 APK: ${apkDest}`, GREEN);
    log(`  📦 Size: ${sizeMB} MB`, GREEN);
    log(`  📍 Path: ${path.resolve(apkDest)}`, GREEN);
    log('\n📲 To install on Android:', BLUE);
    log('  1. Transfer APK to your device', RESET);
    log('  2. Enable "Install from Unknown Sources"', RESET);
    log('  3. Tap the APK file to install', RESET);
    log('  4. Enjoy exploring the solar system! ☀️🪐\n', RESET);
  } else {
    log('\n❌ APK file not found at expected location', RED);
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, RED);
  process.exit(1);
});
