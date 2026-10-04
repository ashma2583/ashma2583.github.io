/** Still lotus and reeds. Drawn every frame, but nothing here moves. */

export type Pad = { x: number; y: number; r: number; rot: number };
export type Bloom = { x: number; y: number; s: number };
export type Reeds = { x: number; y: number };

function lotusPad(ctx: CanvasRenderingContext2D, dark: boolean) {
  ctx.fillStyle = dark ? "rgba(92, 140, 124, 0.55)" : "rgba(58, 112, 92, 0.5)";
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0.55, Math.PI * 2 - 0.2);
  ctx.quadraticCurveTo(0.2, 0.15, 0, 0);
  ctx.quadraticCurveTo(-0.05, 0.2, Math.cos(0.55), Math.sin(0.55));
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = dark ? "rgba(214, 232, 220, 0.35)" : "rgba(236, 246, 236, 0.45)";
  ctx.lineWidth = 0.03;
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const a = -0.9 + i * 0.42;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 0.92, Math.sin(a) * 0.92);
  }
  ctx.stroke();
}

function lotusBloom(ctx: CanvasRenderingContext2D, dark: boolean) {
  const petal = dark ? "#F0C2B8" : "#F4D2CC";
  const tip = dark ? "#E07A78" : "#D4535A";
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i / 8) * Math.PI * 2);
    const g = ctx.createLinearGradient(0, 0, 0, -1);
    g.addColorStop(0, petal);
    g.addColorStop(1, tip);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0.22, -0.35, 0.16, -0.85, 0, -1);
    ctx.bezierCurveTo(-0.16, -0.85, -0.22, -0.35, 0, 0);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = dark ? "#E8C56A" : "#E2B84A";
  ctx.beginPath();
  ctx.arc(0, 0, 0.22, 0, Math.PI * 2);
  ctx.fill();
}

function reedCluster(ctx: CanvasRenderingContext2D, dark: boolean) {
  ctx.strokeStyle = dark ? "rgba(168, 190, 176, 0.45)" : "rgba(46, 92, 72, 0.4)";
  ctx.lineWidth = 1.25;
  ctx.lineCap = "round";
  const stems = [-10, -4, 2, 8, 14];
  for (const x of stems) {
    const h = 54 + (x % 7) * 6;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.quadraticCurveTo(x + 4, -h * 0.6, x - 2, -h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 2, -h + 8);
    ctx.quadraticCurveTo(x + 10, -h + 4, x + 16, -h + 14);
    ctx.stroke();
  }
}

export function drawGarden(
  ctx: CanvasRenderingContext2D,
  dark: boolean,
  pads: Pad[],
  blooms: Bloom[],
  reeds: Reeds[],
) {
  ctx.save();
  ctx.globalAlpha = dark ? 0.7 : 0.85;
  for (const pad of pads) {
    ctx.save();
    ctx.translate(pad.x, pad.y);
    ctx.rotate(pad.rot);
    ctx.scale(pad.r, pad.r * 0.86);
    lotusPad(ctx, dark);
    ctx.restore();
  }
  for (const bloom of blooms) {
    ctx.save();
    ctx.translate(bloom.x, bloom.y);
    ctx.scale(bloom.s, bloom.s);
    lotusBloom(ctx, dark);
    ctx.restore();
  }
  for (const clump of reeds) {
    ctx.save();
    ctx.translate(clump.x, clump.y);
    reedCluster(ctx, dark);
    ctx.restore();
  }
  ctx.restore();
}
