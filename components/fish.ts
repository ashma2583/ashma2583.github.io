export type FishKind = "red" | "white" | "gold" | "orca";

/**
 * Nose points the way the fish swims. A left turn flips the sprite
 * vertically so the belly stays down.
 */
export function placeFish(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number,
  draw: () => void,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  if (Math.cos(angle) < 0) ctx.scale(1, -1);
  ctx.scale(scale, scale);
  draw();
  ctx.restore();
}

function koiBody(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0.46, 0.015);
  ctx.bezierCurveTo(0.34, -0.11, 0.08, -0.155, -0.12, -0.11);
  ctx.bezierCurveTo(-0.28, -0.07, -0.36, -0.02, -0.34, 0.015);
  ctx.bezierCurveTo(-0.36, 0.06, -0.24, 0.125, -0.04, 0.14);
  ctx.bezierCurveTo(0.16, 0.155, 0.34, 0.095, 0.46, 0.015);
  ctx.closePath();
}

/** A solid koi. The body stays put; the tail fan is what swims. */
function drawKoi(
  ctx: CanvasRenderingContext2D,
  kind: "red" | "white" | "gold",
  wag: number,
  dark: boolean,
) {
  const swing = Math.sin(wag) * 0.48;
  const fin = Math.sin(wag + 0.6) * 0.18;
  const cream = dark ? "#F6E7D6" : "#F3E4D4";
  const ray = dark ? "rgba(196, 150, 124, 0.55)" : "rgba(176, 132, 108, 0.5)";

  ctx.save();
  ctx.translate(-0.3, 0.01);
  ctx.rotate(swing);
  ctx.fillStyle = cream;
  ctx.beginPath();
  ctx.moveTo(0.02, 0);
  ctx.quadraticCurveTo(-0.14, -0.18, -0.32, -0.2);
  ctx.quadraticCurveTo(-0.16, -0.05, 0, 0);
  ctx.quadraticCurveTo(-0.16, 0.06, -0.3, 0.2);
  ctx.quadraticCurveTo(-0.14, 0.08, 0.02, 0);
  ctx.fill();
  ctx.strokeStyle = ray;
  ctx.lineWidth = 0.012;
  ctx.beginPath();
  for (const [x, y] of [
    [-0.28, -0.16],
    [-0.3, -0.08],
    [-0.28, 0.08],
    [-0.26, 0.16],
  ]) {
    ctx.moveTo(-0.02, 0);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = cream;
  ctx.save();
  ctx.translate(-0.02, -0.12);
  ctx.rotate(swing * 0.15);
  ctx.beginPath();
  ctx.moveTo(-0.08, 0.02);
  ctx.quadraticCurveTo(0.02, -0.16, 0.16, 0);
  ctx.quadraticCurveTo(0.02, -0.02, -0.08, 0.02);
  ctx.fill();
  ctx.restore();

  koiBody(ctx);
  ctx.fillStyle = cream;
  ctx.fill();

  ctx.save();
  koiBody(ctx);
  ctx.clip();
  if (kind === "red") {
    ctx.fillStyle = dark ? "#F07830" : "#F26A28";
    ctx.beginPath();
    ctx.moveTo(0.22, -0.08);
    ctx.bezierCurveTo(0.05, -0.2, -0.22, -0.16, -0.28, -0.02);
    ctx.bezierCurveTo(-0.1, 0.02, 0.08, 0.06, 0.2, 0.02);
    ctx.bezierCurveTo(0.28, -0.02, 0.3, -0.04, 0.22, -0.08);
    ctx.fill();
    ctx.fillStyle = "#1C1C1C";
    ctx.beginPath();
    ctx.ellipse(-0.02, -0.1, 0.1, 0.055, -0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "gold") {
    ctx.fillStyle = dark ? "#E8A63A" : "#E39A2E";
    ctx.beginPath();
    ctx.ellipse(0.02, -0.02, 0.24, 0.12, -0.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = dark ? "#E25A48" : "#D64532";
    ctx.beginPath();
    ctx.ellipse(-0.08, -0.04, 0.09, 0.05, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0.1, 0.04, 0.06, 0.035, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(0.12, 0.08);
  ctx.rotate(0.55 + fin);
  ctx.fillStyle = cream;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(0.1, 0.08, 0.22, 0.16);
  ctx.quadraticCurveTo(0.06, 0.08, 0, 0.02);
  ctx.fill();
  ctx.strokeStyle = ray;
  ctx.lineWidth = 0.01;
  ctx.beginPath();
  ctx.moveTo(0.02, 0.02);
  ctx.lineTo(0.16, 0.12);
  ctx.moveTo(0.02, 0.03);
  ctx.lineTo(0.1, 0.14);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = dark ? "rgba(230, 210, 190, 0.7)" : "rgba(90, 60, 40, 0.45)";
  ctx.lineWidth = 0.01;
  ctx.beginPath();
  ctx.moveTo(0.38, 0.04);
  ctx.quadraticCurveTo(0.46, 0.08, 0.44, 0.12);
  ctx.stroke();

  ctx.fillStyle = "#1A140F";
  ctx.beginPath();
  ctx.arc(0.3, -0.02, 0.022, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(0.306, -0.026, 0.007, 0, Math.PI * 2);
  ctx.fill();
}

/** Side-view orca: solid body, white eye patch and belly, flukes that beat. */
function drawOrca(ctx: CanvasRenderingContext2D, wag: number, dark: boolean) {
  const swing = Math.sin(wag) * 0.32;
  const ink = dark ? "#1E3344" : "#173044";
  const paper = "#F4F7F8";

  ctx.save();
  ctx.translate(-0.46, 0.02);
  ctx.rotate(swing);
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.moveTo(0.06, 0);
  ctx.quadraticCurveTo(-0.06, -0.14, -0.2, -0.08);
  ctx.quadraticCurveTo(-0.08, -0.02, 0.02, 0);
  ctx.quadraticCurveTo(-0.08, 0.04, -0.22, 0.1);
  ctx.quadraticCurveTo(-0.08, 0.05, 0.06, 0);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.moveTo(0.5, 0.015);
  ctx.bezierCurveTo(0.36, -0.11, 0.1, -0.175, -0.1, -0.13);
  ctx.bezierCurveTo(-0.3, -0.08, -0.46, -0.015, -0.46, 0.03);
  ctx.bezierCurveTo(-0.42, 0.095, -0.18, 0.16, 0.06, 0.13);
  ctx.bezierCurveTo(0.26, 0.12, 0.4, 0.065, 0.5, 0.015);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = paper;
  ctx.beginPath();
  ctx.moveTo(0.3, 0.025);
  ctx.bezierCurveTo(0.14, 0.125, -0.12, 0.145, -0.32, 0.065);
  ctx.quadraticCurveTo(-0.14, 0.11, 0.08, 0.095);
  ctx.quadraticCurveTo(0.22, 0.065, 0.3, 0.025);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(0.2, -0.02, 0.11, 0.048, -0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.moveTo(-0.04, -0.15);
  ctx.quadraticCurveTo(0.04, -0.4, 0.16, -0.1);
  ctx.quadraticCurveTo(0.05, -0.13, -0.04, -0.15);
  ctx.fill();

  ctx.save();
  ctx.translate(0.06, 0.08);
  ctx.rotate(0.85 + Math.sin(wag) * 0.1);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-0.02, 0.14, 0.04, 0.28);
  ctx.quadraticCurveTo(0.08, 0.12, 0, 0);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(0.26, -0.015, 0.015, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = paper;
  ctx.beginPath();
  ctx.arc(0.264, -0.02, 0.005, 0, Math.PI * 2);
  ctx.fill();
}

export function drawFish(
  ctx: CanvasRenderingContext2D,
  kind: FishKind,
  wag: number,
  _bend: number,
  dark: boolean,
) {
  if (kind === "orca") drawOrca(ctx, wag, dark);
  else drawKoi(ctx, kind, wag, dark);
}
