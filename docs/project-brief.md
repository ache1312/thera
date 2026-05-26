# Thera Research Redesign Notes

## Visual thesis

Biotech-grade institutional presence: precise, quiet, scientific, with strong laboratory imagery, dark clinical contrast, and restrained teal accents.

## Content plan

1. Hero: Thera Research as the dominant brand signal, CRO promise, study CTA, recruitment CTA, and three fast credibility metrics.
2. Company: Reframe existing positioning from generic institutional copy into international sponsor language.
3. Services: Regulatory, site activation, monitoring, and recruitment as reusable capability rows.
4. Monitoring: Deepen the strongest operational service with quality/timeline language.
5. Recruitment/contact: Prepare for a future registration flow, study listings, CMS, and multilingual content.

## Commercial framing to preserve

This should be treated as branding plus front-end product work, not a low-cost website refresh. Future scope can be packaged as:

- Diagnostic and visual direction.
- Rebranding and design system.
- UX/UI, content hierarchy, and scientific communication strategy.
- Frontend architecture and technical implementation.
- Custom frontend implementation.
- CMS, multilingual content, SEO, accessibility, QA, deployment, and support.

The current implementation is intentionally data-driven so it can evolve into Next.js, CMS-backed content, or a larger multi-page system.

## Current build mode

The active implementation is targeting the "Professional serious" tier with Taste Skill beta `soft` direction:

- UX/UI complete for a strong one-page institutional CRO experience.
- Modern React/Vite frontend with TypeScript, structured content objects, reusable sections, and production build validation.
- Responsive desktop/mobile layout with a softer, premium scientific composition.
- Basic/partial branding system: Geist typography, warm clinical palette, local imagery assets, service hierarchy, operational language, and interaction states.
- Taste Skill beta installed locally at `$CODEX_HOME/skills/taste-skill-beta`; active style used for this pass is `soft`.
- Contact intake form with empty, error, loading, and success states ready for later CRM/email integration.

## Version Choice

The current frontend keeps two selectable visual directions in the same React implementation:

- `Soft beta`: default softer premium direction from Taste Skill beta.
- `Profesional serio`: darker biotech-grade direction from the previous professional pass.
- `Premium medical`: extremely professional CRO / clinical trials direction using the local `frontend-skill` guidance: full-bleed scientific hero, restrained institutional contrast, fewer visible UI boxes, and stronger sponsor-trust posture.
- `AI Lab`: biotech/AI international direction using the requested palette: `#F7F8FA`, `#EEF1F5`, `#061326`, `#0B1D35`, `#081B3A`, `#526070`, and restrained cyan `#19C6D8`.

The selector is visible in the header. Direct comparison URLs:

- `http://localhost:5173/?theme=soft`
- `http://localhost:5173/?theme=clinical`
- `http://localhost:5173/?theme=premium`
- `http://localhost:5173/?theme=ai`

The selected version is persisted in `localStorage` under `thera-theme`.

## Chile pricing frame

For a well-executed project in Chile, pricing should separate superficial redesign from full strategic rebuild:

| Level | Includes | Reference range CLP |
| --- | --- | --- |
| Basic | Superficial visual redesign, CSS/UI polish, template adaptation, limited structure changes | $800.000 - $1.500.000 |
| Professional serious | Full UX/UI, modern frontend, responsive implementation, basic/partial branding, reusable components, performance pass | $2.000.000 - $5.000.000 |
| Partial branding | Visual direction, improved hierarchy, selected components, stronger frontend polish | $2.000.000 - $5.000.000 |
| Premium agency level | Full rebranding, design system, animation, custom frontend, UX/UI, communication strategy, QA, performance, deployment | $6.000.000 - $15.000.000+ |

Avoid positioning this as "just a website". The strategic value is scientific credibility, international perception, sponsor trust, fundraising image, and a reusable digital system.
