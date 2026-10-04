"use client";

import { useState } from "react";

/** The cinnabar chop. Pressing it brings the orca up through the school. */
export default function SealNote() {
  const [stamping, setStamping] = useState(false);

  function press(event: React.MouseEvent<HTMLButtonElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent("water-seal", {
        detail: { x: box.left + box.width / 2, y: box.top + box.height / 2 },
      }),
    );
    setStamping(true);
    window.setTimeout(() => setStamping(false), 560);
  }

  return (
    <button type="button" className="seal-hit" aria-label="Wake the orca" onClick={press}>
      <span className={`seal ${stamping ? "seal-stamp" : ""}`} aria-hidden>
        水
      </span>
    </button>
  );
}
