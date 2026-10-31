# ☀️ Solar System Explorer

**Interactive Solar System Learning App — Available as Web, PWA, and Android APK**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web%20%7C%20PWA-green)
![License](https://img.shields.io/badge/license-MIT-orange)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

## 📱 Get the APK

**3 easy ways to get your Android APK:**

### ⭐ Method 1: GitHub Actions (Automatic)
Push a tag to GitHub → APK is built automatically and attached to the release:
```bash
git tag v1.0.0
git push origin v1.0.0
```
Then download from your repo's **Releases** tab.

### ⭐ Method 2: PWABuilder (No coding)
1. Deploy to Vercel/Netlify
2. Visit [pwabuilder.com](https://www.pwabuilder.com/)
3. Enter your URL → Build → Android → Download APK

### ⭐ Method 3: Build Locally
```bash
node build-apk.js
```

👉 **Full instructions:** [HOW_TO_GET_APK.md](HOW_TO_GET_APK.md)

---

## 🎮 Features

- ☀️ **Animated Sun** with pulsing corona effects
- 🪐 **All 8 planets** with accurate relative orbital speeds
- 🌟 **Beautiful starfield** with 300 twinkling stars
- 📊 **Planet info panels** — tap any planet for:
  - Diameter (km)
  - Distance from Sun (million km)
  - Orbital period (Earth days/years)
  - Relative orbital speed
- 🎛️ **Playback controls** — Play/Pause + Speed (0.1x to 10x)
- 📱 **Touch-optimized** — Pinch zoom, drag pan, tap to select
- 📴 **Works offline** — No internet needed after install
- 📳 **Haptic feedback** on supported devices
- 💫 **Planet trails** and Saturn's rings
- 🏷️ **Toggle labels** on/off
- 📦 **~8 MB** APK size
- 📱 **Android 5.0+** (works on 99% of devices)

---

## 🚀 Quick Start

### Web Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Build Android APK
```bash
node build-apk.js
```

### Create a Release
```bash
node release.js patch   # v1.0.0 → v1.0.1
node release.js minor   # v1.0.0 → v1.1.0
node release.js major   # v1.0.0 → v2.0.0
```

---

## 📁 Project Structure

```
├── src/
│   ├── App.tsx              # Main app with canvas rendering
│   ├── data/planets.ts      # Planet data (8 planets)
│   ├── index.css            # Global styles + animations
│   └── main.tsx             # Entry point
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker (offline)
│   └── apk-guide.html       # Visual APK guide
├── .github/workflows/
│   └── build-apk.yml        # Auto-build APK on release
├── capacitor.config.ts      # Android native config
├── build-apk.js             # Automated APK builder
├── build-apk.sh             # Shell script (Mac/Linux)
├── build-apk.bat            # Batch script (Windows)
├── release.js               # Version & release manager
├── LICENSE                  # MIT License
├── CHANGELOG.md             # Version history
└── README.md                # This file
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Canvas API | 60fps Animations |
| Capacitor | Native Android Wrapper |
| Service Worker | Offline Support |
| GitHub Actions | Auto APK Build |

---

## 📲 Installing the APK

1. Download `SolarSystemExplorer.apk`
2. Transfer to your Android phone
3. Enable "Install from Unknown Sources" in Settings
4. Tap the APK → Install
5. Launch from home screen!

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Planet data from NASA
- Built with love for space education

---

**Made with ❤️ for space exploration**

🌍 🪐 ☀️ 🌟 🚀
