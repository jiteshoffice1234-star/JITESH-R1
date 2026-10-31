# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2025

### 🎉 Initial Release

#### Features
- ☀️ Animated Sun with pulsing corona effects
- 🪐 All 8 planets with accurate relative orbital speeds
- 🌟 Beautiful twinkling starfield background (300 stars)
- 📊 Detailed planet information panels:
  - Planet name and number from Sun
  - Diameter (km)
  - Distance from Sun (million km)
  - Orbital period (Earth days/years)
  - Relative orbital speed
- 🎛️ Playback controls:
  - Play/Pause button
  - Speed slider (0.1x to 10x)
  - Speed presets (0.5x, 1x, 3x, 5x)
- 📱 Touch-optimized for Android:
  - Tap planet for info
  - Pinch to zoom in/out
  - Drag to pan around
  - Haptic feedback on supported devices
- 🔄 Planet trail effects for visual motion
- 💫 Saturn's rings rendered with ellipses
- 🏷️ Toggle planet labels on/off
- ⟲ Reset view button
- 📴 Full offline support via Service Worker
- 📲 PWA installable (Add to Home Screen)
- 🤖 Android APK build system via Capacitor
- 🔄 GitHub Actions auto-build APK on release
- 🎨 Welcome screen with instructions
- 📱 Responsive design for all screen sizes

#### Technical
- Built with React 18 + TypeScript
- Canvas API for 60fps animations
- Tailwind CSS for styling
- Capacitor for native Android wrapper
- Service Worker for offline caching
- PWA manifest for installability
- MIT License
