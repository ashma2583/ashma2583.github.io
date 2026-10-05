/** Small, bounded water effects shared by the swimming interactions. */
export type WakePoint = { x: number; y: number; angle: number; scale: number; born: number };
export type Ripple = { x: number; y: number; born: number; life: number; strength: number };
export type Bubble = { x: number; y: number; vx: number; vy: number; r: number; born: number; life: number };

export function drawRipple(ctx: CanvasRenderingContext2D, ripple: Ripple, time: number, dark: boolean) {
  const age = Math.max(0, (time - ripple.born) / ripple.life);
  const radius = 6 + (1 - Math.pow(1 - age, 2)) * (ripple.life > 1 ? 112 : 66);
  ctx.save();
  ctx.lineWidth = 0.8;
  for (let ring = 0; ring < 3; ring++) {
    const r = radius - ring * (4 + age * 5);
    if (r <= 0) continue;
    const alpha = Math.pow(1 - age, 2) * ripple.strength * (ring === 0 ? 0.3 : 0.13);
    ctx.strokeStyle = dark ? `rgba(158, 195, 219, ${alpha})` : `rgba(64, 109, 129, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(ripple.x, ripple.y, r, r * 0.82, -0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(244, 247, 231, ${alpha * 1.5})`;
    ctx.beginPath();
    ctx.ellipse(ripple.x, ripple.y - 1, r, r * 0.82, -0.12, Math.PI * 1.15, Math.PI * 1.8);
    ctx.stroke();
  }
  ctx.restore();
}

/** Two widening ribbons record the actual path and fade within a second. */
export function drawWake(ctx: CanvasRenderingContext2D, points: WakePoint[], time: number, dark: boolean, deep: boolean) {
  if (points.length < 2) return;
  ctx.save();
  ctx.lineWidth = deep ? 1 : 0.7;
  ctx.lineCap = "round";
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const age = time - b.born;
    const fade = Math.max(0, 1 - age / 1.1);
    const alpha = fade * fade * (deep ? 0.09 : 0.15);
    ctx.strokeStyle = dark ? `rgba(158, 195, 219, ${alpha})` : `rgba(75, 117, 131, ${alpha})`;
    for (const side of [-1, 1]) {
      const spreadA = a.scale * 0.08 + (time - a.born) * 9;
      const spreadB = b.scale * 0.08 + age * 9;
      ctx.beginPath();
      ctx.moveTo(a.x - Math.sin(a.angle) * spreadA * side, a.y + Math.cos(a.angle) * spreadA * side);
      ctx.lineTo(b.x - Math.sin(b.angle) * spreadB * side, b.y + Math.cos(b.angle) * spreadB * side);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawFishShadow(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, dark: boolean) {
  ctx.save();
  ctx.translate(x + scale * 0.025, y + scale * 0.08);
  ctx.rotate(angle);
  ctx.scale(scale * 0.65, scale * 0.23);
  const shade = ctx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
  shade.addColorStop(0, dark ? "rgba(0, 6, 12, 0.24)" : "rgba(42, 69, 67, 0.11)");
  shade.addColorStop(1, "rgba(42, 69, 67, 0)");
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawBubbles(ctx: CanvasRenderingContext2D, bubbles: Bubble[], time: number, dark: boolean) {
  ctx.save();
  ctx.lineWidth = 0.65;
  for (const bubble of bubbles) {
    const fade = Math.max(0, 1 - (time - bubble.born) / bubble.life);
    ctx.strokeStyle = dark ? `rgba(176, 215, 231, ${fade * 0.46})` : `rgba(82, 129, 144, ${fade * 0.4})`;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.r * (0.7 + fade * 0.3), 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(251, 252, 239, ${fade * 0.65})`;
    ctx.beginPath();
    ctx.arc(bubble.x - bubble.r * 0.28, bubble.y - bubble.r * 0.35, bubble.r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
