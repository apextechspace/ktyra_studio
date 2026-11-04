# KTYRA STUDIO — Wear Your Presence

A responsive, animated modest-fashion landing page and interactive **faceless thobe** configurator. Built as a portfolio concept for KTYRA Technologies.

> **Not a live e-commerce business.** The product, pricing, shopping bag and brand story are demonstration content. No transactions are processed.

## Run

Open `index.html` locally, or serve the folder using `python3 -m http.server 8000`.

## Current interactions

- Five independently selectable thobe colors: Pearl White, Desert Sand, Midnight Navy, Graphite and Onyx Black
- Four independently selectable ghutra colors; black agal remains fixed
- Animated floating SVG garment, illuminated backdrop, ambient color changes
- Swipe, keyboard-arrow and button controls
- Size selection, demo bag, mobile responsive layout
- Reduced-motion support and labeled controls

## Files

- `index.html` — page structure and the **illustrated** SVG outfit
- `styles.css` — responsive art direction and animation
- `script.js` — garment colors, ghutra colors, navigation and demo shopping bag
- `assets/products/` — future transparent garment images (same angle and dimensions)
- `assets/models/` — future GLB model with independently addressable materials
- `assets/references/` — design-image notes; original mockups are retained in the conversation, not copied here

## Important: 3D scope

The current page is a working **2.5D illustration**, not a physical 3D model or photorealistic render. Achieving real 360° drag rotation requires an appropriate licensed GLB/GLTF model with separate thobe, ghutra and agal meshes/materials, and a 3D viewer such as React Three Fiber. Converting a photograph to SVG will not provide 3D geometry.

## Next milestones

1. Create original/appropriately licensed transparent hero product renders.
2. Improve photographic collection cards and typography after reviewing the first build.
3. Move the interface to React + TypeScript + Vite and add GSAP.
4. Integrate a real 3D model when available, optimizing performance on mobile.
5. Test accessibility, responsiveness, image performance and interactions before portfolio release.

This work is maintained in a feature branch for review before merging to `main`.
