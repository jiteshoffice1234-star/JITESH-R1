# 📱 HOW TO GET YOUR APK (3 Easy Methods)

## ⭐ METHOD 1: Automatic (GitHub Actions) — RECOMMENDED

**No coding. No Android Studio. Just click buttons.**

### Steps:

1. **Push this project to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial release"
   git remote add origin https://github.com/YOUR_USERNAME/solar-system-explorer.git
   git push -u origin main
   ```

2. **Create a release tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Wait 5-10 minutes** — GitHub will automatically:
   - ✅ Build the APK
   - ✅ Create a GitHub Release
   - ✅ Attach the APK file

4. **Download your APK:**
   - Go to your GitHub repo
   - Click "Releases" tab
   - Click on `v1.0.0`
   - Download `SolarSystemExplorer-v1.0.0.apk`

**DONE!** 🎉

---

## ⭐ METHOD 2: PWABuilder (No GitHub needed)

**Easiest method if you just want an APK fast.**

### Steps:

1. **Deploy the web app** (pick one):
   - [Vercel](https://vercel.com) — Free, drag & drop
   - [Netlify](https://netlify.com) — Free, drag & drop
   - [GitHub Pages](https://pages.github.com) — Free

2. **Visit [PWABuilder.com](https://www.pwabuilder.com/)**

3. **Enter your deployed URL** (e.g., `https://your-app.vercel.app`)

4. **Click "Package for stores" → "Android"**

5. **Download the generated APK**

**DONE!** 🎉

---

## ⭐ METHOD 3: Build Locally

**For developers who want full control.**

### Requirements:
- Node.js 16+ ([Download](https://nodejs.org))
- Android Studio ([Download](https://developer.android.com/studio))

### Steps:

```bash
# 1. Install dependencies
npm install

# 2. Build the APK (one command does everything)
node build-apk.js
```

That's it! Find `SolarSystemExplorer.apk` in the project folder.

### Or step-by-step:
```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug    # Mac/Linux
# OR: gradlew assembleDebug  # Windows
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk .
```

**DONE!** 🎉

---

## 📲 INSTALLING THE APK ON ANDROID

1. **Transfer** `SolarSystemExplorer.apk` to your phone:
   - USB cable
   - Email it to yourself
   - Google Drive / Dropbox
   - WhatsApp (send to yourself)

2. **On your phone:**
   - Open the APK file
   - If prompted: Settings → Security → Enable "Unknown Sources"
   - Tap "Install"
   - Wait for installation

3. **Launch the app** from your home screen!

---

## 🎮 WHAT YOU GET

- ☀️ Animated Sun with corona effects
- 🪐 All 8 planets orbiting with accurate speeds
- 🌟 Beautiful twinkling starfield
- 📊 Tap any planet for detailed info
- 🎛️ Play/Pause + Speed controls (0.1x - 10x)
- 📱 Pinch to zoom, drag to pan
- 📴 Works completely OFFLINE
- 📳 Haptic feedback on supported devices
- 💾 ~8 MB file size
- 📱 Android 5.0+ (works on 99% of devices)

---

## ❓ FAQ

**Q: Is this safe to install?**
A: Yes! It's your own app, built from this source code. No data collection, no ads, no tracking.

**Q: Will it work offline?**
A: Yes! Once installed, it works without internet.

**Q: Can I share the APK with friends?**
A: Yes! Send them the APK file. They can install it the same way.

**Q: Why "Unknown Sources" warning?**
A: Android shows this for any APK not from Play Store. It's normal for self-built apps.

**Q: Can I publish to Google Play?**
A: Yes! Use `./gradlew bundleRelease` in the android folder to create a signed AAB for Play Store.

---

## 🆘 Need Help?

- **Build issues?** → Check [BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)
- **GitHub Actions failing?** → Check the Actions tab in your repo
- **APK won't install?** → Make sure "Unknown Sources" is enabled

---

**That's it! Pick any method above and you'll have your APK in minutes.** 🚀
