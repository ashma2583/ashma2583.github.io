/** A single quiet current. Long flowing lines, not a repeating wave pattern. */
export default function WaveRule() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 36"
      preserveAspectRatio="none"
      className="h-8 w-full text-[var(--accent)]"
    >
      <path
        d="M0 20 C 140 20, 200 9, 340 11 C 500 13, 560 27, 720 23 C 900 19, 960 8, 1120 12 C 1260 15, 1340 24, 1440 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M0 28 C 180 28, 260 17, 420 19 C 600 21, 680 30, 860 25 C 1040 20, 1140 14, 1320 20 C 1380 22, 1420 21, 1440 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.22"
      />
    </svg>
  );
}
