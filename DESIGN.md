# Thera Research Design System

## Scene

A sponsor or clinical lead reviews the site on a laptop during study planning, with enough ambient light for a light interface but enough operational gravity to justify dark clinical moments.

## Color Strategy

Committed scientific restraint. Use near-white clinical surfaces for readability, deep cobalt for trust and page anchors, emerald/cyan as the active scientific signal, and a muted violet-cobalt note only for depth.

Use OKLCH tokens in CSS. Do not use pure black or pure white for interface surfaces. Keep bright accent under control and reserve it for active states, links, focus, and key calls to action.

## Typography

Use Geist Variable as the main brand typeface. It is already installed and supports the precise clinical tone. Keep headings smaller than a dramatic landing-page scale; clarity beats spectacle.

- H1: compact, legible, maximum 2-3 lines.
- H2: strong but not heroic.
- Body: 65-75ch maximum where possible.
- Headings use `text-wrap: balance`; body copy uses `text-wrap: pretty`.
- Dynamic numbers use tabular numerals.

## Layout

Default to editorial sections, rows, timelines, image blocks, and split operational views. Use cards only when the card is the interaction or repeated content needs a clear frame.

Avoid nested cards. Avoid identical icon-card grids. Use full-width bands for major shifts, especially the workflow and hero areas.

## Radius And Elevation

Use restrained 8px base radius, 10-12px for larger framed media, and concentric radii when an element contains a nested surface. Use soft layered shadows over heavy borders.

## Motion

Motion should be smooth, short, and interruptible.

- Hero: staggered entrance for brand, copy, and actions.
- Scroll: image depth and timeline reveal.
- Interaction: translate/scale only, no layout animation.
- Press: scale to 0.96.
- Respect `prefers-reduced-motion`.

## Accessibility

Maintain strong focus states, 40px minimum hit areas, contrast for text over images, and no layout breakage when switching between English and Spanish.

## Quality Gates

- `npm run build` passes.
- Desktop and mobile screenshots show no text overlap.
- Language switch does not break navigation, workflow, forms, or LinkedIn archive.
- GitHub Pages routes keep SPA fallback behavior.
