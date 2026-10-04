"use client";

function spark(name: string, event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const box = event.currentTarget.getBoundingClientRect();
  window.dispatchEvent(
    new CustomEvent(name, {
      detail: { x: box.left + box.width / 2, y: box.top + box.height / 2 },
    }),
  );
}

/** The sentence stays ordinary text. These two words only look clickable if you already know. */
export default function WaterEggs() {
  return (
    <>
      When I&apos;m not coding, I enjoy{" "}
      <a href="#swimming" className="water-egg" onClick={(event) => spark("water-lane", event)}>
        competitive swimming
      </a>
      , playing{" "}
      <a href="#polo" className="water-egg" onClick={(event) => spark("water-polo", event)}>
        water polo
      </a>
      , or out trying new restaurants with friends.
    </>
  );
}
