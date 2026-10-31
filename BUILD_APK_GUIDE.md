# 🚀 Solar System Explorer - Android APK Build Guide

## 📱 What You'll Get
A fully functional Android APK that can be installed on any Android device (Android 5.0+)

## ⚡ Quick Start (Automated)

### Windows:
```bash
build-apk.bat
```

### Mac/Linux:
```bash
chmod +x build-apk.sh
./build-apk.sh
```

The APK will be created as `SolarSystemExplorer.apk` in the project root.

---

## 🔧 Manual Build Instructions

### Prerequisites
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Android Studio** - [Download](https://developer.android.com/studio)
3. **Java JDK 17** (comes with Android Studio)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Web App
```bash
npm run build
```

### Step 3: Add Android Platform
```bash
npx cap add android
```

### Step 4: Sync Web Assets
```bash
npx cap sync android
```

### Step 5: Open in Android Studio
```bash
npx cap open android
```

### Step 6: Build APK in Android Studio
1. Wait for Gradle sync to complete
2. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete
4. Click **locate** in the notification to find your APK

The APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 7: Build via Command Line (Alternative)
```bash
cd android
./gradlew assembleDebug  # Mac/Linux
gradlew assembleDebug    # Windows
cd ..
```

Copy the APK:
```bash
cp android/app/build/outputs/apk/debug/app-debug.apk SolarSystemExplorer.apk
```

---

## 📲 Installing the APK on Android

### Method 1: USB Transfer
1. Connect your Android device to your computer via USB
2. Copy `SolarSystemExplorer.apk` to your device
3. On your phone, open a file manager and tap the APK
4. Allow installation from unknown sources if prompted
5. Tap **Install**

### Method 2: Email/Cloud
1. Upload `SolarSystemExplorer.apk` to Google Drive, Dropbox, or email it to yourself
2. Open the file on your Android device
3. Tap **Install**

### Method 3: ADB (Developer Method)
```bash
adb install SolarSystemExplorer.apk
```

---

## 🎮 App Features

- ✅ Smooth 60fps orbital animations
- ✅ All 8 planets with accurate relative speeds
- ✅ Touch controls: tap, pinch-to-zoom, drag-to-pan
- ✅ Play/pause and speed controls (0.1x - 10x)
- ✅ Detailed planet information panels
- ✅ Offline support
- ✅ Haptic feedback
- ✅ Full-screen immersive mode

---

## 🛠️ Troubleshooting

### "Gradle sync failed"
- Make sure Android Studio is updated
- Delete `android/.gradle` folder and retry
- Check your internet connection (Gradle needs to download dependencies)

### "SDK location not found"
- Set `ANDROID_HOME` environment variable to your Android SDK path
- Or create `android/local.properties` with:
  ```
  sdk.dir=/path/to/Android/sdk
  ```

### "Java version mismatch"
- Make sure you're using Java 17
- Set `JAVA_HOME` environment variable

### APK won't install
- Enable "Install from Unknown Sources" in Android Settings
- Make sure your device has enough storage
- Check that the APK isn't corrupted (rebuild if needed)

---

## 📦 Building a Release APK (Signed)

For distribution, you need a signed release APK:

1. Generate a keystore:
```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key
```

2. Create `android/key.properties`:
```properties
storePassword=your_password
keyPassword=your_password
keyAlias=my-key
storeFile=../release-key.jks
```

3. Edit `android/app/build.gradle` and add signing config:
```gradle
android {
    signingConfigs {
        release {
            def props = new Properties()
            props.load(new FileInputStream(rootProject.file("key.properties")))
            storeFile file(props['storeFile'])
            storePassword props['storePassword']
            keyAlias props['keyAlias']
            keyPassword props['keyPassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

4. Build release APK:
```bash
cd android
./gradlew assembleRelease
```

---

## 📱 Publishing to Google Play Store

To publish on Google Play:

1. Create a Google Play Developer account ($25 one-time fee)
2. Build a signed release AAB (Android App Bundle):
```bash
cd android
./gradlew bundleRelease
```
3. Upload the AAB to Google Play Console
4. Fill in store listing details
5. Submit for review

---

## 🎨 Customization

### Change App Name
Edit `capacitor.config.ts`:
```typescript
appName: 'Your App Name',
```

### Change App Icon
Replace icons in `android/app/src/main/res/mipmap-*` folders

### Change App ID
Edit `capacitor.config.ts`:
```typescript
appId: 'com.yourcompany.yourapp',
```

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Make sure all prerequisites are installed correctly
3. Try cleaning and rebuilding:
```bash
rm -rf android
npx cap add android
npx cap sync android
```

---

## 🎉 You're All Set!

Your Solar System Explorer APK is ready to install and play!

**Enjoy exploring the solar system!** 🌍🪐☀️
