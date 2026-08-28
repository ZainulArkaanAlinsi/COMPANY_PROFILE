# Dark Editorial Garage

## Brand & Style
The brand personality is authoritative, engineered, and uncompromising. This design system treats luxury automotive inventory as fine art within an industrial, high-end garage setting. The aesthetic is inspired by premium automotive journalism and high-fashion editorial layouts.

The visual style is **Industrial Minimalism**. It rejects the "softness" of modern SaaS interfaces in favor of precision-engineered elements: sharp corners, high-contrast typography, and hairline strokes. The emotional response should be one of exclusivity, power, and mechanical excellence. Every element must feel intentional and structural, prioritizing clarity and bold photographic content over decorative UI tropes.

## Layout & Spacing
The layout follows a strict 12-column grid for desktop with 24px gutters. It is a fluid-to-fixed model where the maximum content width is 1440px, centered on larger displays. 

Vertical rhythm is expansive; use 120px gaps between major sections to allow the car photography "room to breathe." Components should utilize a 4px base unit. Margins on mobile should be a strict 16px, while desktop margins should be a generous 64px to create an editorial frame around the content.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Hairline Outlines** rather than shadows. 
- **Base:** #0B0B0C (The "Floor").
- **Level 1:** #141417 with a 1px #2A2A30 border (Cards, Modals).
- **Level 2:** #1C1C21 (Internal sections or hovered states).

The design system uses "Ghost Outlines" for depth. Objects do not float; they are built into the grid. Blur effects (20px-40px) are reserved exclusively for the sticky navigation bar to create a "glass cockpit" feel as users scroll through high-contrast car imagery.

## Components
- **Buttons:** Solid buttons use #FF6A00 background with black text. Ghost buttons use a 1px #2A2A30 border with off-white text. Both feature 2px border-radius, `label-md` typography, and wide horizontal padding (32px+).
- **Inputs:** Dark #141417 background with a 1px #2A2A30 border. On focus, the border changes to #FF6A00.
- **Lists/Specs:** Key-value pairs for car specs (e.g., "0-60 MPH / 2.9s") should use `label-sm` for keys in #9A9A93 and `headline-sm` for values. Separate with 1px #1F1F24 hairline dividers.
- **Cards:** No shadows. 1px hairline border #2A2A30. Images should be edge-to-edge with no padding at the top.
- **Toasts & Modals:** Strictly #141417 background. Modals use a heavy backdrop blur (#000000 at 70% opacity). Borders must be 1px solid #2A2A30.
- **Navigation:** Sticky top-bar with 20px backdrop blur, #0B0B0C at 80% opacity, and a 1px bottom border in #2A2A30.