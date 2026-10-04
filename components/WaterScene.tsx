"use client";

import { useEffect, useRef } from "react";
import { drawFish, placeFish, type FishKind } from "@/components/fish";
import { drawGarden, type Bloom, type Pad, type Reeds } from "@/components/garden";

/**
 * A school of small carp, and one orca that stays larger and deeper.
 * They bend through the body as they swim, and they keep off the cursor.
 * Pressing the seal calls them across the page for a moment.
 */

type Fish = {
  kind: FishKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  bend: number;
  /** Tail phase. Advanced every frame so a speed change cannot snap it. */
  wag: number;
  /** When this fish last struck the water polo ball. */
  lastHit: number;
  phase: number;
  ox: number;
  oy: number;
  maxSpeed: number;
  scale: number;
  lane: number;
};

type Ripple = { x: number; y: number; born: number; life: number };

const SCHOOL: { kind: FishKind; phase: number; ox: number; oy: number; speed: number; lane: number }[] = [
  { kind: "red", phase: 0.2, ox: -70, oy: -28, speed: 168, lane: -1 },
  { kind: "white", phase: 1.1, ox: -36, oy: 34, speed: 154, lane: 0 },
  { kind: "gold", phase: 2.0, ox: 18, oy: -46, speed: 176, lane: 1 },
  { kind: "red", phase: 2.8, ox: 64, oy: 18, speed: 150, lane: -1 },
  { kind: "white", phase: 3.6, ox: 96, oy: -22, speed: 160, lane: 1 },
  { kind: "gold", phase: 4.4, ox: -96, oy: 8, speed: 146, lane: 0 },
  { kind: "red", phase: 5.2, ox: 28, oy: 52, speed: 172, lane: -1 },
  { kind: "white", phase: 6.0, ox: -18, oy: -58, speed: 158, lane: 1 },
  { kind: "orca", phase: 0.6, ox: 30, oy: 150, speed: 92, lane: 0 },
];

function idleTarget(fish: Fish, t: number, w: number, h: number) {
  const deep = fish.kind === "orca" ? 0.08 : 0;
  return {
    x: w * (0.5 + 0.38 * Math.sin(t * 0.1 + fish.phase)),
    y: h * (0.42 + deep + 0.28 * Math.cos(t * 0.08 + fish.phase * 1.3)),
  };
}

export default function WaterScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    let reduced = motion.matches;
    let dark = scheme.matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let interest = 0;
    let still = 0;
    let surfaceStart = -20;
    let surfaceScale = 1;
    let laneStart = -30;
    let laneY = 0;
    let poloStart = -30;
    let ballX = 0;
    let ballY = 0;
    let ballVx = 0;
    let ballVy = 0;
    let ballHits = 0;
    let ballFade = 1;

    const pointer = { x: 0, y: 0, sx: 0, sy: 0, lx: 0, ly: 0, inside: false };
    const ripples: Ripple[] = [];
    let pads: Pad[] = [];
    let blooms: Bloom[] = [];
    let reeds: Reeds[] = [];

    const fishes: Fish[] = SCHOOL.map((item) => ({
      kind: item.kind,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0.2,
      bend: 0,
      wag: item.phase,
      lastHit: 0,
      phase: item.phase,
      ox: item.ox,
      oy: item.oy,
      maxSpeed: item.speed,
      scale: item.kind === "orca" ? 96 : 36,
      lane: item.lane,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      const koi = Math.min(72, Math.max(46, width * 0.046));
      for (const fish of fishes) {
        fish.scale = fish.kind === "orca" ? koi * 2.35 : koi * (0.92 + (fish.phase % 1) * 0.16);
      }

      const narrow = width < 760;
      const k = narrow ? 0.62 : 1;
      pads = [
        { x: 58 * k, y: height - 52, r: 48 * k, rot: -0.5 },
        { x: 118 * k, y: height - 108, r: 34 * k, rot: 0.4 },
        { x: width - 52 * k, y: height - 64, r: 42 * k, rot: 0.25 },
      ];
      blooms = [{ x: 86 * k, y: height - 150 * k, s: 20 * k }];
      reeds = [
        { x: 16, y: height * 0.7 },
        { x: width - 18, y: height * 0.56 },
      ];
    };

    const placeIdle = (t: number) => {
      for (const fish of fishes) {
        const p = idleTarget(fish, t, width, height);
        fish.x = p.x;
        fish.y = p.y;
      }
    };

    const steer = (fish: Fish, tx: number, ty: number, dt: number) => {
      const dx = tx - fish.x;
      const dy = ty - fish.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const speed = fish.maxSpeed * Math.min(1, dist / 140);
      const ease = 1 - Math.exp(-2.4 * dt);
      fish.vx += ((dx / dist) * speed - fish.vx) * ease;
      fish.vy += ((dy / dist) * speed - fish.vy) * ease;
      fish.x += fish.vx * dt;
      fish.y += fish.vy * dt;

      const moving = Math.hypot(fish.vx, fish.vy);
      if (moving > 8) {
        const target = Math.atan2(fish.vy, fish.vx);
        let delta = target - fish.angle;
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        const cap = (fish.kind === "orca" ? 1.1 : 1.6) * dt;
        const step = Math.max(-cap, Math.min(cap, delta));
        if (Math.abs(delta) > 0.18) {
          fish.angle += step;
          const wanted = Math.max(-0.45, Math.min(0.45, step / Math.max(dt, 0.001) / 8));
          fish.bend += (wanted - fish.bend) * Math.min(1, dt * 1.5);
        } else {
          fish.bend += (0 - fish.bend) * Math.min(1, dt * 2);
        }
      } else {
        fish.bend += (0 - fish.bend) * Math.min(1, dt * 2);
      }
    };

    const paint = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        const age = (t - ripple.born) / ripple.life;
        if (age >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        const alpha = (1 - age) * 0.3;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, 6 + age * (ripple.life > 1 ? 120 : 72), 0, Math.PI * 2);
        ctx.strokeStyle = dark ? `rgba(158, 195, 219, ${alpha})` : `rgba(27, 79, 114, ${alpha})`;
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }

      drawGarden(ctx, dark, pads, blooms, reeds);

      const laneAge = t - laneStart;
      if (laneAge >= 0 && laneAge < 3.2) {
        const u = laneAge / 3.2;
        const fade = u < 0.06 ? u / 0.06 : u > 0.86 ? Math.max(0, (1 - u) / 0.14) : 1;
        const rope = (y: number) => {
          ctx.beginPath();
          ctx.strokeStyle = dark ? "rgba(210, 224, 232, 0.45)" : "rgba(40, 70, 96, 0.35)";
          ctx.lineWidth = 2;
          ctx.moveTo(12, y);
          ctx.lineTo(width - 12, y);
          ctx.stroke();
          const gap = 18;
          for (let x = 18; x < width - 12; x += gap) {
            const endZone = x < width * 0.12 || x > width * 0.88;
            const alt = Math.floor(x / gap) % 2 === 0;
            ctx.fillStyle = endZone ? "#E23B2E" : alt ? "#F7F8F6" : "#1B4F8A";
            ctx.beginPath();
            ctx.arc(x, y, 6.5, 0, Math.PI * 2);
            ctx.fill();
          }
        };
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.fillStyle = dark ? "rgba(24, 92, 150, 0.28)" : "rgba(86, 168, 214, 0.22)";
        ctx.fillRect(12, laneY - 34, width - 24, 68);
        rope(laneY - 34);
        rope(laneY + 34);
        ctx.restore();
      }

      const poloAge = t - poloStart;
      if (poloAge >= 0 && poloAge < 4.2 && ballFade > 0.02) {
        const radius = 17 * (0.55 + 0.45 * ballFade);
        ctx.save();
        ctx.globalAlpha = ballFade;
        ctx.fillStyle = "#F5D000";
        ctx.beginPath();
        ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1A1A1A";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ballX - radius * 0.15, ballY, radius * 0.72, -1.1, 1.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ballX + radius * 0.2, ballY, radius * 0.72, Math.PI - 1.05, Math.PI + 1.05);
        ctx.stroke();
        ctx.restore();
      }

      const ordered = [...fishes].sort((a, b) => a.y - b.y);
      for (const fish of ordered) {
        const alpha = fish.kind === "orca" ? (dark ? 0.94 : 0.88) : 0.9;
        const rise = fish.kind === "orca" ? surfaceScale : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        placeFish(ctx, fish.x, fish.y, fish.angle, fish.scale * rise, () => {
          drawFish(ctx, fish.kind, fish.wag, fish.bend, dark);
        });
        ctx.restore();
      }
    };

    resize();
    placeIdle(0);
    pointer.sx = width * 0.5;
    pointer.sy = height * 0.45;

    const frame = (now: number) => {
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const surfaceAge = t - surfaceStart;
      const surfacing = surfaceAge >= 0 && surfaceAge < 4.6;
      const surfaceU = surfacing ? surfaceAge / 4.6 : 0;
      surfaceScale = surfacing ? 1 + 1.05 * Math.sin(surfaceU * Math.PI) : 1;
      const laneAge = t - laneStart;
      const laning = laneAge >= 0 && laneAge < 3.2;
      const poloAge = t - poloStart;
      const poloing = poloAge >= 0 && poloAge < 4.2;
      let orcaX = width * 0.5;
      let orcaY = height + 80;
      if (surfacing) {
        const span = Math.max(120, width - 48);
        const rise = Math.min(height * 0.62, 520);
        orcaX = 24 + span * surfaceU;
        orcaY = height + 48 - Math.sin(surfaceU * Math.PI) * rise;
      }

      const goal = pointer.inside ? 1 : 0;
      interest += (goal - interest) * Math.min(1, dt * 2.4);
      pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 5);
      pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 5);
      const moved = Math.hypot(pointer.x - pointer.lx, pointer.y - pointer.ly);
      pointer.lx = pointer.x;
      pointer.ly = pointer.y;
      if (!pointer.inside || moved > 2.5) still = Math.max(0, still - dt * 4);
      else still = Math.min(1, still + dt * 2.2);

      const top = 72;
      const margin = 24;
      const spread = Math.min(1, Math.max(0.7, width / 1100));

      for (const fish of fishes) {
        const idle = idleTarget(fish, t, width, height);
        const sway = t * 0.4 + fish.phase;
        let fx = pointer.sx + fish.ox * spread + Math.sin(sway) * 6;
        let fy = pointer.sy + fish.oy * spread + Math.cos(sway * 0.8) * 4;
        fx = Math.min(width - margin, Math.max(margin, fx));
        fy = Math.min(height - margin, Math.max(top, fy));
        let tx = idle.x + (fx - idle.x) * interest;
        let ty = idle.y + (fy - idle.y) * interest;

        if (still > 0.02 && interest > 0.35 && !surfacing && !laning && !poloing) {
          const orca = fish.kind === "orca";
          const radius = (orca ? 176 : 78 + (fish.lane + 1) * 28) * spread;
          const dist = Math.hypot(fish.x - pointer.sx, fish.y - pointer.sy);
          const close = Math.min(1, Math.max(0, (radius + 56 - dist) / 90));
          const weight = still * close;
          if (weight > 0) {
            const bearing = Math.atan2(fish.y - pointer.sy, fish.x - pointer.sx);
            const lead = orca ? 0.4 : 0.72;
            const dir = bearing + lead;
            const cx = Math.min(width - margin, Math.max(margin, pointer.sx + Math.cos(dir) * radius));
            const cy = Math.min(height - margin, Math.max(top, pointer.sy + Math.sin(dir) * radius));
            tx += (cx - tx) * weight;
            ty += (cy - ty) * weight;
          }
        }

        if (laning && fish.kind !== "orca") {
          const delay = (fish.phase % 1) * 0.18;
          const u = Math.min(1, Math.max(0, (laneAge - delay) / 1.65));
          const along = u * u * (3 - 2 * u);
          fish.x = -30 + (width + 60) * along;
          fish.y = laneY + fish.lane * 14;
          fish.angle = 0;
          fish.vx = width / 1.7;
          fish.vy = 0;
        } else if (poloing && fish.kind !== "orca" && ballFade > 0.2) {
          tx = ballX;
          ty = ballY;
          steer(fish, tx, ty, dt);
          const dx = ballX - fish.x;
          const dy = ballY - fish.y;
          const reach = fish.scale * 0.42 + 17;
          if (Math.hypot(dx, dy) < reach && t - fish.lastHit > 0.28) {
            fish.lastHit = t;
            ballVx += Math.cos(fish.angle) * 340;
            ballVy += Math.sin(fish.angle) * 340;
            ballHits += 1;
          }
        } else if (fish.kind === "orca" && surfacing) {
          const span = Math.max(120, width - 48);
          const rise = Math.min(height * 0.62, 520);
          fish.x = orcaX;
          fish.y = orcaY;
          fish.angle = Math.atan2(-Math.cos(surfaceU * Math.PI) * Math.PI * rise, span);
          fish.vx = 0;
          fish.vy = 0;
        } else if (surfacing) {
          const awayX = fish.x - orcaX;
          const awayY = fish.y - orcaY;
          const dist = Math.hypot(awayX, awayY) || 1;
          const push = Math.max(0, 1 - dist / 240) * Math.sin(surfaceU * Math.PI);
          tx += (awayX / dist) * 220 * push;
          ty += (awayY / dist) * 220 * push;
          steer(fish, tx, ty, dt);
        } else {
          steer(fish, tx, ty, dt);
        }

        const moving = Math.hypot(fish.vx, fish.vy);
        const sprint = (laning || poloing) && fish.kind !== "orca" ? 4.4 : 0;
        fish.wag += dt * (3.6 + sprint + Math.min(moving, 140) / 80);
      }

      if (poloing) {
        const speed = Math.hypot(ballVx, ballVy);
        const sinking = (ballHits > 0 && speed < 50 && poloAge > 0.7) || poloAge > 3.3;
        if (sinking) ballVy += 220 * dt;
        ballX += ballVx * dt;
        ballY += ballVy * dt;
        ballVx *= Math.exp(-2.4 * dt);
        ballVy *= Math.exp(-1.6 * dt);
        ballFade = sinking ? Math.max(0, ballFade - dt * 0.7) : 1;
      }

      paint(t);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduced) {
        placeIdle(0);
        for (const fish of fishes) {
          fish.vx = 0;
          fish.vy = 0;
          fish.bend = 0;
        }
        paint(0);
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    const onDown = (event: PointerEvent) => {
      if (reduced) return;
      const target = event.target as Element | null;
      if (target?.closest(".seal-hit") || target?.closest(".water-egg")) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      ripples.push({ x: event.clientX, y: event.clientY, born: performance.now() / 1000, life: 1.05 });
      if (ripples.length > 4) ripples.shift();
    };
    const quietOthers = (keep: "surface" | "lane" | "polo") => {
      if (keep !== "surface") surfaceStart = -20;
      if (keep !== "lane") laneStart = -30;
      if (keep !== "polo") poloStart = -30;
    };
    const onSeal = (event: Event) => {
      if (reduced) return;
      const detail = (event as CustomEvent<{ x: number; y: number }>).detail;
      quietOthers("surface");
      surfaceStart = performance.now() / 1000;
      ripples.push({ x: detail.x, y: detail.y, born: surfaceStart, life: 1.15 });
    };
    const onLane = (event: Event) => {
      if (reduced) return;
      const detail = (event as CustomEvent<{ x: number; y: number }>).detail;
      quietOthers("lane");
      laneStart = performance.now() / 1000;
      laneY = detail.y;
    };
    const onPolo = (event: Event) => {
      if (reduced) return;
      const detail = (event as CustomEvent<{ x: number; y: number }>).detail;
      quietOthers("polo");
      poloStart = performance.now() / 1000;
      ballX = detail.x;
      ballY = detail.y;
      ballVx = 0;
      ballVy = 0;
      ballHits = 0;
      ballFade = 1;
    };
    const onResize = () => {
      resize();
      if (reduced) {
        placeIdle(0);
        paint(0);
      }
    };
    const onMotion = () => {
      reduced = motion.matches;
      start();
    };
    const onScheme = () => {
      dark = scheme.matches;
      if (reduced) paint(0);
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("water-seal", onSeal);
    window.addEventListener("water-lane", onLane);
    window.addEventListener("water-polo", onPolo);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    motion.addEventListener("change", onMotion);
    scheme.addEventListener("change", onScheme);
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("water-seal", onSeal);
      window.removeEventListener("water-lane", onLane);
      window.removeEventListener("water-polo", onPolo);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      motion.removeEventListener("change", onMotion);
      scheme.removeEventListener("change", onScheme);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[1]" />;
}
