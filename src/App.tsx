import { useState, useRef, useEffect, useCallback } from "react";
import { planets, Planet } from "./data/planets";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });
  const lastTimeRef = useRef<number>(0);
  const [showLabels, setShowLabels] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const deferredPromptRef = useRef<any>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const lastPinchDistRef = useRef<number | null>(null);
  const lastPanRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;

  const getScale = useCallback(() => {
    const minDim = Math.min(canvasSize.width, canvasSize.height);
    return (minDim / 900) * zoom;
  }, [canvasSize, zoom]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    // Initial delay to ensure DOM is ready
    const timer = setTimeout(handleResize, 50);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => setTimeout(handleResize, 100));
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // PWA Install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setShowInstallPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      const result = await deferredPromptRef.current.userChoice;
      if (result.outcome === "accepted") {
        setShowInstallPrompt(false);
      }
      deferredPromptRef.current = null;
    }
  };

  // Draw stars
  const starsRef = useRef<{ x: number; y: number; r: number; b: number }[]>([]);
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.3,
        b: Math.random() * 0.6 + 0.2,
      });
    }
    starsRef.current = stars;
  }, []);

  // Draw function
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, timestamp: number) => {
      const scale = getScale();
      const cx = canvasSize.width / 2 + panOffset.x;
      const cy = canvasSize.height / 2 + panOffset.y;

      // Clear
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Stars
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(timestamp * 0.001 + star.x * 100) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.b * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x * canvasSize.width, star.y * canvasSize.height, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Orbits
      planets.forEach((planet) => {
        ctx.beginPath();
        ctx.arc(cx, cy, planet.orbitRadius * scale, 0, Math.PI * 2);
        const isHighlighted = hoveredPlanet === planet.name || selectedPlanet?.name === planet.name;
        ctx.strokeStyle = isHighlighted
          ? `${planet.color}60`
          : "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
        ctx.stroke();
      });

      // Sun
      drawSun(ctx, cx, cy, scale, timestamp);

      // Planets
      planets.forEach((planet, index) => {
        const angle = anglesRef.current[index];
        const orbitR = planet.orbitRadius * scale;
        const x = cx + Math.cos(angle) * orbitR;
        const y = cy + Math.sin(angle) * orbitR;
        const r = Math.max(planet.radius * scale * 0.5, 3);

        // Planet trail
        ctx.beginPath();
        const trailLength = 0.3;
        for (let t = 0; t <= trailLength; t += 0.02) {
          const trailAngle = angle - t * planet.orbitalSpeed * 0.02;
          const tx = cx + Math.cos(trailAngle) * orbitR;
          const ty = cy + Math.sin(trailAngle) * orbitR;
          if (t === 0) ctx.moveTo(tx, ty);
          else ctx.lineTo(tx, ty);
        }
        ctx.strokeStyle = `${planet.color}30`;
        ctx.lineWidth = r * 0.8;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glow
        const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        glowGrad.addColorStop(0, `${planet.color}40`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Body
        const bodyGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
        bodyGrad.addColorStop(0, lightenColor(planet.color, 50));
        bodyGrad.addColorStop(0.7, planet.color);
        bodyGrad.addColorStop(1, darkenColor(planet.color, 30));
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Saturn rings
        if (planet.name === "Saturn") {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(x, y, r * 2.2, r * 0.5, -0.3, 0, Math.PI * 2);
          ctx.strokeStyle = "#f0d68a90";
          ctx.lineWidth = Math.max(2, r * 0.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(x, y, r * 1.8, r * 0.4, -0.3, 0, Math.PI * 2);
          ctx.strokeStyle = "#f0d68a50";
          ctx.lineWidth = Math.max(1, r * 0.15);
          ctx.stroke();
          ctx.restore();
        }

        // Selection ring
        if (selectedPlanet?.name === planet.name) {
          const pulse = Math.sin(timestamp * 0.005) * 2 + 4;
          ctx.beginPath();
          ctx.arc(x, y, r + pulse, 0, Math.PI * 2);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -timestamp * 0.02;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Hover ring
        if (hoveredPlanet === planet.name && selectedPlanet?.name !== planet.name) {
          ctx.beginPath();
          ctx.arc(x, y, r + 4, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Labels
        if (showLabels) {
          const isActive = hoveredPlanet === planet.name || selectedPlanet?.name === planet.name;
          ctx.fillStyle = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.6)";
          ctx.font = `${isActive ? "bold " : ""}${Math.max(9, 11 * scale)}px -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(planet.name, x, y - r - 8);
        }
      });

      // Update angles
      if (isPlaying) {
        const dt = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0;
        const clampedDt = Math.min(dt, 0.1); // Prevent jumps
        planets.forEach((planet, index) => {
          anglesRef.current[index] += planet.orbitalSpeed * speed * clampedDt * 0.5;
        });
      }
      lastTimeRef.current = timestamp;
    },
    [canvasSize, getScale, hoveredPlanet, selectedPlanet, isPlaying, speed, showLabels, panOffset]
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const animate = (timestamp: number) => {
      draw(ctx, timestamp);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw, canvasSize]);

  function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, timestamp: number) {
    const sunRadius = 30 * scale;
    const pulse = Math.sin(timestamp * 0.002) * sunRadius * 0.05;

    // Outer corona
    const coronaGrad = ctx.createRadialGradient(cx, cy, sunRadius, cx, cy, sunRadius * 4);
    coronaGrad.addColorStop(0, "rgba(255, 150, 0, 0.15)");
    coronaGrad.addColorStop(0.5, "rgba(255, 100, 0, 0.05)");
    coronaGrad.addColorStop(1, "transparent");
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius * 4, 0, Math.PI * 2);
    ctx.fill();

    // Inner glow
    const innerGlow = ctx.createRadialGradient(cx, cy, sunRadius * 0.3, cx, cy, sunRadius * 2);
    innerGlow.addColorStop(0, "rgba(255, 200, 50, 0.4)");
    innerGlow.addColorStop(1, "transparent");
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Sun body
    const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunRadius + pulse);
    sunGrad.addColorStop(0, "#ffffff");
    sunGrad.addColorStop(0.2, "#fff5d0");
    sunGrad.addColorStop(0.5, "#ffcc00");
    sunGrad.addColorStop(0.8, "#ff9900");
    sunGrad.addColorStop(1, "#ff6600");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius + pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  function lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
    const b = Math.min(255, (num & 0x0000ff) + percent);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - percent);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - percent);
    const b = Math.max(0, (num & 0x0000ff) - percent);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Get planet at position
  const getPlanetAtPosition = useCallback(
    (x: number, y: number): Planet | null => {
      const scale = getScale();
      const cx = canvasSize.width / 2 + panOffset.x;
      const cy = canvasSize.height / 2 + panOffset.y;

      // Check in reverse order (outer planets first for easier tapping)
      for (let i = planets.length - 1; i >= 0; i--) {
        const planet = planets[i];
        const angle = anglesRef.current[i];
        const orbitR = planet.orbitRadius * scale;
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + Math.sin(angle) * orbitR;
        const r = Math.max(planet.radius * scale * 0.5, 3);
        const hitRadius = Math.max(r + 15, 25); // Minimum touch target
        const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
        if (dist <= hitRadius) {
          return planet;
        }
      }
      return null;
    },
    [canvasSize, getScale, panOffset]
  );

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      lastPanRef.current = { x: touch.clientX, y: touch.clientY };
      isDraggingRef.current = false;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && touchStartRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        isDraggingRef.current = true;
      }
      if (isDraggingRef.current && lastPanRef.current) {
        const panDx = touch.clientX - lastPanRef.current.x;
        const panDy = touch.clientY - lastPanRef.current.y;
        setPanOffset((prev) => ({ x: prev.x + panDx, y: prev.y + panDy }));
        lastPanRef.current = { x: touch.clientX, y: touch.clientY };
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDistRef.current !== null) {
        const scaleChange = dist / lastPinchDistRef.current;
        setZoom((prev) => Math.max(0.3, Math.min(3, prev * scaleChange)));
      }
      lastPinchDistRef.current = dist;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      if (touchStartRef.current && !isDraggingRef.current) {
        const touch = e.changedTouches[0];
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          const planet = getPlanetAtPosition(x, y);
          setSelectedPlanet(planet);
          // Haptic feedback on supported devices
          if (planet && "vibrate" in navigator) {
            (navigator as any).vibrate(10);
          }
        }
      }
      touchStartRef.current = null;
      lastPanRef.current = null;
      lastPinchDistRef.current = null;
      isDraggingRef.current = false;
    }
  };

  // Mouse handlers (for desktop)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const planet = getPlanetAtPosition(x, y);
    setSelectedPlanet(planet);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const planet = getPlanetAtPosition(x, y);
    setHoveredPlanet(planet?.name || null);
    canvas.style.cursor = planet ? "pointer" : "grab";
  };

  // Reset view
  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="w-full h-full bg-[#0a0a1a] flex flex-col overflow-hidden relative">
      {/* Welcome overlay */}
      {showWelcome && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-b from-[#1a1a3e] to-[#0d0d2b] rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl text-center">
            <div className="text-6xl mb-4">☀️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Solar System Explorer</h1>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Explore all 8 planets in our solar system! Tap on any planet to learn about its size, distance from the Sun, and orbital period.
            </p>
            <div className="space-y-3 text-left text-sm text-white/50 mb-6">
              <p className="flex items-center gap-2">
                <span className="text-lg">👆</span> Tap a planet for info
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">🤏</span> Pinch to zoom in/out
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">☝️</span> Drag to pan around
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">⏯️</span> Play/pause & speed controls
              </p>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl transition-colors text-lg"
            >
              Start Exploring 🚀
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="touch-none absolute inset-0"
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="text-xl">☀️</span>
            <span className="text-white font-bold text-sm hidden sm:block">Solar System</span>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={resetView}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 text-xs"
              title="Reset view"
            >
              ⟲
            </button>
            <label className="flex items-center gap-1.5 text-xs text-white/60 cursor-pointer pointer-events-auto">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-blue-500"
              />
              Labels
            </label>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-center gap-3 bg-black/50 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 max-w-md mx-auto">
            {/* Play/Pause */}
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                try { navigator?.vibrate?.(5); } catch {}
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-500/20 hover:bg-blue-500/30 active:bg-blue-500/40 transition-colors text-blue-400 border border-blue-500/30"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3" y="2" width="3.5" height="12" rx="1" />
                  <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <polygon points="4,1 14,8 4,15" />
                </svg>
              )}
            </button>

            {/* Speed slider */}
            <div className="flex items-center gap-2 flex-1">
              <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Speed</span>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="flex-1 h-1.5 cursor-pointer"
              />
              <span className="text-white text-xs font-mono w-10 text-right">
                {speed.toFixed(1)}x
              </span>
            </div>

            {/* Speed presets */}
            <div className="flex gap-1">
              {[0.5, 1, 3, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpeed(s);
                    try { navigator?.vibrate?.(3); } catch {}
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    Math.abs(speed - s) < 0.05
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/10 text-white/60 hover:bg-white/15 active:bg-white/20"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Planet info panel */}
        {selectedPlanet && (
          <div className="absolute top-12 right-3 left-3 sm:left-auto sm:w-80 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 text-white shadow-2xl animate-slide-in z-30">
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors text-white/70 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lightenColorStatic(selectedPlanet.color, 60)}, ${selectedPlanet.color})`,
                  boxShadow: `0 0 20px ${selectedPlanet.color}40`,
                }}
              >
                {selectedPlanet.emoji}
              </div>
              <div>
                <h2 className="text-lg font-bold">{selectedPlanet.name}</h2>
                <p className="text-xs text-white/40">
                  Planet #{planets.indexOf(selectedPlanet) + 1} from the Sun
                </p>
              </div>
            </div>

            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              {selectedPlanet.description}
            </p>

            <div className="space-y-2">
              <InfoRow
                label="Diameter"
                value={`${selectedPlanet.realDiameter.toLocaleString()} km`}
                icon="⊙"
                color={selectedPlanet.color}
              />
              <InfoRow
                label="Distance from Sun"
                value={`${selectedPlanet.distanceFromSun.toLocaleString()} M km`}
                icon="↔"
                color={selectedPlanet.color}
              />
              <InfoRow
                label="Orbital Period"
                value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
                icon="⟳"
                color={selectedPlanet.color}
              />
              <InfoRow
                label="Relative Speed"
                value={`${selectedPlanet.orbitalSpeed.toFixed(3)}x Earth`}
                icon="→"
                color={selectedPlanet.color}
              />
            </div>
          </div>
        )}

        {/* Install prompt */}
        {showInstallPrompt && (
          <div className="absolute bottom-20 left-3 right-3 sm:left-auto sm:right-4 sm:w-72 bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-xl rounded-2xl border border-blue-400/20 p-4 text-white shadow-2xl animate-slide-up z-40">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Install Solar System Explorer</p>
                <p className="text-xs text-white/50 mb-3">Play offline anytime, right from your home screen!</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Install
                  </button>
                  <button
                    onClick={() => setShowInstallPrompt(false)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
        <p className="text-sm font-medium text-white/90">{value}</p>
      </div>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} Earth days`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} years (${days.toLocaleString()} days)`;
}

function lightenColorStatic(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
  const b = Math.min(255, (num & 0x0000ff) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}
