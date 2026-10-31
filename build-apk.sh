#!/bin/bash

echo "🚀 Building Solar System Explorer APK..."
echo ""

# Step 1: Build web app
echo "📦 Step 1: Building web app..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Web build failed!"
    exit 1
fi
echo "✅ Web app built successfully"
echo ""

# Step 2: Sync with Capacitor
echo "🔄 Step 2: Syncing with Capacitor..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed!"
    exit 1
fi
echo "✅ Synced successfully"
echo ""

# Step 3: Build APK
echo "🔨 Step 3: Building APK..."
cd android
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo "❌ APK build failed!"
    exit 1
fi
cd ..
echo "✅ APK built successfully"
echo ""

# Step 4: Copy APK to root
echo "📋 Step 4: Copying APK..."
cp android/app/build/outputs/apk/debug/app-debug.apk SolarSystemExplorer.apk
echo "✅ APK copied to: SolarSystemExplorer.apk"
echo ""

echo "🎉 Build complete!"
echo "📱 Your APK is ready: SolarSystemExplorer.apk"
echo ""
echo "To install on Android:"
echo "1. Transfer the APK to your Android device"
echo "2. Enable 'Install from Unknown Sources' in Settings"
echo "3. Tap the APK file to install"
