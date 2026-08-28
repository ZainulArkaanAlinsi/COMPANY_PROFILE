---
name: Dark Editorial Garage
colors:
  surface: '#121413'
  surface-dim: '#121413'
  surface-bright: '#383a38'
  surface-container-lowest: '#0d0f0e'
  surface-container-low: '#1a1c1b'
  surface-container: '#1e201f'
  surface-container-high: '#282a29'
  surface-container-highest: '#333534'
  on-surface: '#e2e3e1'
  on-surface-variant: '#e2bfb0'
  inverse-surface: '#e2e3e1'
  inverse-on-surface: '#2f3130'
  outline: '#a98a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb694'
  primary: '#ffb694'
  on-primary: '#571f00'
  primary-container: '#ff6a00'
  on-primary-container: '#571f00'
  inverse-primary: '#a14000'
  secondary: '#c8c6c7'
  on-secondary: '#313031'
  secondary-container: '#4a494a'
  on-secondary-container: '#bab8b9'
  tertiary: '#9ccaff'
  on-tertiary: '#003256'
  tertiary-container: '#009eff'
  on-tertiary-container: '#003357'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb694'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7b2f00'
  secondary-fixed: '#e5e2e3'
  secondary-fixed-dim: '#c8c6c7'
  on-secondary-fixed: '#1c1b1c'
  on-secondary-fixed-variant: '#474647'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497a'
  background: '#121413'
  on-background: '#e2e3e1'
  surface-variant: '#333534'
typography:
  display-xl:
    fontFamily: Oswald
    fontSize: 80px
    fontWeight: '700'
    lineHeight: 90px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Oswald
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  display-lg-mobile:
    fontFamily: Oswald
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style
The brand personality is authoritative, engineered, and uncompromising. This design system treats luxury automotive inventory as fine art within an industrial, high-end garage setting. The aesthetic is inspired by premium automotive journalism and high-fashion editorial layouts.

The visual style is **Industrial Minimalism**. It rejects the "softness" of modern SaaS interfaces in favor of precision-engineered elements: sharp corners, high-contrast typography, and hairline strokes. The emotional response should be one of exclusivity, power, and mechanical excellence. Every element must feel intentional and structural, prioritizing clarity and bold photographic content over decorative UI tropes.

## Colors
The palette is built on a foundation of "Charcoal" and "Molten Amber." The background is deep and matte, allowing the vibrant orange accent to function like a high-performance brake caliper or an illuminated dashboard indicator.

- **Primary (Accent):** #FF6A00 is used sparingly for calls to action and critical status indicators.
- **Backgrounds:** The primary background is #0B0B0C. Use #141417 for elevated containers and #1C1C21 for nested surface elements to create subtle depth without relying on shadows.
- **Typography:** Headlines and primary body text use #F2F2F0. Secondary info uses #9A9A93, and metadata uses #6A6A64.
- **Borders:** Use #2A2A30 for standard structural lines and #1F1F24 for subtle internal separators.

## Typography
The typographic system is a study in contrast. **Oswald** provides a condensed, architectural feel for all display and heading roles. It must always be set in uppercase with tight tracking to mimic luxury automotive badging.

**Inter** provides the functional balance. It is used for all body copy and UI labels to ensure maximum legibility against the dark background. Use `label-md` and `label-sm` for technical specifications and data points, always in uppercase with increased letter spacing to maintain an "engineered" look.

## Layout & Spacing
The layout follows a strict 12-column grid for desktop with 24px gutters. It is a fluid-to-fixed model where the maximum content width is 1440px, centered on larger displays. 

Vertical rhythm is expansive; use 120px gaps between major sections to allow the car photography "room to breathe." Components should utilize a 4px base unit. Margins on mobile should be a strict 16px, while desktop margins should be a generous 64px to create an editorial frame around the content.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Hairline Outlines** rather than shadows. 
- **Base:** #0B0B0C (The "Floor").
- **Level 1:** #141417 with a 1px #2A2A30 border (Cards, Modals).
- **Level 2:** #1C1C21 (Internal sections or hovered states).

The design system uses "Ghost Outlines" for depth. Objects do not float; they are built into the grid. Blur effects (20px-40px) are reserved exclusively for the sticky navigation bar to create a "glass cockpit" feel as users scroll through high-contrast car imagery.

## Shapes
The shape language is sharp and precise. A maximum radius of 4px is applied only to functional interactive elements (buttons, inputs). Container cards and structural sections should use 0px (sharp) corners to maintain the industrial garage aesthetic. Avoid circles except for specific iconography; square or slightly softened corners are preferred.

## Components
- **Buttons:** Solid buttons use #FF6A00 background with black text. Ghost buttons use a 1px #2A2A30 border with off-white text. Both feature 2px border-radius, `label-md` typography, and wide horizontal padding (32px+).
- **Inputs:** Dark #141417 background with a 1px #2A2A30 border. On focus, the border changes to #FF6A00.
- **Lists/Specs:** Key-value pairs for car specs (e.g., "0-60 MPH / 2.9s") should use `label-sm` for keys in #9A9A93 and `headline-sm` for values. Separate with 1px #1F1F24 hairline dividers.
- **Cards:** No shadows. 1px hairline border #2A2A30. Images should be edge-to-edge with no padding at the top.
- **Toasts & Modals:** Strictly #141417 background. Modals use a heavy backdrop blur (#000000 at 70% opacity). Borders must be 1px solid #2A2A30.
- **Navigation:** Sticky top-bar with 20px backdrop blur, #0B0B0C at 80% opacity, and a 1px bottom border in #2A2A30.