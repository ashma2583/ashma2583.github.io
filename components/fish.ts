export type FishKind = "red" | "white" | "gold" | "orca";

/** Keep the illustrated belly underneath the fish when it changes direction. */
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
  // Bank through a vertical heading so the belly changes sides without a snap.
  const facing = Math.cos(angle);
  ctx.scale(1, facing / Math.sqrt(facing * facing + 0.012));
  ctx.scale(scale, scale);
  draw();
  ctx.restore();
}

/** The traveling wave deforms the outline, markings, scales, and fins together. */
function makeSpine(wag: number, bend: number, effort: number, orca: boolean) {
  return (x: number) => {
    const u = Math.max(0, Math.min(1, (0.36 - x) / 0.85));
    const amplitude = orca ? 0.022 + effort * 0.024 : 0.035 + effort * 0.05;
    return u * u * (Math.sin(wag - u * 3.2) * amplitude + bend * 0.55);
  };
}

type Spine = ReturnType<typeof makeSpine>;

function skin(ctx: CanvasRenderingContext2D, spine: Spine) {
  return {
    move(x: number, y: number) { ctx.moveTo(x, y + spine(x)); },
    line(x: number, y: number) { ctx.lineTo(x, y + spine(x)); },
    curve(x1: number, y1: number, x2: number, y2: number, x: number, y: number) {
      ctx.bezierCurveTo(x1, y1 + spine(x1), x2, y2 + spine(x2), x, y + spine(x));
    },
    quad(x1: number, y1: number, x: number, y: number) {
      ctx.quadraticCurveTo(x1, y1 + spine(x1), x, y + spine(x));
    },
  };
}

function atSpine(ctx: CanvasRenderingContext2D, spine: Spine, x: number, y: number, draw: () => void) {
  ctx.save();
  ctx.translate(x, y + spine(x));
  ctx.rotate(Math.atan2(spine(x + 0.01) - spine(x - 0.01), 0.02));
  draw();
  ctx.restore();
}

function koiBody(ctx: CanvasRenderingContext2D, spine: Spine) {
  const p = skin(ctx, spine);
  ctx.beginPath();
  p.move(0.47, -0.005);
  p.curve(0.44, -0.07, 0.31, -0.145, 0.15, -0.157);
  p.curve(-0.08, -0.185, -0.25, -0.105, -0.44, -0.028);
  p.quad(-0.48, 0, -0.44, 0.028);
  p.curve(-0.28, 0.055, -0.17, 0.153, 0.08, 0.163);
  p.curve(0.28, 0.17, 0.4, 0.095, 0.47, 0.025);
  p.quad(0.49, 0.012, 0.47, -0.005);
  ctx.closePath();
}

/** Translucent membranes with curved fin rays and a soft trailing edge. */
function koiTail(ctx: CanvasRenderingContext2D, spine: Spine, wag: number, gold: boolean) {
  atSpine(ctx, spine, -0.435, 0, () => {
    ctx.rotate(Math.sin(wag - 3.4) * 0.22);
    const fill = ctx.createLinearGradient(0, 0, -0.34, 0);
    fill.addColorStop(0, gold ? "rgba(194, 134, 42, 0.92)" : "rgba(188, 160, 133, 0.82)");
    fill.addColorStop(0.5, gold ? "rgba(237, 193, 104, 0.7)" : "rgba(239, 226, 205, 0.8)");
    fill.addColorStop(1, "rgba(248, 239, 222, 0.32)");
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0.025, -0.024);
    ctx.bezierCurveTo(-0.09, -0.038, -0.17, -0.205, -0.34, -0.225);
    ctx.bezierCurveTo(-0.315, -0.13, -0.22, -0.035, -0.19, 0);
    ctx.bezierCurveTo(-0.22, 0.055, -0.31, 0.15, -0.33, 0.224);
    ctx.bezierCurveTo(-0.17, 0.205, -0.09, 0.058, 0.025, 0.024);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(140, 110, 75, 0.3)";
    ctx.lineWidth = 0.006;
    ctx.stroke();
    ctx.beginPath();
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 6; i++) {
        const y = side * (0.04 + i * 0.032);
        ctx.moveTo(0, side * 0.012);
        ctx.quadraticCurveTo(-0.15, y * 0.36, -0.24 - i * 0.014, y);
      }
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 251, 236, 0.52)";
    ctx.beginPath();
    ctx.moveTo(-0.015, -0.015);
    ctx.quadraticCurveTo(-0.15, -0.1, -0.3, -0.19);
    ctx.stroke();
  });
}

function koiFin(ctx: CanvasRenderingContext2D, gold: boolean, flutter: number, size: number) {
  ctx.save();
  ctx.rotate(flutter);
  ctx.scale(size, size);
  const fill = ctx.createLinearGradient(0, 0, -0.07, 0.21);
  fill.addColorStop(0, gold ? "rgba(201, 145, 49, 0.9)" : "rgba(199, 174, 143, 0.88)");
  fill.addColorStop(1, "rgba(248, 238, 216, 0.38)");
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0.025, 0);
  ctx.bezierCurveTo(0.05, 0.11, -0.065, 0.235, -0.18, 0.22);
  ctx.quadraticCurveTo(-0.13, 0.085, -0.025, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(139, 109, 72, 0.32)";
  ctx.lineWidth = 0.005;
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.moveTo(0, 0.016);
    ctx.quadraticCurveTo(-0.02 - i * 0.022, 0.095, -0.045 - i * 0.029, 0.14 + i * 0.014);
  }
  ctx.stroke();
  ctx.restore();
}

function koiMarkings(ctx: CanvasRenderingContext2D, spine: Spine, kind: FishKind, variant: number) {
  if (kind === "gold") return;
  const p = skin(ctx, spine);
  const shift = Math.sin(variant * 2.8) * 0.035;
  ctx.fillStyle = kind === "red" ? "#d95b32" : "#c64d3a";
  ctx.beginPath();
  p.move(0.2 + shift, -0.16);
  p.curve(0.3, -0.07, 0.28, 0.015, 0.19, 0.045);
  p.curve(0.13, 0.02, 0.095, -0.01, 0.055, -0.06);
  p.curve(0.035, -0.11, 0.13, -0.16, 0.2 + shift, -0.16);
  ctx.fill();
  ctx.beginPath();
  p.move(-0.06, -0.165);
  p.curve(0.015, -0.08, -0.015, -0.005, -0.12, 0.025);
  p.curve(-0.19, 0.085, -0.25, 0.075, -0.285, -0.01);
  p.curve(-0.3, -0.065, -0.16, -0.16, -0.06, -0.165);
  ctx.fill();
  if (kind === "red") {
    ctx.fillStyle = "#343632";
    ctx.beginPath();
    p.move(0.08, -0.135);
    p.curve(0.14, -0.12, 0.12, -0.062, 0.047, -0.042);
    p.curve(-0.016, -0.045, -0.056, -0.09, -0.027, -0.133);
    ctx.fill();
    ctx.beginPath();
    p.move(-0.19, 0.1);
    p.curve(-0.22, 0.035, -0.34, -0.005, -0.36, 0.045);
    p.quad(-0.27, 0.125, -0.19, 0.1);
    ctx.fill();
  } else {
    ctx.beginPath();
    p.move(-0.32, -0.08);
    p.curve(-0.26, -0.035, -0.3, 0.025, -0.365, 0.024);
    p.quad(-0.42, -0.03, -0.32, -0.08);
    ctx.fill();
  }
}

function koiScales(ctx: CanvasRenderingContext2D, spine: Spine, gold: boolean) {
  const p = skin(ctx, spine);
  ctx.strokeStyle = gold ? "rgba(123, 77, 24, 0.25)" : "rgba(93, 79, 60, 0.18)";
  ctx.lineWidth = 0.0045;
  ctx.beginPath();
  for (let col = 0; col < 11; col++) {
    const x = -0.33 + col * 0.048;
    for (let row = -2; row <= 2; row++) {
      const y = row * 0.047 + (col % 2) * 0.023;
      p.move(x - 0.017, y - 0.023);
      p.quad(x + 0.024, y, x - 0.017, y + 0.023);
    }
  }
  ctx.stroke();
  ctx.strokeStyle = gold ? "rgba(255, 232, 163, 0.46)" : "rgba(255, 251, 235, 0.35)";
  ctx.lineWidth = 0.0035;
  ctx.beginPath();
  for (let col = 0; col < 9; col++) {
    const x = -0.25 + col * 0.049;
    p.move(x - 0.01, -0.061);
    p.quad(x + 0.023, -0.045, x + 0.005, -0.027);
  }
  ctx.stroke();
}

function drawKoi(
  ctx: CanvasRenderingContext2D,
  kind: "red" | "white" | "gold",
  wag: number,
  bend: number,
  dark: boolean,
  effort: number,
  variant: number,
) {
  const spine = makeSpine(wag, bend, effort, false);
  const p = skin(ctx, spine);
  const gold = kind === "gold";
  koiTail(ctx, spine, wag, gold);

  // Dorsal and far pectoral fin sit behind the body.
  ctx.fillStyle = gold ? "rgba(208, 158, 62, 0.72)" : "rgba(209, 185, 154, 0.65)";
  ctx.beginPath();
  p.move(-0.24, -0.1);
  p.curve(-0.17, -0.17, -0.04, -0.25, 0.1, -0.205);
  p.quad(0.14, -0.17, 0.18, -0.13);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(144, 111, 73, 0.3)";
  ctx.lineWidth = 0.005;
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const x = -0.16 + i * 0.046;
    p.move(x - 0.02, -0.135);
    p.line(x, -0.19 - Math.sin(i / 7 * Math.PI) * 0.028);
  }
  ctx.stroke();
  atSpine(ctx, spine, 0.15, -0.08, () => {
    ctx.scale(1, -1);
    koiFin(ctx, gold, Math.sin(wag + 1.5) * 0.13, 0.65);
  });

  koiBody(ctx, spine);
  const body = ctx.createLinearGradient(0, -0.18, 0.03, 0.18);
  if (gold) {
    body.addColorStop(0, "#ae782c");
    body.addColorStop(0.28, "#dfab4c");
    body.addColorStop(0.5, "#f5d582");
    body.addColorStop(0.78, "#d99f40");
    body.addColorStop(1, "#b88031");
  } else {
    body.addColorStop(0, dark ? "#c8bfb0" : "#c6bbab");
    body.addColorStop(0.28, "#eee5d3");
    body.addColorStop(0.5, "#fff5e4");
    body.addColorStop(0.82, "#e5d7bd");
    body.addColorStop(1, "#b6a38b");
  }
  ctx.fillStyle = body;
  ctx.fill();
  ctx.save();
  ctx.clip();
  koiMarkings(ctx, spine, kind, variant);
  koiScales(ctx, spine, gold);
  const volume = ctx.createLinearGradient(0, -0.19, 0, 0.18);
  volume.addColorStop(0, "rgba(61, 49, 37, 0.18)");
  volume.addColorStop(0.32, "rgba(255, 248, 215, 0.14)");
  volume.addColorStop(0.56, "rgba(255, 253, 238, 0.2)");
  volume.addColorStop(1, "rgba(81, 61, 32, 0.2)");
  ctx.fillStyle = volume;
  ctx.fillRect(-0.55, -0.45, 1.1, 0.9);
  ctx.restore();
  koiBody(ctx, spine);
  ctx.strokeStyle = dark ? "rgba(249, 233, 203, 0.23)" : "rgba(110, 87, 57, 0.26)";
  ctx.lineWidth = 0.006;
  ctx.stroke();

  // The lateral line and gill cover follow the skin.
  ctx.strokeStyle = "rgba(128, 104, 69, 0.26)";
  ctx.lineWidth = 0.0045;
  ctx.beginPath();
  p.move(-0.38, 0.015);
  p.curve(-0.18, 0.038, 0.05, 0.043, 0.23, 0.025);
  ctx.stroke();
  ctx.strokeStyle = "rgba(116, 85, 53, 0.44)";
  ctx.lineWidth = 0.007;
  ctx.beginPath();
  p.move(0.26, -0.104);
  p.curve(0.2, -0.03, 0.24, 0.08, 0.29, 0.105);
  ctx.stroke();

  atSpine(ctx, spine, -0.2, 0.105, () => koiFin(ctx, gold, -0.35 + Math.sin(wag - 0.8) * 0.16, 0.5));
  atSpine(ctx, spine, 0.17, 0.078, () => koiFin(ctx, gold, -0.25 + Math.sin(wag + 0.7) * 0.22, 0.84));

  atSpine(ctx, spine, 0.365, -0.034, () => {
    ctx.fillStyle = gold ? "#b18039" : "#b79b77";
    ctx.beginPath();
    ctx.arc(0, 0, 0.029, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#252922";
    ctx.beginPath();
    ctx.arc(0.003, 0, 0.018, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffbea";
    ctx.beginPath();
    ctx.arc(0.008, -0.007, 0.006, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = "rgba(113, 87, 58, 0.56)";
  ctx.lineWidth = 0.006;
  ctx.beginPath();
  p.move(0.462, 0.012);
  p.quad(0.434, 0.025, 0.419, 0.018);
  p.move(0.443, 0.043);
  p.quad(0.507, 0.071, 0.493, 0.102 + Math.sin(wag) * 0.007);
  p.move(0.452, -0.005);
  p.quad(0.502, 0.002, 0.518, 0.039);
  ctx.stroke();
}

function orcaBody(ctx: CanvasRenderingContext2D, spine: Spine) {
  const p = skin(ctx, spine);
  ctx.beginPath();
  p.move(0.515, 0.012);
  p.curve(0.5, -0.07, 0.33, -0.155, 0.14, -0.174);
  p.curve(-0.11, -0.185, -0.3, -0.074, -0.5, -0.025);
  p.quad(-0.54, 0, -0.5, 0.027);
  p.curve(-0.34, 0.045, -0.18, 0.123, 0.07, 0.149);
  p.curve(0.31, 0.174, 0.44, 0.094, 0.511, 0.054);
  p.quad(0.534, 0.035, 0.515, 0.012);
  ctx.closePath();
}

function drawOrca(ctx: CanvasRenderingContext2D, wag: number, bend: number, dark: boolean, effort: number) {
  const spine = makeSpine(wag, bend, effort, true);
  const p = skin(ctx, spine);
  const ink = ctx.createLinearGradient(0, -0.2, 0.02, 0.18);
  ink.addColorStop(0, "#101f28");
  ink.addColorStop(0.35, dark ? "#3b5664" : "#2e4653");
  ink.addColorStop(0.62, "#20343e");
  ink.addColorStop(1, "#101e27");

  // Flukes pitch together, and the wave grows down the tail stock.
  atSpine(ctx, spine, -0.49, 0, () => {
    ctx.rotate(Math.sin(wag - 3.1) * 0.19);
    ctx.scale(1, 0.72 + Math.sin(wag - 2.8) * 0.18);
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.moveTo(0.035, -0.018);
    ctx.bezierCurveTo(-0.06, -0.085, -0.11, -0.19, -0.255, -0.205);
    ctx.quadraticCurveTo(-0.24, -0.075, -0.14, 0);
    ctx.quadraticCurveTo(-0.22, 0.09, -0.26, 0.175);
    ctx.bezierCurveTo(-0.12, 0.174, -0.04, 0.056, 0.035, 0.018);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(151, 182, 193, 0.3)";
    ctx.lineWidth = 0.006;
    ctx.beginPath();
    ctx.moveTo(-0.015, -0.014);
    ctx.quadraticCurveTo(-0.13, -0.08, -0.235, -0.18);
    ctx.stroke();
  });

  // Swept dorsal fin and the more distant flipper.
  ctx.fillStyle = ink;
  ctx.beginPath();
  p.move(-0.155, -0.135);
  p.curve(-0.095, -0.19, -0.028, -0.345, 0.027, -0.4);
  p.curve(0.048, -0.375, 0.035, -0.245, 0.11, -0.165);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  p.move(0.2, -0.09);
  p.quad(0.085, -0.19, -0.005, -0.225);
  p.quad(0.0, -0.135, 0.11, -0.06);
  ctx.fill();

  orcaBody(ctx, spine);
  ctx.fillStyle = ink;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const white = ctx.createLinearGradient(0, 0.01, 0, 0.17);
  white.addColorStop(0, "#fffdf1");
  white.addColorStop(1, "#b9cbd0");
  ctx.fillStyle = white;
  ctx.beginPath();
  p.move(0.515, 0.047);
  p.curve(0.36, 0.058, 0.27, 0.073, 0.18, 0.082);
  p.curve(0.09, 0.11, -0.08, 0.075, -0.19, 0.024);
  p.quad(-0.215, 0.065, -0.145, 0.109);
  p.curve(-0.02, 0.182, 0.29, 0.19, 0.515, 0.11);
  ctx.closePath();
  ctx.fill();

  // Soft gray saddle behind the dorsal fin.
  ctx.fillStyle = "rgba(168, 184, 184, 0.38)";
  ctx.beginPath();
  p.move(-0.085, -0.173);
  p.curve(-0.2, -0.16, -0.25, -0.1, -0.225, -0.055);
  p.curve(-0.16, -0.11, -0.11, -0.095, -0.02, -0.1);
  p.quad(0.013, -0.15, -0.085, -0.173);
  ctx.fill();

  ctx.fillStyle = "#f4f1e6";
  ctx.beginPath();
  p.move(0.16, -0.091);
  p.curve(0.2, -0.129, 0.29, -0.12, 0.323, -0.074);
  p.curve(0.302, -0.03, 0.214, -0.019, 0.174, -0.037);
  p.quad(0.144, -0.058, 0.16, -0.091);
  ctx.fill();
  ctx.strokeStyle = "rgba(181, 212, 217, 0.22)";
  ctx.lineWidth = 0.011;
  ctx.beginPath();
  p.move(-0.33, -0.067);
  p.curve(-0.06, -0.142, 0.21, -0.159, 0.41, -0.045);
  ctx.stroke();
  ctx.restore();

  orcaBody(ctx, spine);
  ctx.strokeStyle = dark ? "rgba(176, 207, 214, 0.32)" : "rgba(15, 37, 48, 0.32)";
  ctx.lineWidth = 0.005;
  ctx.stroke();
  atSpine(ctx, spine, 0.15, 0.08, () => {
    ctx.rotate(Math.sin(wag + 0.65) * 0.1 + bend * 0.25);
    const fin = ctx.createLinearGradient(0, 0, -0.13, 0.24);
    fin.addColorStop(0, "#314b57");
    fin.addColorStop(1, "#142731");
    ctx.fillStyle = fin;
    ctx.beginPath();
    ctx.moveTo(0.04, 0);
    ctx.bezierCurveTo(0.01, 0.08, -0.105, 0.257, -0.18, 0.248);
    ctx.bezierCurveTo(-0.223, 0.187, -0.14, 0.064, -0.065, -0.012);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(156, 185, 195, 0.25)";
    ctx.lineWidth = 0.005;
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(10, 23, 29, 0.68)";
  ctx.lineWidth = 0.006;
  ctx.beginPath();
  p.move(0.504, 0.044);
  p.quad(0.404, 0.06, 0.332, 0.039);
  ctx.stroke();
  atSpine(ctx, spine, 0.37, -0.005, () => {
    ctx.fillStyle = "#0b171d";
    ctx.beginPath();
    ctx.arc(0, 0, 0.012, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d6e4df";
    ctx.beginPath();
    ctx.arc(0.003, -0.004, 0.0035, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = "rgba(11, 26, 33, 0.7)";
  ctx.lineWidth = 0.009;
  ctx.beginPath();
  p.move(0.295, -0.125);
  p.quad(0.315, -0.135, 0.33, -0.119);
  ctx.stroke();
}

export function drawFish(
  ctx: CanvasRenderingContext2D,
  kind: FishKind,
  wag: number,
  bend: number,
  dark: boolean,
  effort = 0.6,
  variant = 0,
) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (kind === "orca") drawOrca(ctx, wag, bend, dark, effort);
  else drawKoi(ctx, kind, wag, bend, dark, effort, variant);
}
