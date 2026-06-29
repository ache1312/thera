# Revisión premium / CRO — Thera Research

Documento de entrega de la pasada de diseño + implementación sobre el frontend
(`src/App.tsx`, `src/content.ts`, `src/styles.css`, `index.html`).
Fecha: 2026-06-28.

Incluye: qué se cambió y por qué, **dónde están todos los placeholders** que necesitan
información real, y qué quedó pendiente (con su justificación).

---

## 1. Corrección importante sobre la crítica inicial

La primera lectura señaló problemas de **paleta cálida (cream) y contraste de texto que falla AA**.
Tras inspeccionar el render real, eso era **incorrecto**: la app aplica `theme-intelligence`
(`App.tsx:339`) que **sobrescribe** la capa `:root` cálida con una paleta fría cobalto/cyan
ya alineada al `DESIGN.md`. Datos verificados sobre el tema activo:

- `--paper` real = `oklch(0.972 0.012 236)` (off-white frío, no cream).
- `--muted` real = `#526070` → **6.05:1 de contraste, sí pasa WCAG AA**.
- `--teal #19c6d8` coincide con el color de foco; existen tokens `--cobalt`, `--emerald`, `--violet`.

**Conclusión:** la paleta y el contraste ya estaban bien. Mi primer diagnóstico leyó capas de
tokens muertas (las primeras líneas de `styles.css`). Lo dejo escrito para que no se "arregle"
algo que no está roto.

### Deuda real que sí queda (documentada, no tocada por riesgo)
Hay **tres capas de tokens** solapadas en `styles.css`:
1. `:root` (línea 1) — hex cálido **legacy/muerto**.
2. `.theme-intelligence` (línea ~2208) — hex frío, **el que se ve**.
3. `:root` (línea ~3731) — **oklch frío**, el más nuevo (tiene `--cobalt/--emerald/--violet`).

No las consolidé porque es cirugía de alto riesgo en un archivo de 5.700 líneas sin beneficio
visual inmediato. Recomendación futura: unificar a una sola capa oklch. (Ver §5.)

---

## 2. Lo que SÍ se implementó

### A. Banda de credibilidad / prueba (mayor palanca CRO) — NUEVO
Para una CRO, la confianza es el factor de conversión #1. No existían métricas, acreditaciones
ni logos de patrocinadores. Se añadió una banda **justo debajo del hero** (lo primero que ve un
sponsor): cifras + estándares de cumplimiento + ranuras para logos.

- Componente: `CredibilityStrip` en `src/App.tsx` (antes de `RouteGatewaySection`).
- Render: `src/App.tsx`, dentro de `HomePage`, tras el `</section>` del hero.
- Contenido: clave `credibility` en `src/content.ts` (EN e ES).
- Estilos: `src/styles.css`, bloque `.credibility` al final del archivo.
- Diseño deliberado: superficie clara (evita apilar dos bandas oscuras tras el hero), números
  ≤2.6rem con color sólido (NO usa la plantilla "hero-metric" de SaaS ni gradient text).

### B. CTA de las route-cards descriptivos (CRO + accesibilidad)
Antes: cuatro enlaces idénticos "Abrir página" / "Open page" (ambiguos para lectores de pantalla).
Ahora usan el nombre del destino (**Servicios / Pacientes / Noticias / Contacto**) + `aria-label`
con el título de la sección. Cambio en `RouteGatewaySection` (`src/App.tsx`).

### C. CTA primario persistente en el header
Botón "Hablar con un especialista / Talk to a specialist" siempre visible → página de contacto.
Da un camino de conversión permanente para sponsors. En `Header` (`src/App.tsx`) + estilo
`.header-cta` (`src/styles.css`). Se oculta ≤1100px (en móvil el contacto vive en el menú).

### D. WhatsApp en el header (condicional, oculto hasta tener número)
Afordancia de contacto rápido (alto valor en LatAm). Solo aparece cuando se define el número
real; mientras tanto **no** renderiza un enlace muerto. Ver placeholder en §3.

### E. SEO / datos estructurados / social (`index.html`)
- `lang="es"` (la web abre en español; `App.tsx:283` ya sincroniza `<html lang>` al cambiar idioma).
- `MedicalOrganization` JSON-LD para confianza + rich results (con placeholders).
- `canonical`, `og:url`, `og:site_name`, Twitter Card.
- **Fix de bug:** `og:image` pasó de ruta relativa (`/assets/...`, que se rompe bajo el base
  `/thera/` de GitHub Pages y para los crawlers) a URL absoluta (con placeholder de dominio).

### Verificación
- `tsc --noEmit` → sin errores.
- `npm run build` → OK (JS 432 KB / 131 KB gzip, CSS 97 KB / 17.7 KB gzip, SPA fallback creado).
- Screenshots desktop (1440) y móvil (390): banda, header y CTAs correctos, sin solapes.

---

## 3. PLACEHOLDERS — qué falta y dónde está exactamente

Todo lo marcado con `[ ]` o comentado con `PLACEHOLDER` necesita dato real. **No publiques
afirmaciones que Thera no pueda evidenciar** (cifras, acreditaciones, dirección).

### Métricas de la banda de credibilidad
- **`src/content.ts:93-96`** (EN) y **`src/content.ts:863-866`** (ES) — los `value`:
  `[NN]+` estudios, `[NN]` centros, `[NN]` años (+ `Founded [YYYY]` / `Desde [AAAA]`),
  `[NN]%` reclutamiento a tiempo (+ `Last [NN] studies` / `Últimos [NN] estudios`).
  → Reemplazar por cifras defendibles públicamente.

### Acreditaciones / cumplimiento
- **`src/content.ts:104`** (EN) y **`src/content.ts:874`** (ES) — `"ISO 9001 [if applicable]"` /
  `"ISO 9001 [si aplica]"`. Mantener solo las credenciales reales; quitar las que no apliquen.

### Logos de patrocinadores
- **`src/content.ts`** clave `credibility.sponsors` (`[]` en EN e ES). Mientras esté vacío se
  muestran 5 ranuras "LOGO" punteadas como placeholder visual.
  → Colocar archivos en **`/public/assets/sponsors/`** y listarlos como
  `{ src: "assets/sponsors/acme.svg", name: "Acme Pharma" }`. **Verificar permiso del sponsor.**

### Número de WhatsApp
- **`src/App.tsx:140`** — `const WHATSAPP_NUMBER = ""`. Poner el número E.164 solo dígitos
  (ej. `"56912345678"`). Al definirlo, el icono de WhatsApp aparece solo en el header.

### Email de contacto (verificar)
- **`src/App.tsx:143`** — `contactEmail = "x.verdina@theraresearch.com"`. Confirmar que es el
  buzón correcto (hoy está hardcodeado en varios sitios; este const queda como fuente única).

### SEO / dominio / datos legales (`index.html`)
- **Líneas 14, 19, 32, 45** — dominio en `canonical`, `og:url`, `og:image`, `twitter:image`.
  Sustituir `https://www.theraresearch.com/` por el dominio de producción real.
- **JSON-LD (líneas 61-73):**
  - `legalName` → razón social legal.
  - `telephone` `[+56 XXXXXXXXX]`.
  - `foundingDate` `[YYYY]`.
  - `address`: `addressRegion`, `addressLocality`, `streetAddress`.
  - `logo` → confirmar que `assets/logos/thera-mark.png` existe; si no, ajustar la ruta.

---

## 4. Hallazgos válidos NO implementados (decisión consciente)

- **Jerarquía de CTAs del hero.** Conviven "Iniciar un estudio" (sponsor) y "Reclutamiento de
  pacientes" con peso visual casi igual. No lo toqué porque es una decisión de negocio
  (¿qué audiencia es prioritaria?). Recomendación: dejar sponsor como primario claro y pacientes
  como secundario, o separar con un micro-rótulo "¿Sponsor / Paciente?".
- **Reducción de eyebrows / numeración 01-02-03.** El `DESIGN.md` y la guía de diseño los marcan
  como "andamiaje de IA" cuando se repiten. Aquí hay ~4 por vista y forman un sistema "señal"
  bastante intencional, así que no lo desmonté unilateralmente (es subjetivo y reversible).
  Si quieres, hago una pasada para dejar 1-2 deliberados y quitar el reflejo.

---

## 5. Optimizaciones técnicas recomendadas (pendientes, con motivo)

- **Bundle / framer-motion (432 KB JS).** La vía habitual (`LazyMotion` + `m`) **no** se aplicó
  porque hay un `AnimatePresence mode="popLayout"` (`App.tsx`) que exige el feature-set `domMax`
  completo, anulando el ahorro y obligando a convertir 152 usos de `motion.` con riesgo alto.
  Alternativa de mayor retorno: sustituir los reveals simples (fade-up al hacer scroll) por
  CSS + `IntersectionObserver` y reservar framer-motion para el hero y transiciones de página.
- **Consolidar las 3 capas de tokens** de `styles.css` en una sola (oklch). Ver §1.
- **Fuentes:** `font-display: swap` ya viene de `@fontsource-variable/geist` (OK). Mejora menor:
  precargar el `.woff2` latino para acelerar el LCP del hero.
- **Imágenes:** `public/assets` pesa ~38 MB (incluye media de LinkedIn). Auditar y servir solo
  lo necesario; los `.jpg` del hero/secciones podrían pasar a `.webp` (algunos ya lo están).

---

## 6b. Fixes reportados (noticias y fotos)

**"La sección de noticias carga la segunda vez que actualizo".**
Dos causas atacadas:
1. **30 imágenes del archivo con `loading="eager"`** (`App.tsx`, `.linkedin-news__media img`)
   → todas se descargaban a la vez en el primer load (blanco hasta llegar; al 2.º refresh
   ya estaban en caché). Cambiado a **`loading="lazy"`**.
2. **La sección estaba gateada por `whileInView`** (se revelaba solo al hacer scroll; puede no
   dispararse en el primer paint por bfcache / StrictMode en dev). Como es su propia página bajo
   el hero, ahora **revela en el montaje (`animate="show"`)**, garantizando que siempre aparezca.

**"Muchas fotos no alineadas / se corta la cabeza".**
1. **Cabeza cortada:** el hero de Pacientes usaba `object-position: 58% 46%` (recorte centrado
   verticalmente) → cortaba la cabeza del sujeto. Subido a **`58% 28%`** (desktop) y añadido
   override móvil **`60% 22%`** para mantener la cabeza en cuadro. (`styles.css`,
   `.page-hero--patients .page-hero__image`.)
2. **Fotos recortadas:** los thumbnails de noticias estaban forzados a `object-fit: cover` por el
   tema (la base era `contain`), recortando los posts gráficos de LinkedIn. Devueltos a
   **`object-fit: contain`** para mostrar cada post completo sin cortar texto/caras.
   (`styles.css`, `.theme-intelligence .linkedin-news__media img`.)

> Nota: el resto de heroes (Servicios, Noticias, Contacto, intro de home) son escenas de
> laboratorio/escritorio sin rostros en el borde superior; no requieren ajuste.

## 6. Archivos tocados

- `src/App.tsx` — `CredibilityStrip` + render; CTAs de ruta; CTA y WhatsApp en header; constantes;
  noticias `loading="lazy"`; sección de noticias revela en montaje (`animate`).
- `src/content.ts` — bloque `credibility` (EN/ES); `meta.headerCta` y `meta.whatsapp`.
- `src/styles.css` — `.credibility`, `.header-cta`, ocultar `.header-cta` ≤1100px;
  `object-position` del hero de Pacientes (desktop + móvil); thumbnails de noticias a `contain`.
- `index.html` — `lang`, JSON-LD, canonical, OG/Twitter, fix de `og:image`.
- `REVISION-PREMIUM-CRO.md` — este documento.
