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

  // Center of the canvas
  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;

  // Scale orbit radii based on canvas size
  const getScale = useCallback(() => {
    const minDim = Math.min(canvasSize.width, canvasSize.height);
    return minDim / 900;
  }, [canvasSize]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        setCanvasSize({ width, height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw the solar system
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, timestamp: number) => {
      const scale = getScale();
      const cx = canvasSize.width / 2;
      const cy = canvasSize.height / 2;

      // Clear canvas
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw stars background
      drawStars(ctx, canvasSize.width, canvasSize.height);

      // Draw orbit paths
      planets.forEach((planet) => {
        ctx.beginPath();
        ctx.arc(cx, cy, planet.orbitRadius * scale, 0, Math.PI * 2);
        ctx.strokeStyle =
          hoveredPlanet === planet.name
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = hoveredPlanet === planet.name ? 1.5 : 0.5;
        ctx.stroke();
      });

      // Draw Sun
      drawSun(ctx, cx, cy, scale);

      // Draw planets
      planets.forEach((planet, index) => {
        const angle = anglesRef.current[index];
        const orbitR = planet.orbitRadius * scale;
        const x = cx + Math.cos(angle) * orbitR;
        const y = cy + Math.sin(angle) * orbitR;
        const r = Math.max(planet.radius * scale * 0.5, 3);

        // Planet glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
        gradient.addColorStop(0, planet.color + "60");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        const planetGradient = ctx.createRadialGradient(
          x - r * 0.3,
          y - r * 0.3,
          0,
          x,
          y,
          r
        );
        planetGradient.addColorStop(0, lightenColor(planet.color, 40));
        planetGradient.addColorStop(1, planet.color);
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Saturn's rings
        if (planet.name === "Saturn") {
          ctx.beginPath();
          ctx.ellipse(x, y, r * 2, r * 0.5, -0.3, 0, Math.PI * 2);
          ctx.strokeStyle = "#f0d68a80";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Selection highlight
        if (selectedPlanet?.name === planet.name) {
          ctx.beginPath();
          ctx.arc(x, y, r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Hover highlight
        if (hoveredPlanet === planet.name) {
          ctx.beginPath();
          ctx.arc(x, y, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Planet labels
        if (showLabels) {
          ctx.fillStyle =
            hoveredPlanet === planet.name || selectedPlanet?.name === planet.name
              ? "#ffffff"
              : "rgba(255, 255, 255, 0.7)";
          ctx.font = `${hoveredPlanet === planet.name ? "bold " : ""}${Math.max(10, 11 * scale)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(planet.name, x, y - r - 8);
        }
      });

      // Update angles if playing
      if (isPlaying) {
        const dt = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0;
        planets.forEach((planet, index) => {
          anglesRef.current[index] += planet.orbitalSpeed * speed * dt * 0.5;
        });
      }
      lastTimeRef.current = timestamp;
    },
    [canvasSize, getScale, hoveredPlanet, selectedPlanet, isPlaying, speed, showLabels]
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = (timestamp: number) => {
      draw(ctx, timestamp);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  // Star field (static, drawn each frame for simplicity)
  const starsRef = useRef<{ x: number; y: number; r: number; b: number }[]>([]);
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.5,
        b: Math.random() * 0.5 + 0.5,
      });
    }
    starsRef.current = stars;
  }, []);

  function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number) {
    starsRef.current.forEach((star) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.b})`;
      ctx.beginPath();
      ctx.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
    const sunRadius = 30 * scale;

    // Sun outer glow
    const outerGlow = ctx.createRadialGradient(cx, cy, sunRadius * 0.5, cx, cy, sunRadius * 3);
    outerGlow.addColorStop(0, "rgba(255, 200, 50, 0.3)");
    outerGlow.addColorStop(0.5, "rgba(255, 150, 0, 0.1)");
    outerGlow.addColorStop(1, "transparent");
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Sun body
    const sunGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunRadius);
    sunGradient.addColorStop(0, "#fff5d0");
    sunGradient.addColorStop(0.3, "#ffcc00");
    sunGradient.addColorStop(0.7, "#ff9900");
    sunGradient.addColorStop(1, "#ff6600");
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Sun corona
    const coronaGradient = ctx.createRadialGradient(cx, cy, sunRadius, cx, cy, sunRadius * 1.5);
    coronaGradient.addColorStop(0, "rgba(255, 180, 0, 0.4)");
    coronaGradient.addColorStop(1, "transparent");
    ctx.fillStyle = coronaGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
    const b = Math.min(255, (num & 0x0000ff) + percent);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Click handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scale = getScale();
    const cx = canvasSize.width / 2;
    const cy = canvasSize.height / 2;

    let clicked: Planet | null = null;

    planets.forEach((planet, index) => {
      const angle = anglesRef.current[index];
      const orbitR = planet.orbitRadius * scale;
      const px = cx + Math.cos(angle) * orbitR;
      const py = cy + Math.sin(angle) * orbitR;
      const r = Math.max(planet.radius * scale * 0.5, 3);
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= r + 10) {
        clicked = planet;
      }
    });

    setSelectedPlanet(clicked);
  };

  // Mouse move handler for hover
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scale = getScale();
    const cx = canvasSize.width / 2;
    const cy = canvasSize.height / 2;

    let hovered: string | null = null;

    planets.forEach((planet, index) => {
      const angle = anglesRef.current[index];
      const orbitR = planet.orbitRadius * scale;
      const px = cx + Math.cos(angle) * orbitR;
      const py = cy + Math.sin(angle) * orbitR;
      const r = Math.max(planet.radius * scale * 0.5, 3);
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= r + 10) {
        hovered = planet.name;
      }
    });

    setHoveredPlanet(hovered);
    canvas.style.cursor = hovered ? "pointer" : "default";
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-[#0d0d2b] to-[#1a1a3e] border-b border-white/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☀️</span>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Solar System Explorer
              </h1>
              <p className="text-xs text-white/50">
                Interactive orbital simulation — click any planet to learn more
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded accent-blue-500"
              />
              Labels
            </label>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Canvas area */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full"
          />

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-5 py-3 border border-white/10">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3" y="2" width="4" height="12" rx="1" />
                  <rect x="9" y="2" width="4" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <polygon points="3,1 14,8 3,15" />
                </svg>
              )}
            </button>

            {/* Speed control */}
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs font-medium">Speed</span>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 h-1.5 accent-blue-500 cursor-pointer"
              />
              <span className="text-white text-xs font-mono w-10 text-center">
                {speed.toFixed(1)}x
              </span>
            </div>

            {/* Speed presets */}
            <div className="flex gap-1">
              {[0.5, 1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    speed === s
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {selectedPlanet && (
          <div className="absolute top-4 right-4 w-80 bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-white shadow-2xl animate-slide-in">
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lightenColorStatic(selectedPlanet.color, 60)}, ${selectedPlanet.color})`,
                  boxShadow: `0 0 20px ${selectedPlanet.color}40`,
                }}
              >
                {selectedPlanet.emoji}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedPlanet.name}</h2>
                <p className="text-xs text-white/50">
                  Planet #{planets.indexOf(selectedPlanet) + 1} from the Sun
                </p>
              </div>
            </div>

            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              {selectedPlanet.description}
            </p>

            <div className="space-y-3">
              <InfoRow
                label="Diameter"
                value={`${selectedPlanet.realDiameter.toLocaleString()} km`}
                icon="⊙"
              />
              <InfoRow
                label="Distance from Sun"
                value={`${selectedPlanet.distanceFromSun.toLocaleString()} million km`}
                icon="↔"
              />
              <InfoRow
                label="Orbital Period"
                value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
                icon="⟳"
              />
              <InfoRow
                label="Relative Speed"
                value={`${selectedPlanet.orbitalSpeed.toFixed(3)}x Earth`}
                icon="→"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
      <span className="text-lg opacity-60">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
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
  return `${years} Earth years (${days.toLocaleString()} days)`;
}

function lightenColorStatic(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
  const b = Math.min(255, (num & 0x0000ff) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}
