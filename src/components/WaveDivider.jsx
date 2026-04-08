/**
 * Decorative SVG wave divider used between page sections.
 * - color: the fill color (should match the BACKGROUND of the section BELOW it)
 * - flip: rotates 180deg so the wave cups downward instead of upward
 *
 * Usage pattern:
 *   <WaveDivider color="[next-section-bg]" />          ← standard (wave cups up)
 *   <WaveDivider flip color="[current-section-bg]" />  ← inverted (wave cups down into dark)
 */
export default function WaveDivider({ flip = false, color = "var(--color-primary)" }) {
  return (
    <div style={{
      lineHeight: 0,
      overflow: "hidden",
      transform: flip ? "rotate(180deg) scaleX(-1)" : "none",
      marginBottom: -1,
    }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 56, display: "block" }}
        aria-hidden="true"
      >
        <path
          d="M0,32 C180,72 360,8 540,40 C720,72 900,16 1080,44 C1260,70 1380,24 1440,36 L1440,80 L0,80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
