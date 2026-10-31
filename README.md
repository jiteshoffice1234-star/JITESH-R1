# ☀️ Solar System Explorer

An interactive, touch-optimized Solar System learning app built with React, Capacitor, and Canvas. Works as a web app, PWA, and native Android APK.

![Solar System](https://img.shields.io/badge/Planets-8-blue) ![Build](https://img.shields.io/badge/Build-Passing-green) ![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web%20%7C%20PWA-orange)

## 🎮 Features

- 🪐 All 8 planets with smooth orbital animations
- 📊 Detailed planet info (diameter, distance, orbital period)
- ⏯️ Play/pause and variable speed controls (0.1x - 10x)
- 📱 Touch-optimized: pinch-to-zoom, drag-to-pan
- 🌟 Beautiful starfield with twinkling effects
- 📴 Works completely offline
- 📳 Haptic feedback on supported devices

## 🚀 Quick Start

### Web Version
```bash
npm install
npm run dev
```

### Build APK (One Command)
```bash
node build-apk.js
```

This will:
1. Install all dependencies
2. Build the web app
3. Set up Capacitor Android
4. Compile the APK
5. Output `SolarSystemExplorer.apk`

## 📱 Building the APK

### Prerequisites
- Node.js v16+
- Android Studio (with SDK)
- Java JDK 17

### Automated Build
```bash
# Node.js script (recommended)
node build-apk.js

# Or shell scripts
./build-apk.sh    # Mac/Linux
build-apk.bat     # Windows
```

### Manual Build
```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug && cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk SolarSystemExplorer.apk
```

### Using PWABuilder (No Android Studio needed)
1. Deploy the web app to any hosting service
2. Visit [PWABuilder.com](https://www.pwabuilder.com/)
3. Enter your URL and click Build → Android
4. Download the generated APK

## 📲 Installing the APK

1. Transfer `SolarSystemExplorer.apk` to your Android device
2. Enable "Install from Unknown Sources" in Settings
3. Open the APK file and tap Install
4. Launch from your home screen!

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Canvas API** - Smooth 60fps animations
- **Capacitor** - Native Android wrapper
- **Service Worker** - Offline support
- **PWA Manifest** - Installable web app

## 📁 Project Structure

```
├── src/
│   ├── App.tsx          # Main app with canvas rendering
│   ├── data/planets.ts  # Planet data and info
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── public/
│   ├── manifest.json    # PWA manifest
│   ├── sw.js            # Service worker
│   └── apk-guide.html   # APK download guide
├── capacitor.config.ts  # Capacitor configuration
├── build-apk.js         # Automated APK builder
├── build-apk.sh         # Shell build script
└── build-apk.bat        # Windows build script
```

## 🎨 Customization

### Change App Name/ID
Edit `capacitor.config.ts`:
```typescript
appId: 'com.yourcompany.app',
appName: 'Your App Name',
```

### Change App Icon
Replace files in `android/app/src/main/res/mipmap-*/`

## 📄 License

MIT License - Feel free to use and modify!

---

Built with ❤️ for space exploration education
