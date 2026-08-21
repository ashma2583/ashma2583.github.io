/**
 * Diagrams for the audio-fingerprinting page.
 *
 * Drawn inline rather than exported as images: the repo ships no result
 * figures, and these three pictures *are* the algorithm. Colors come from
 * `currentColor` and the theme variables so they read in light and dark.
 */

const AXIS = "currentColor";

/** Deterministic scatter — a plausible constellation map, not real data. */
const PEAKS: [number, number][] = [
  [92, 232], [118, 168], [131, 96], [166, 210], [178, 138],
  [205, 66], [212, 190], [238, 118], [252, 244], [268, 156],
  [289, 88], [301, 205], [318, 141], [332, 61], [349, 224],
  [361, 175], [383, 108], [398, 238], [412, 152], [431, 79],
  [447, 198], [465, 128], [481, 250], [498, 168], [516, 95],
  [534, 216], [551, 143], [569, 184], [586, 71], [104, 121],
  [225, 96], [275, 118], [372, 196], [455, 236], [523, 160],
];

/** Constellation map with an anchor point and its target zone. */
export function ConstellationFigure() {
  const anchor: [number, number] = [166, 210];
  const zone = { x: 186, y: 96, w: 186, h: 150 };
  const targets: [number, number][] = [
    [212, 190],
    [238, 118],
    [268, 156],
    [318, 141],
  ];

  return (
    <svg
      viewBox="0 0 640 300"
      className="mx-auto block h-auto w-full min-w-[520px] max-w-[640px] text-neutral-400"
      role="img"
      aria-label="A constellation map of spectrogram peaks. One peak is marked as the anchor, and a shaded rectangle in front of it marks the target zone; four peaks inside that zone are joined to the anchor by lines, each pair becoming one hash."
    >
      {/* axes */}
      <line x1="52" y1="272" x2="620" y2="272" stroke={AXIS} strokeWidth="1" />
      <line x1="52" y1="272" x2="52" y2="34" stroke={AXIS} strokeWidth="1" />
      <text x="620" y="292" textAnchor="end" fontSize="12" fill={AXIS}>
        time →
      </text>
      <text
        x="-34"
        y="20"
        fontSize="12"
        fill={AXIS}
        transform="rotate(-90)"
        textAnchor="end"
      >
        frequency →
      </text>

      {/* target zone */}
      <rect
        x={zone.x}
        y={zone.y}
        width={zone.w}
        height={zone.h}
        fill="var(--accent)"
        fillOpacity="0.10"
        stroke="var(--accent)"
        strokeWidth="1.25"
        strokeDasharray="5 4"
        rx="4"
      />
      <text
        x={zone.x + zone.w / 2}
        y={zone.y - 10}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="var(--accent)"
      >
        target zone
      </text>

      {/* anchor → target pairings */}
      {targets.map(([tx, ty]) => (
        <line
          key={`${tx}-${ty}`}
          x1={anchor[0]}
          y1={anchor[1]}
          x2={tx}
          y2={ty}
          stroke="var(--accent)"
          strokeWidth="1.25"
          strokeOpacity="0.65"
        />
      ))}

      {/* peaks */}
      {PEAKS.map(([x, y]) => {
        const isAnchor = x === anchor[0] && y === anchor[1];
        const isTarget = targets.some(([tx, ty]) => tx === x && ty === y);
        if (isAnchor) return null;
        return (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={isTarget ? 4.5 : 3}
            fill={isTarget ? "var(--accent)" : "currentColor"}
            fillOpacity={isTarget ? 1 : 0.55}
          />
        );
      })}

      {/* the anchor itself */}
      <circle
        cx={anchor[0]}
        cy={anchor[1]}
        r="6"
        fill="var(--accent)"
        stroke="var(--background)"
        strokeWidth="2.5"
      />
      <text
        x={anchor[0] - 12}
        y={anchor[1] + 5}
        textAnchor="end"
        fontSize="12"
        fontWeight="600"
        fill="var(--accent)"
      >
        anchor
      </text>

      {/* zone extents */}
      <text x={zone.x + zone.w + 10} y={zone.y + 16} fontSize="11" fill={AXIS}>
        Δt ≤ 100 bins
      </text>
      <text x={zone.x + zone.w + 10} y={zone.y + 32} fontSize="11" fill={AXIS}>
        |Δf| &lt; 1500 Hz
      </text>
    </svg>
  );
}

/** Bit layout of the packed 32-bit fingerprint. */
export function HashLayoutFigure() {
  const x0 = 40;
  const total = 560;
  const per = total / 32;
  const h = 52;
  const y = 46;

  const fields = [
    { bits: 12, label: "Δt", sub: "bits 31–20", tint: 0.28 },
    { bits: 10, label: "target freq", sub: "bits 19–10", tint: 0.18 },
    { bits: 10, label: "anchor freq", sub: "bits 9–0", tint: 0.1 },
  ];

  let cursor = x0;

  return (
    <svg
      viewBox="0 0 640 150"
      className="mx-auto block h-auto w-full min-w-[520px] max-w-[640px] text-neutral-400"
      role="img"
      aria-label="A 32-bit word split into three fields: delta t occupies bits 31 to 20, the target frequency occupies bits 19 to 10, and the anchor frequency occupies bits 9 to 0."
    >
      {fields.map((f) => {
        const w = f.bits * per;
        const x = cursor;
        cursor += w;
        return (
          <g key={f.label}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill="var(--accent)"
              fillOpacity={f.tint}
              stroke="var(--accent)"
              strokeWidth="1.25"
            />
            <text
              x={x + w / 2}
              y={y + 32}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="var(--foreground)"
            >
              {f.label}
            </text>
            <text
              x={x + w / 2}
              y={y + h + 18}
              textAnchor="middle"
              fontSize="11"
              fill={AXIS}
            >
              {f.sub}
            </text>
            <text
              x={x + w / 2}
              y={y - 12}
              textAnchor="middle"
              fontSize="11"
              fill={AXIS}
            >
              {f.bits} bits
            </text>
          </g>
        );
      })}

      <text
        x="320"
        y="140"
        textAnchor="middle"
        fontSize="12.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        fill={AXIS}
      >
        anchor | (target &lt;&lt; 10) | (Δt &lt;&lt; 20)
      </text>
    </svg>
  );
}

/** Time-pair scatter with its diagonal cluster, and the ΔT histogram beside it. */
export function MatchScoringFigure() {
  // Scattered noise: hashes that collide by chance.
  const noise: [number, number][] = [
    [72, 66], [104, 188], [136, 108], [88, 224], [168, 52],
    [200, 200], [232, 82], [120, 148], [264, 172], [184, 118],
    [248, 232], [152, 214], [216, 140], [96, 96], [280, 108],
  ];
  // The real match: a diagonal run at a constant offset.
  const diagonal = Array.from({ length: 13 }, (_, i) => {
    const t = 66 + i * 17;
    return [t, 236 - i * 13.4] as [number, number];
  });

  const bars = [3, 2, 4, 3, 5, 4, 34, 5, 3, 4, 2, 3];

  return (
    <svg
      viewBox="0 0 640 300"
      className="mx-auto block h-auto w-full min-w-[560px] max-w-[640px] text-neutral-400"
      role="img"
      aria-label="Left: a scatterplot of matching time pairs, mostly random except for a clear diagonal line of points at a constant offset. Right: a histogram of the time differences, flat except for one tall spike whose height is the match score."
    >
      {/* ---------------- left: scatter ---------------- */}
      <line x1="56" y1="252" x2="308" y2="252" stroke={AXIS} strokeWidth="1" />
      <line x1="56" y1="252" x2="56" y2="40" stroke={AXIS} strokeWidth="1" />
      <text x="308" y="272" textAnchor="end" fontSize="11" fill={AXIS}>
        sample time
      </text>
      <text
        x="-40"
        y="18"
        fontSize="11"
        fill={AXIS}
        transform="rotate(-90)"
        textAnchor="end"
      >
        source time
      </text>
      <text x="56" y="28" fontSize="12" fontWeight="600" fill="var(--foreground)">
        matching time pairs
      </text>

      {noise.map(([x, y]) => (
        <circle key={`n${x}-${y}`} cx={x} cy={y} r="3" fill="currentColor" fillOpacity="0.5" />
      ))}
      {diagonal.map(([x, y]) => (
        <circle key={`d${x}-${y}`} cx={x} cy={y} r="3.6" fill="var(--accent)" />
      ))}
      <line
        x1="60"
        y1="242"
        x2="290"
        y2="60"
        stroke="var(--accent)"
        strokeWidth="1.25"
        strokeDasharray="5 4"
        strokeOpacity="0.8"
      />
      <text x="212" y="96" fontSize="11" fontWeight="600" fill="var(--accent)">
        slope 1
      </text>

      {/* ---------------- arrow ---------------- */}
      <text x="330" y="150" fontSize="18" fill={AXIS}>
        →
      </text>
      <text x="339" y="172" textAnchor="middle" fontSize="10" fill={AXIS}>
        ΔT
      </text>

      {/* ---------------- right: histogram ---------------- */}
      <line x1="374" y1="252" x2="618" y2="252" stroke={AXIS} strokeWidth="1" />
      <line x1="374" y1="252" x2="374" y2="40" stroke={AXIS} strokeWidth="1" />
      <text x="618" y="272" textAnchor="end" fontSize="11" fill={AXIS}>
        ΔT = sourceT − sampleT
      </text>
      <text x="374" y="28" fontSize="12" fontWeight="600" fill="var(--foreground)">
        histogram of ΔT
      </text>

      {bars.map((v, i) => {
        const bw = 16;
        const gap = 4;
        const x = 380 + i * (bw + gap);
        const height = v * 5.4;
        const peak = v === Math.max(...bars);
        return (
          <rect
            key={i}
            x={x}
            y={252 - height}
            width={bw}
            height={height}
            fill={peak ? "var(--accent)" : "currentColor"}
            fillOpacity={peak ? 1 : 0.4}
            rx="1.5"
          />
        );
      })}

      <line
        x1="486"
        y1="62"
        x2="540"
        y2="62"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <text x="546" y="66" fontSize="11" fontWeight="600" fill="var(--accent)">
        score
      </text>
    </svg>
  );
}
