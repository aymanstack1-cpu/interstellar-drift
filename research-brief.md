# Interstellar Drift — Research Brief

> **Project:** Immersive generative 3D art experience — gallery/worlds concept, interstellar space theme
> **Date:** June 19, 2026
> **Role:** Research Agent — deep-dive, creative, ruthlessly relevant

---

## Table of Contents

1. [Generative Art Repositories (5–8)](#1-generative-art-repositories)
2. [Interstellar Color Palettes (3)](#2-interstellar-color-palettes)
3. [UI/UX Inspiration Patterns (4–6)](#3-uiux-inspiration-patterns)
4. [Web Audio API — Ambient Sound Techniques & Libraries (2–4)](#4-web-audio-api--ambient-sound-techniques--libraries)

---

## 1. Generative Art Repositories

### ⭐ 1.1 marian42/starfield
- **URL:** https://github.com/marian42/starfield
- **Stack:** GLSL (pure WebGL fragment shader)
- **Stars:** ~1,000+
- **Why it matters:** Single-file GLSL shader that procedurally generates a full 3D starfield inspired by *No Man's Sky* galactic map. Renders entirely on GPU — no textures, no geometry. Shows how to create infinite, parallax star layers with seeded randomness. Playable on Shadertoy.
- **Takeaway:** Study the shader for starfield-as-background technique; adapt the layered parallax approach for "world" transitions.

### ⭐ 1.2 Eluvade/cosmos
- **URL:** https://github.com/Eluvade/cosmos
- **Stack:** TypeScript, WebGL 1.0, Canvas 2D
- **NPM:** `@eluvade/cosmos`
- **License:** MIT
- **Why it matters:** Zero-dependency procedural celestial body generator. Renders **12 types** (planets, gas giants, stars, black holes, galaxies, nebulae) with deterministic seeded output. Features 6 composable GLSL shader features + 12 render profiles. Multi-pass black hole pipeline. Canvas-2D nebula renderer. Built for a space MMORPG.
- **Takeaway:** Perfect for generating "world thumbnails" for gallery portals. The seeded approach means deterministic rendering — same seed = same planet every time.

### ⭐ 1.3 creativelifeform/three-nebula
- **URL:** https://github.com/creativelifeform/three-nebula
- **Stack:** Three.js, WebGL
- **License:** MIT
- **Website:** https://three-nebula.org
- **Why it matters:** Full-featured WebGL particle engine purpose-built for Three.js. JSON-serializable particle systems, desktop GUI app (Nebula) for visual design, rich initializer/behavior API. 526+ commits, active maintenance.
- **Takeaway:** Use as the particle backbone for nebula dust, sparkle trails, and "warp-drift" effects. JSON export means designers can build particle systems visually and load them at runtime.

### ⭐ 1.4 flodlc/nebula
- **URL:** https://github.com/flodlc/nebula
- **Stack:** TypeScript, Canvas (Vanilla JS + React)
- **License:** MIT
- **Stars:** ~500+
- **Why it matters:** Ultra-lightweight (1 KB compressed) library for universe animations — stars, nebulas, comets, planets, suns. SSR-compatible. Ships a React wrapper out of the box.
- **Takeaway:** Great as a lightweight skybox/background for HTML overlay UI (loading screens, menus) — pairs well with heavier Three.js scenes.

### ⭐ 1.5 sugaith/react-three-fiber-shader-galaxy
- **URL:** https://github.com/sugaith/react-three-fiber-shader-galaxy
- **Stack:** React Three Fiber, GLSL shaders, Three.js
- **Why it matters:** Boilerplate R3F project demonstrating a shader-driven galaxy with particles, custom vertex/fragment shaders, and camera animation loops. Shows the R3F pattern for GPU-particle galaxies.
- **Takeaway:** Canonical starter template for an R3F galaxy scene. Adapt camera animation for "drift through worlds" navigation.

### ⭐ 1.6 pmndrs/react-three-fiber
- **URL:** https://github.com/pmndrs/react-three-fiber
- **Stars:** 29,000+
- **Why it matters:** The de facto React renderer for Three.js. Entire ecosystem built on top — drei, react-postprocessing, react-spring/three. Declarative scene graph, responsive to React state.
- **Takeaway:** **Foundation layer** for Interstellar Drift. All R3F-based repos above build on this.

### ⭐ 1.7 pmndrs/drei
- **URL:** https://github.com/pmndrs/drei
- **Stars:** 8,000+
- **Why it matters:** Ready-made R3F abstractions — `<Stars />` (background starfield), `<Cloud />` (volumetric clouds), `<Caustics />` (light caustics), `<Text />`, `<Float />`, `<ScrollControls />`. These are **directly applicable** to Interstellar Drift.
- **Takeaway:** `<Stars />` for instant background starfield; `<ScrollControls />` for gallery scrolling; `<Float />` for floating gallery objects; `<Caustics />` for light-play on gallery podiums.

### ⭐ 1.8 pmndrs/react-postprocessing
- **URL:** https://github.com/pmndrs/react-postprocessing
- **Stars:** 1,300+
- **Why it matters:** Postprocessing pipeline for R3F — Bloom, DepthOfField, Noise, Vignette, ChromaticAberration. Essential for the "cinematic space" feel.
- **Takeaway:** Bloom + Vignette + Noise = the "Interstellar film" aesthetic. Use selectively per world for mood differentiation.

---

## 2. Interstellar Color Palettes

### 🟣 Palette 1: "Deep Void"
*The quiet emptiness between galaxies — contemplative, infinite, mysterious.*

| Role | Hex Code | Name |
|------|----------|------|
| Base | `#0a0015` | Void Black |
| Primary | `#1a0a2e` | Deep Space Violet |
| Secondary | `#2d1b4e` | Nebula Shadow |
| Accent | `#4a2c6e` | Distant Galaxy |
| Star Light | `#7b68ee` | Medium Slate Blue |
| Highlight | `#e6e6fa` | Lavender Glow |

**Mood:** Silent drift. The sense of floating in the void between star systems. Monochrome purples with subtle blue starlight. Use for the "main hub" world — the gallery entrance.

**Suggested shader approach:** Dark gradient background with sparse, slowly twinkling points. Subtle purple haze at horizon edges.

### 🌌 Palette 2: "Crab Nebula"
*A stellar nursery — energetic, awe-inspiring, alive with color.*

| Role | Hex Code | Name |
|------|----------|------|
| Base | `#0d0221` | Cosmic Midnight |
| Primary | `#3c1053` | Supernova Purple |
| Accent 1 | `#ff6ec7` | Nebula Pink |
| Accent 2 | `#00f5ff` | Ionized Cyan |
| Warm Accent | `#ff9f43` | Stellar Orange |
| Pure Light | `#ffffff` | White Dwarf |

**Mood:** Explosive creation. The violent beauty of a nebula birthing new stars. High contrast between deep space and vibrant pinks/cyans. Use for the "Nursery" world — generative art featuring particle swarms and fluid simulations.

**Suggested shader approach:** Noise-driven nebula clouds (FBM simplex noise) with emissive pink/cyan patches. Floating particle clusters as "protostars".

### ☀️ Palette 3: "Solar Flare"
*The heat of a dying star — powerful, intense, primal.*

| Role | Hex Code | Name |
|------|----------|------|
| Base | `#0a0a0a` | Absolute Void |
| Primary | `#1a0d00` | Ember Dark |
| Accent 1 | `#c04000` | Mars Red |
| Accent 2 | `#ff7f50` | Coral Glow |
| Light | `#ffd700` | Gold Star |
| Highlight | `#fff8dc` | Corona White |

**Mood:** Raw energy. The surface of a red giant, a coronal mass ejection, the birth pangs of a solar system. Warm, intense, dramatic. Use for the "Forge" world — generative art focused on geometry, fractals, and structured chaos.

**Suggested shader approach:** Voronoi-based surface textures with animated flow. Orange/red emissive glow with golden highlights. Heat distortion postprocessing.

### Palette Application Strategy

| World | Palette | Emotion | Technique |
|-------|---------|---------|-----------|
| Entrance / Hub | Deep Void | Calm, mysterious | Starfield shader + bloom |
| The Nursery | Crab Nebula | Awe, vibrant | Particle swarms + noise clouds |
| The Forge | Solar Flare | Intense, primal | Voronoi shaders + heat haze |
| (Bonus: Void Walker) | Deep Void + accent | Lonely, vast | Minimalist geometry + void |

---

## 3. UI/UX Inspiration Patterns

### 3.1 Lusion Studio — Portfolio / Experiments
- **URL:** https://lusion.co
- **Also:** https://mesh3d.gallery/makers/lusion
- **What makes it special:** Award-winning 3D web studio. Their work exemplifies scroll-driven narrative, minimal UI overlay (thin typography, invisible nav until hover), and seamless world transitions. "My Little Storybook" and "Choo-Choo World" show how to do gallery-like 3D experiences with emotional pacing.
- **Inspo for Interstellar Drift:** Floating "world cards" that the user drifts toward. Cinematic letterboxing for transitions. Thin, uppercase sans-serif labels over dark gradients.

### 3.2 Star Atlas — Hello Monday / DEPT®
- **URL:** https://www.hellomonday.com/work/staratlas
- **Awwwards:** https://www.awwwards.com/inspiration/star-atlas-immersive-metaverse-gaming-experience
- **What makes it special:** Immersive metaverse landing page with a 3D galactic portal as the hero. Scroll-based chapter navigation through spaceship and planet visualizations. Blockchain-game-adjacent aesthetic — dark, neon UI elements, holographic wireframe overlays.
- **Inspo for Interstellar Drift:** The "portal" metaphor for world entry. Glowing ring or vortex that the camera flies through to transition between gallery worlds. Holographic UI text with scan-line effects.

### 3.3 Penderecki's Garden — Huncwot (Awwwards SOTD)
- **URL:** https://www.awwwards.com/inspiration/pendereckis-garden-three-js-virtual-garden
- **What makes it special:** Virtual garden combining photogrammetry, GLSL particle systems, hand-drawn illustrations, and **Web Audio API** integration with the composer's music. Demonstrates how to blend organic/illustrative UI with real-time 3D. The audio-responsive particles are a direct model for Interstellar Drift.
- **Inspo for Interstellar Drift:** Audio-reactive particle systems. The blend of 2D illustrated elements overlaid on 3D scenes. Chapter-based navigation through a "garden" — easily adapted to "gallery worlds."

### 3.4 mesh3d.gallery — Curated 3D Website Gallery
- **URL:** https://mesh3d.gallery
- **What makes it special:** A gallery *of* 3D websites. Clean grid of thumbnail previews with studio credits. When you click, it loads the live site in an iframe or opens it. The meta-gallery concept is exactly the format Interstellar Drift could use for its world-select screen.
- **Inspo for Interstellar Drift:** The gallery-of-worlds UI pattern. Thumbnail cards arranged in a floating 3D grid. Minimal metadata (title, creator) on hover. Previews animate on hover.

### 3.5 Vredestein Online 3D Museum — Wirelab (Awwwards)
- **URL:** https://www.awwwards.com/inspiration/vredestein-online-3d-museum-immersive-experience
- **What makes it special:** An online 3D museum where users navigate a virtual gallery space to explore tire products. Demonstrates first-person-gallery navigation in WebGL — walk through rooms, examine objects on pedestals. Clean, minimal UI with contextual tooltips.
- **Inspo for Interstellar Drift:** Gallery pedestal / plinth pattern for displaying generative art "pieces." First-person drift navigation through gallery rooms. Spotlight effects on displayed art.

### 3.6 Active Theory — Dreamwave Platform
- **URL:** https://activetheory.net
- **What makes it special:** Pioneered the "microverse" concept with Dreamwave (Xbox 20th anniversary) — a fully immersive 3D world users explore freely. Minimal HUD, diegetic UI (UI elements that exist in the 3D world), smooth world transitions.
- **Inspo for Interstellar Drift:** Diegetic UI — world labels floating in 3D space, portals as literal 3D objects. The "no chrome" philosophy: no browser chrome, no traditional nav bars, everything is part of the world.

---

## 4. Web Audio API — Ambient Sound Techniques & Libraries

### 4.1 Tone.js — Primary Generative Audio Framework
- **URL:** https://tonejs.github.io
- **GitHub:** https://github.com/Tonejs/Tone.js
- **Why it fits:** Purpose-built Web Audio framework for generative music. Provides DAW-like scheduling, prebuilt synths, effects, and LFOs. The standard for browser-based generative audio.

**Key Techniques for Space Ambient:**

| Technique | Code Pattern | Effect |
|-----------|-------------|--------|
| Drone Pad | `Tone.Synth` + long envelope (>8s release) + `Tone.Reverb` | Continuous bass/pad drone |
| Space Wind | `Tone.Noise("brown")` + `Tone.AutoFilter` (low rate 0.1–0.5 Hz) | Whooshing, evolving background texture |
| Modulated Rumble | `Tone.Oscillator(30, "sine")` + `Tone.Gain` modulated by LFO | Deep space sub-bass pulse |
| Ping-Pong Echoes | `Tone.FeedbackDelay(0.3, 0.6)` with stereo spread | Metallic, infinite-space reflections |
| Filter Sweeps | `Tone.Filter(200, "lowpass")` with `Tone.LFO(0.05).connect(filter.frequency)` | Slow, evolving filter sweeps — "feeling of moving through space" |
| Granular Texture | Multiple short `Tone.Player` instances with random start offsets | Sparkle/shimmer textures |

**Architecture pattern:** Create a `Tone.PolySynth` or a set of `Tone.Synth` instances, connect them through a shared effects chain (`Reverb → Delay → Gain → Destination`), and schedule note events with `Tone.Transport`.

### 4.2 Generative.fm — Reference Architecture
- **URL:** https://generative.fm
- **GitHub:** https://github.com/generativefm/generative.fm
- **Generators:** https://github.com/generativefm/generators
- **Why it fits:** Open-source platform for endless ambient music. 50+ hand-crafted generators, all built with Tone.js. Each "piece" is an independent generator system. The architecture is a perfect reference for Interstellar Drift's per-world audio generators.
- **Takeaway:** Model each world's soundscape as a self-contained Tone.js generator class with its own synths, effects chain, and scheduling logic. The generator pattern allows world-specific audio without cross-contamination.

### 4.3 Howler.js — Spatial Audio & Sample Playback
- **URL:** https://howlerjs.com
- **GitHub:** https://github.com/goldfire/howler.js
- **Stars:** 25,000+
- **Why it fits:** Robust cross-browser audio library with a **spatial audio plugin** (`howler.spatial`). Enables 3D-positioned audio — sounds that pan, fade, and change orientation based on listener position.
- **Technique:** Place ambient sound emitters in 3D space correlating with visual elements. A nebula glow has a corresponding low hum at its 3D coordinates. A star has a high-pitched shimmer positioned at its location. As the user drifts through the gallery, spatial audio cues shift naturally.
- **When to use:** For diegetic ambient sounds tied to specific visual elements (rather than the continuous generative bed, which Tone.js handles better).

### 4.4 Raw Web Audio API — Low-Level Control
- **MDN Reference:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

**Techniques for generative space ambience without libraries:**

| Technique | API | Description |
|-----------|-----|-------------|
| Layered Oscillators | `AudioContext.createOscillator()` | 3–5 detuned sine/sawtooth oscillators → lush, evolving drones |
| Convolution Reverb | `AudioContext.createConvolver()` | Load impulse response of a large hall / cathedral → "space echo" |
| LFO Modulation | `create Oscillator` → `AudioParam` | Slow sine LFO modulating filter cutoff or gain → evolving texture |
| Noise Generation | `AudioContext.createBufferSource()` with random buffer | Custom noise colors (pink/brown/blue) for different "space weather" |
| Audio Visualization | `AnalyserNode.getByteFrequencyData()` | React visual elements to frequency data |

**Specific space-ambient recipe (raw Web Audio):**
```
3x Oscillators (sine, 55Hz / 82Hz / 110Hz, slightly detuned)
  → GainNode (mix)
  → BiquadFilterNode (lowpass, 500Hz, Q=1, LFO at 0.1Hz)
  → ConvolverNode (hall IR)
  → StereoPannerNode (slight L/R spread)
  → GainNode (master volume)
  → AudioContext.destination
```
This gives you a thick, evolving, cathedral-like drone that feels like being inside a nebula.

### Recommended Audio Architecture for Interstellar Drift

```
┌──────────────────────────────────────────────────────┐
│                  Audio Manager                        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐        │
│  │ World A   │  │ World B   │  │ World C   │        │
│  │ Generator │  │ Generator │  │ Generator │        │
│  │ (Tone.js) │  │ (Tone.js) │  │ (Tone.js) │        │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘        │
│        └──────┬────────┴────────┬────┘              │
│               ▼                 ▼                     │
│        ┌────────────┐   ┌────────────┐               │
│        │ Master FX  │   │ Spatial 3D │ (Howler.js)  │
│        │ Chain      │   │ Audio      │               │
│        │ (Reverb →  │   │ (ambient   │               │
│        │  Delay →   │   │  emitters) │               │
│        │  Limiter)  │   └────────────┘               │
│        └─────┬──────┘                                │
│              ▼                                        │
│        AudioContext.destination                       │
└──────────────────────────────────────────────────────┘
```

- **On world enter:** Fade out previous generator, fade in new generator
- **On world exit:** Long reverb tail carries over briefly (1–2s) for a dreamy transition
- **Spatial layer:** 3–5 Howler.js emitters placed in the 3D scene, positions update with camera

---

## Appendix: Quick Reference Links

### Repos
| Repo | URL | Best For |
|------|-----|----------|
| marian42/starfield | https://github.com/marian42/starfield | Starfield shader study |
| Eluvade/cosmos | https://github.com/Eluvade/cosmos | Procedural celestial bodies |
| three-nebula | https://github.com/creativelifeform/three-nebula | Particle engine |
| flodlc/nebula | https://github.com/flodlc/nebula | Lightweight universe bg |
| r3f-shader-galaxy | https://github.com/sugaith/react-three-fiber-shader-galaxy | R3F galaxy starter |
| react-three-fiber | https://github.com/pmndrs/react-three-fiber | Foundation |
| drei | https://github.com/pmndrs/drei | R3F helpers |
| react-postprocessing | https://github.com/pmndrs/react-postprocessing | Cinematic effects |

### UI Inspo
| Site | URL | Pattern |
|------|-----|---------|
| Lusion Studio | https://lusion.co | 3D scroll narrative |
| Star Atlas (Hello Monday) | https://www.hellomonday.com/work/staratlas | Galactic portal + chapters |
| Penderecki's Garden | https://www.awwwards.com/inspiration/pendereckis-garden-three-js-virtual-garden | Audio+visual garden |
| mesh3d.gallery | https://mesh3d.gallery | Curated 3D gallery |
| Vredestein 3D Museum | https://www.awwwards.com/inspiration/vredestein-online-3d-museum-immersive-experience | Gallery walkthrough |
| Active Theory | https://activetheory.net | Microverse / diegetic UI |

### Color Palettes
| Palette | Hexes | Mood |
|---------|-------|------|
| Deep Void | `#0a0015 #1a0a2e #2d1b4e #4a2c6e #7b68ee #e6e6fa` | Calm, infinite, mysterious |
| Crab Nebula | `#0d0221 #3c1053 #ff6ec7 #00f5ff #ff9f43 #ffffff` | Energetic, vibrant, alive |
| Solar Flare | `#0a0a0a #1a0d00 #c04000 #ff7f50 #ffd700 #fff8dc` | Intense, hot, primal |

### Audio
| Library | URL | Use Case |
|---------|-----|----------|
| Tone.js | https://tonejs.github.io | Generative music, synths, effects |
| Generative.fm | https://generative.fm | Reference architecture |
| Howler.js | https://howlerjs.com | Spatial audio, samples |
| Web Audio API (MDN) | https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API | Low-level control |

---

*End of research brief. All links verified as of June 19, 2026.*
