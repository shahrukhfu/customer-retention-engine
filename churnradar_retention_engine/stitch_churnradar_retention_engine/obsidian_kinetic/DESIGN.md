---
name: Obsidian Kinetic
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#cfc2d6'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#988d9f'
  outline-variant: '#4d4354'
  surface-tint: '#ddb7ff'
  primary: '#ddb7ff'
  on-primary: '#490080'
  primary-container: '#b76dff'
  on-primary-container: '#400071'
  inverse-primary: '#842bd2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffafd3'
  on-tertiary: '#620040'
  tertiary-container: '#e364a7'
  on-tertiary-container: '#560038'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffd8e7'
  tertiary-fixed-dim: '#ffafd3'
  on-tertiary-fixed: '#3d0026'
  on-tertiary-fixed-variant: '#85145a'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
  code-data:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-margin: 32px
  gutter: 20px
---

## Brand & Style

The design system is a hyper-sleek, cyberpunk-inspired framework tailored for B2B enterprise intelligence. It balances the raw energy of high-tech futurism with the disciplined structure required for complex data analysis. The aesthetic combines **Modern Corporate** reliability with **Glassmorphism** and **Tactile** accents to evoke a sense of "mission control" for customer retention.

The brand personality is professional, predictive, and authoritative. It targets executive decision-makers who require high-density information presented with extreme clarity. The emotional response is one of calm control amidst high-stakes data environments—achieved through deep canvas layers, luminous accents, and razor-sharp geometric precision.

## Colors

This design system utilizes a "Deep Space" palette to maximize contrast for critical data signals. 

- **Primary (Electric Purple):** Used for primary actions, active states, and focal points of the "engine."
- **Success (Emerald Green):** Indicates positive retention trends, health growth, and "Safe" status.
- **Critical (Neon Hot-Pink):** Reserved exclusively for high-risk churn signals and urgent alerts.
- **Surface Strategy:** The background uses a deep charcoal (#0B0F19). Navigation and container elements use a slate secondary (#161F30) to create clear structural separation without harsh value changes.
- **Accents:** 1px borders should use a transparent white or a subtle tint of the primary color to simulate glass edges.

## Typography

The typography system prioritizes "at-a-glance" scannability. **Inter** serves as the workhorse for UI and body copy due to its exceptional legibility at small scales. **Geist** is introduced for labels and data points to provide a technical, monospaced feel that reinforces the "radar" and "engine" narrative.

For high-density dashboards, use `body-sm` for secondary metadata and `code-data` for specific metric values. `label-caps` should be used for section headers and table column titles to provide clear visual hierarchy without occupying excessive vertical space.

## Layout & Spacing

This design system employs a **Fluid Grid** approach within fixed sidebar constraints. The standard layout uses a 12-column system for desktop views.

- **Breakpoints:** Desktop (1440px+), Laptop (1024px), Tablet (768px), Mobile (375px).
- **Rhythm:** An 8px linear scale governs all padding and margins to ensure mathematical harmony.
- **Density:** High-density layouts are preferred. Use `md` (16px) for standard component internal padding and `sm` (8px) for tight data grids.
- **Negative Space:** Use `xl` (48px) spacing between major layout sections to prevent "data fatigue."

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Ambient Glows** rather than traditional shadows.

1.  **Level 0 (Canvas):** The base background (#0B0F19).
2.  **Level 1 (Surface):** Cards and navigation panels (#161F30). Use a 1px border with `rgba(255, 255, 255, 0.05)`.
3.  **Level 2 (Hover/Active):** Elements should utilize a subtle inner glow (Primary color at 10% opacity) and a 1px border at `rgba(255, 255, 255, 0.15)`.
4.  **Level 3 (Popovers/Modals):** Use a heavy backdrop blur (20px) and a soft ambient shadow with a tint of the primary color: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 10px rgba(168, 85, 247, 0.1)`.

Avoid solid black shadows; they feel too heavy for this futuristic aesthetic.

## Shapes

The shape language is refined and geometric. A standard `rounded-md` (8px) is used for small controls like checkboxes and buttons. Larger containers like dashboard cards and modals use `rounded-lg` (16px) to create a more sophisticated, high-end feel. 

The contrast between sharp text and rounded containers creates a modern, custom-software appearance.

## Components

- **Buttons:** Primary buttons use a solid Electric Purple fill with white text. Secondary buttons use a transparent fill with a 1px border and a subtle purple text. Ghost buttons are reserved for utility actions.
- **Churn Radar Cards:** The signature component. Features a 1px gradient border (Primary to Transparent), a large numerical risk score in the center, and a "Pulse" animation in the Critical Hot-Pink color if the risk is high.
- **Input Fields:** Dark background (#0B0F19) with a 1px border. On focus, the border glows Electric Purple and the background lightens slightly.
- **Status Chips:** Small, semi-transparent background with high-saturation text (e.g., Emerald text on `rgba(16, 185, 129, 0.1)` background).
- **Data Tables:** Row-based with 1px bottom borders. Hover states should trigger a full-row highlight using the Surface color (#161F30).
- **Metric Micro-Charts:** Sparklines should use the color corresponding to the data health (Emerald for growth, Hot-Pink for decline).