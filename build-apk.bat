@echo off
echo.
echo 🚀 Building Solar System Explorer APK...
echo.

REM Step 1: Build web app
echo 📦 Step 1: Building web app...
call npm run build
if errorlevel 1 (
    echo ❌ Web build failed!
    pause
    exit /b 1
)
echo ✅ Web app built successfully
echo.

REM Step 2: Initialize Capacitor Android (if not already done)
if not exist "android" (
    echo 🔄 Step 2: Adding Android platform...
    call npx cap add android
    if errorlevel 1 (
        echo ❌ Failed to add Android platform!
        pause
        exit /b 1
    )
    echo ✅ Android platform added
) else (
    echo ✅ Android platform already exists
)
echo.

REM Step 3: Sync with Capacitor
echo 🔄 Step 3: Syncing with Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo ❌ Capacitor sync failed!
    pause
    exit /b 1
)
echo ✅ Synced successfully
echo.

REM Step 4: Build APK
echo 🔨 Step 4: Building APK...
cd android
call gradlew assembleDebug
if errorlevel 1 (
    echo ❌ APK build failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ APK built successfully
echo.

REM Step 5: Copy APK to root
echo 📋 Step 5: Copying APK...
copy "android\app\build\outputs\apk\debug\app-debug.apk" "SolarSystemExplorer.apk"
echo ✅ APK copied to: SolarSystemExplorer.apk
echo.

echo 🎉 Build complete!
echo 📱 Your APK is ready: SolarSystemExplorer.apk
echo.
echo To install on Android:
echo 1. Transfer the APK to your Android device
echo 2. Enable 'Install from Unknown Sources' in Settings
echo 3. Tap the APK file to install
echo.
pause
