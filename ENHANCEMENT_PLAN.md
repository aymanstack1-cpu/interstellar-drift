# Interstellar Drift — Enhancement Plan

> **Status:** Base v1 deployed ✅ — starfield hub + 4 worlds + orb navigation + HashRouter
> **Goal:** Elevate from working demo to immersive masterpiece

---

## 🎯 TIER 1 — Visual Excellence (highest impact, moderate effort)

### 1.1 Post-Processing Pipeline
Bring back `@react-three/postprocessing` but bulletproof it:
- **Bloom** — cinematic glow on emissive particles (nebula gas, star halos)
- **Vignette** — dark edges for depth and immersion
- **ChromaticAberration** — subtle RGB split for "lens in space" feel
- **Noise** — film grain, 0.02 opacity
- **Per-world variations** — Singularity gets heavy vignette, Nebula gets strong bloom, Drift gets subtle noise
- **Quality gating** — skip heavy effects on mobile (already have `qualityTier` in store)

### 1.2 Custom GLSL Shaders
Replace basic `pointsMaterial` with custom shaders:
- **NebulaHeart** — FBM noise-based volumetric nebula shader (not just colored dots — actual cloud-like gas)
- **SolarSail** — Aurora ribbon shader with flowing UV distortion
- **TheDrift** — Twinkling star shader with proper atmospheric scintillation
- **Singularity** — Gravitational lens distortion post-effect (bend light around center)

### 1.3 Particle System Upgrades
- **Trail particles** — particles leave fading trails (ribbon/trail effect)
- **Spawn bursts** — on world entry, particles burst outward then settle
- **Mouse interaction** — particles gently attracted/repelled by cursor position
- **Particle size variance** — not uniform dots; mix of sizes for depth

---

## 🎵 TIER 2 — Audio Immersion (high impact, moderate effort)

### 2.1 Wire the Tone.js Engine
The audio synth patches already exist (`driftPad.ts`, `nebulaBells.ts`, `singularityPulse.ts`, `solarStrings.ts`). They're just not connected:
- **AudioEngine singleton** — already coded, needs integration into Layout
- **User gesture gate** — first click/tap initializes AudioContext
- **Crossfade on world change** — 2s fade between soundscapes
- **Volume control** — subtle UI: hidden until hover, bottom-right corner

### 2.2 Sound Design Polish
- **Master reverb** — shared convolution reverb for spatial cohesion
- **Low-pass filter sweep** — on world transition, filter sweeps down then up
- **Audio-reactive particles** — particle brightness pulses with audio amplitude (optional, high-effort)

---

## 🚀 TIER 3 — World Transitions

### 3.1 Warp Tunnel Effect
Replace the current fade-to-black with a proper hyperspace warp:
- Camera zooms forward rapidly
- Radial blur + light streaks
- New world fades in from center

### 3.2 Portal Rings
Instead of just fading, show a glowing ring/portal that expands and "swallows" the camera.

---

## 📊 TIER 4 — Data & Polish

### 4.1 Supabase Analytics (already designed, not implemented)
- **World visit counter** — increment on entry, display subtle count
- **Total gallery visitors** — aggregate counter
- **Graceful offline** — if no Supabase keys, use local Zustand state only

### 4.2 UI Polish
- **World intro** — world name animates in on entry (already partially built in OverlayUI)
- **Loading spinner** — already coded, just needs wiring for initial load
- **Favicon** — custom SVG favicon
- **OG meta tags** — rich preview when shared on Discord/Twitter

### 4.3 Mobile Responsiveness
- **Touch-friendly orb navigation** — larger tap targets on mobile
- **Gyroscope option** — use device orientation for camera on mobile
- **FPS cap** — 30fps on mobile, 60fps on desktop (already in store)

---

## 🔮 TIER 5 — New Worlds (highest effort, delay to v2)

### 5.1 "Event Horizon" — Black hole world
- Accretion disk (ring of particles with Doppler shift)
- Gravitational lensing shader
- Photon sphere effect

### 5.2 "Stellar Nursery" — Star birth world
- Proto-star particle clusters
- Gas cloud formations
- Occasional "ignition" flashes

---

## 📋 Recommended Execution Order

| Phase | Items | Est. Effort | Impact |
|-------|-------|-------------|--------|
| **Phase 1** | 1.1 Post-Processing + 2.1 Wire Audio | 1 session | 🔥🔥🔥🔥🔥 |
| **Phase 2** | 3.1 Warp Transitions + 4.2 UI Polish | 1 session | 🔥🔥🔥🔥 |
| **Phase 3** | 1.2 Custom Shaders + 1.3 Particle Upgrades | 2 sessions | 🔥🔥🔥🔥🔥 |
| **Phase 4** | 4.1 Supabase + 4.3 Mobile | 1 session | 🔥🔥🔥 |
| **Phase 5** | 5.x New Worlds | 2 sessions | 🔥🔥🔥🔥 |

---

## ❓ Your Call, Boss

Pick your priorities:
- **"Just make it beautiful"** → Phase 1 + 3
- **"I want the full experience"** → Phase 1 + 2 + 3
- **"Ship fast"** → Phase 1 only, then iterate
- **Custom** → Tell me which items you want

Which tier/phase should I greenlight?
