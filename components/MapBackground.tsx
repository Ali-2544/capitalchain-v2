// Flat world-map background, anchored to the right of the viewport and faded into the
// page background on the left (see `.map-bg` in globals.css). Rendered once in the root
// layout so it persists across routes — the same role the old WebGL globe had.
//
// The per-theme image (light / dark) is swapped purely in CSS via `body.light`, so this
// component has no client-side logic.
export default function MapBackground() {
  return <div className="map-bg" aria-hidden="true" />;
}
