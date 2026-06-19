# Interstellar Drift — System Architecture Document

> **Immersive Generative 3D Art Gallery**
> Version 1.0 | June 2026
> Role: System Design (blueprint only)

---

## 1. Project Structure

```
interstellar-drift/
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── main.tsx                          # React root, providers
│   ├── App.tsx                           # Layout orchestrator
│   ├── index.css                         # Tailwind entry + global resets
│   │
│   ├── components/
│   │   ├── Layout.tsx                    # Canvas + overlay shell
│   │   ├── WorldSelector.tsx             # Diegetic world-switcher UI
│   │   ├── OverlayUI.tsx                 # Minimal HUD (title, visit count)
│   │   ├── LoadingFallback.tsx           # Suspense fallback per world
│   │   ├── TransitionOverlay.tsx         # Crossfade/warp transition
│   │   └── ErrorBoundary.tsx             # Catches 3D render crashes
│   │
│   ├── worlds/
│   │   ├── index.ts                      # World registry map
│   │   ├── TheDrift.tsx                  # Hub world — starfield
│   │   ├── NebulaHeart.tsx               # Volumetric nebula
│   │   ├── Singularity.tsx               # Geometric fractals
│   │   ├── SolarSail.tsx                 # Aurora ribbons
│   │   └── common/
│   │       ├── CameraController.tsx      # Orbit / auto-pan
│   │       ├── PerformanceControls.tsx   # LOD switches
│   │       └── PostEffects.tsx           # Bloom, tone mapping
│   │
│   ├── hooks/
│   │   ├── useWorldTransition.ts         # Exit/enter animation state
│   │   ├── useVisitCounter.ts            # Supabase fetch + increment
│   │   ├── useResponsive.ts              # Breakpoint-based detail tier
│   │   └── useFrameThrottle.ts           # Throttled R3F loop
│   │
│   ├── audio/
│   │   ├── AudioEngine.ts                # Tone.js synth manager
│   │   ├── sounds/
│   │   │   ├── driftPad.ts              # Ambient drone: The Drift
│   │   │   ├── nebulaBells.ts           # Ethereal harmonics: Nebula
│   │   │   ├── singularityPulse.ts      # Percussive tension: Singularity
│   │   │   └── solarStrings.ts          # Warm bowed strings: Solar Sail
│   │   └── AudioContextProvider.tsx      # React context for AudioEngine
│   │
│   ├── store/
│   │   ├── worldStore.ts                 # Zustand: currentWorld, transitions
│   │   ├── settingsStore.ts              # Zustand: quality tier, audio vol
│   │   └── analyticsStore.ts             # Zustand: visit counts cache
│   │
│   ├── lib/
│   │   ├── supabase.ts                   # Supabase client singleton
│   │   ├── constants.ts                  # World IDs, config values
│   │   └── types.ts                      # Shared TypeScript interfaces
│   │
│   └── shaders/
│       ├── aurora.vert / .frag           # Custom glsl for Solar Sail
│       ├── particle.vert / .frag         # Custom particle shader
│       └── gravitationalLens.glsl        # Post-processing effect
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Schema snapshot
│
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
└── vercel.json
```

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **3D Engine** | React Three Fiber + @react-three/drei + @react-three/postprocessing | Declarative React scene graph over Three.js; rich ecosystem of helpers (OrbitControls, Text, shader abstractions); postprocessing pipeline integrates naturally with R3F render loop |
| **State Mgmt** | Zustand | Minimal boilerplate (<30 LOC per store), works outside React components (useful for audio engine bridging), built-in middleware for persistence |
| **Routing** | React Router v6 | World navigation via URL paths (`/drift`, `/nebula`, `/singularity`, `/solar`); nested routes under a shared layout that owns the Canvas |
| **Audio** | Tone.js | Full-featured Web Audio API wrapper with oscillators, envelopes, filters, and scheduling; enables generative ambient with no audio file dependencies |
| **Styling** | Tailwind CSS | Utility-first CSS for the sparse overlay UI only; leaves 3D visuals untouched |
| **Backend** | Supabase (Postgres + Realtime) | Managed Postgres for visit analytics; Realtime subscriptions if we want live visitor counts; row-level security built-in |
| **Build** | Vite | Sub-second HMR, native ESM, TypeScript + JSX out of the box, optimal Rollup-based production builds |
| **Deploy** | Vercel | Zero-config deployment for Vite projects; automatic edge distribution; serverless functions for any future API routes |

---

## 3. Supabase Schema

```sql
-- 001_initial_schema.sql

-- Track per-world visit counts (materialized as incrementing counter)
CREATE TABLE world_visits (
    world_id    TEXT        PRIMARY KEY,       -- 'the_drift', 'nebula_heart', 'singularity', 'solar_sail'
    visit_count BIGINT     NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Granular session log (optional, for deeper analytics)
CREATE TABLE gallery_sessions (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id    TEXT        NOT NULL REFERENCES world_visits(world_id),
    started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_s  INT         DEFAULT NULL,       -- filled on exit / heartbeat
    device_tier TEXT        DEFAULT 'high'       -- 'high' | 'mid' | 'low'
);

-- Index for session queries
CREATE INDEX idx_sessions_world ON gallery_sessions(world_id);
CREATE INDEX idx_sessions_started ON gallery_sessions(started_at DESC);

-- Seed initial world rows
INSERT INTO world_visits (world_id, visit_count) VALUES
    ('the_drift',     0),
    ('nebula_heart',  0),
    ('singularity',   0),
    ('solar_sail',    0);

-- RPC: atomic increment (avoids race conditions from parallel requests)
CREATE OR REPLACE FUNCTION increment_world_visit(p_world_id TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    new_count BIGINT;
BEGIN
    INSERT INTO world_visits (world_id, visit_count, updated_at)
    VALUES (p_world_id, 1, NOW())
    ON CONFLICT (world_id)
    DO UPDATE SET
        visit_count = world_visits.visit_count + 1,
        updated_at  = NOW()
    RETURNING visit_count INTO new_count;
    RETURN new_count;
END;
$$;
```

---

## 4. Component Tree

```
<App>
 │
 ├── <Layout>                          ← owns the <Canvas> lifecycle
 │    │
 │    ├── <Canvas>                     ← React Three Fiber Canvas
 │    │    ├── <ambientLight />
 │    │    ├── <PerformanceControls />  ← adaptive quality
 │    │    ├── <CameraController />     ← orbit / auto-drift
 │    │    └── <Suspense fallback={<LoadingFallback />}>
 │    │         └── <ActiveWorld />     ← renders current world's scene
 │    │              ├── <TheDrift />
 │    │              ├── <NebulaHeart />
 │    │              ├── <Singularity />
 │    │              └── <SolarSail />
 │    │
 │    ├── <PostEffects />              ← bloom, tone mapping (wraps Canvas children)
 │    │
 │    └── <OverlayUI>                  ← absolute-positioned HTML overlay
 │         ├── <WorldSelector />        ← diegetic navigation dots/rings
 │         ├── <TransitionOverlay />    ← fade/warp effect on world change
 │         └── <VisitCounter />         ← "N travellers drifted through"
 │
 └── <AudioEngine />                   ← mounted outside Canvas, own lifecycle
      ├── <AudioContextProvider />
      └── [per-world sound generators]
```

**Routing map** (React Router):

```
/                    → redirect to /drift
/drift              → TheDrift
/nebula             → NebulaHeart
/singularity        → Singularity
/solar              → SolarSail
```

Layout component persists across route changes, keeping the Canvas alive to avoid WebGL context loss on navigation.

---

## 5. Gallery Concepts — Four Worlds

### 5.1 The Drift — *Hub World*

| Aspect | Detail |
|--------|--------|
| **Visual** | Infinite particle starfield with 3 parallax depth layers (near/mid/far). Stars drift slowly right-to-left. Slight camera auto-orbit. |
| **Generative** | ~4K particles distributed on a spherical shell. Each frame: position += velocity * (1/depth). Stars twinkle via sin(time + offset) on scale. Color palette: cool blues + white. |
| **Audio** | Low, slow-evolving drone. Layered filtered noise + sine wave sub-bass. Gentle pan LFO. |
| **Transition** | Default entry. WorldSelector appears as 3 glowing orbs in lower periphery. Clicking an orb triggers exit fade → new world loads. |

### 5.2 Nebula's Heart — *Volumetric Color*

| Aspect | Detail |
|--------|--------|
| **Visual** | Dense particle swarms in cloud-like clusters. Heavy bloom post-processing. Colors shift continuously through a deep purple → magenta → cyan → teal cycle. |
| **Generative** | ~8K particles in spatially-clustered groups (simplex noise field). Each particle has hue that drifts along a gradient map. Size jitter via noise. Custom sprite texture (soft glow). |
| **Audio** | Ethereal bell-like tones (FM synthesis) plucked at random intervals. Reverb tail drone. High-pass filtered shimmer. |
| **Transition** | Screen fills with color bloom (post-processing intensity ramps up), then crossfade into scene. |

### 5.3 Singularity — *Geometric Fractal*

| Aspect | Detail |
|--------|--------|
| **Visual** | Grayscale geometric forms — recursive tetrahedra and icosahedra in a gravitational lens distortion. Edges glow white. Central "event horizon" ripple effect. |
| **Generative** | Recursive subdivision of platonic solids (LOD 3). Vertices displaced by sin(time + distance from center). Screen-space gravitational lens: shader samples positions near center and applies radial warp. |
| **Audio** | Percussive pulses, granular textures. Low thrum with rhythmic clicks aligned to recursive depth level changes. High contrast — silence between pulses. |
| **Transition** | Screen warps inward (lens distortion intensifies), then snaps to new scene. Disorienting by design. |

### 5.4 Solar Sail — *Light & Motion*

| Aspect | Detail |
|--------|--------|
| **Visual** | Warm golden/amber/orange palette. Light trails sweeping across view. Procedural aurora ribbons undulate in the upper atmosphere. Camera follows a gentle upward tilt. |
| **Generative** | Aurora: vertex displacement on a subdivided plane mesh with Perlin noise offset over time. Light trails: series of short-lived line segments with fading opacity, spawned along a spline path. Warm bloom with orange tint. |
| **Audio** | Bowed string pads, slow-attack cello-like tones. Gentle harmonic progression (I–IV–V–I in Lydian mode). Warm filter, moderate reverb. |
| **Transition** | Screen brightens to white (solar flare) then resolves into scene. |

---

## 6. Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                                │
│  (click WorldSelector orb, mobile tap, keyboard shortcut)               │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     ZUSTAND STORE (worldStore)                          │
│                                                                         │
│  setWorld(nextWorldId) →                                                │
│    transitionPhase = 'exiting'                                          │
│    timer: 800ms (exit animation duration)                               │
│    → currentWorld = nextWorldId                                        │
│    transitionPhase = 'entering'                                         │
│    timer: 600ms (enter animation duration)                              │
│    → transitionPhase = 'idle'                                          │
└─────────┬─────────────────────┬─────────────────────────────────────────┘
          │                     │
          ▼                     ▼
┌─────────────────┐   ┌─────────────────────┐
│ ACTIVE WORLD     │   │ AUDIO ENGINE        │
│                  │   │                     │
│ Reads:           │   │ Reads:              │
│  store.current   │   │  store.current      │
│  World           │   │  World              │
│                  │   │                     │
│ Renders 3D scene │   │ Disposes prev       │
│ matching worldId │   │ soundscape, starts  │
│                  │   │ new one             │
│ Exits: unmount   │   │ (crossfade 1.5s)    │
│ with animation   │   │                     │
└─────────────────┘   └─────────────────────┘
          │                     │
          │       ┌─────────────┘
          ▼       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE (async)                                 │
│                                                                         │
│  After world change settles (1s debounce):                              │
│    supabase.rpc('increment_world_visit', { p_world_id })               │
│    → updates world_visits table                                        │
│    → response cached in analyticsStore                                 │
│                                                                         │
│  On page unload / session timeout:                                      │
│    upsert gallery_sessions with duration_s                              │
└─────────────────────────────────────────────────────────────────────────┘
```

**Transition sequence** (timeline):

```
t=0ms    user triggers world change
t=0-200   Zustand: transitionPhase = 'exiting'
          TransitionOverlay fades in (opacity 0 → 1)
          AudioEngine: begin crossfade-out (current soundscape)
t=200-800 ActiveWorld: exit animation (particles scatter, geometry dissolves)
t=800     Zustand: currentWorld = newWorldId
          ActiveWorld unmounts old scene, mounts new scene
t=800-1400 New scene enter animation (particles coalesce, objects fade in)
          TransitionOverlay fades out (opacity 1 → 0)
t=1400    Zustand: transitionPhase = 'idle'
          AudioEngine: new soundscape fully mixed in
t=2400    Supabase: increment visit counter (debounced)
```

---

## 7. Performance Strategy

### 7.1 Adaptive Quality Tiers

| Tier | Device | Particle Count | Shader Complexity | Post-Processing | Shadows |
|------|--------|---------------:|-------------------|-----------------|---------|
| **high** | Desktop GPU (WebGL2) | 8,000 | Full | Bloom + ToneMap + Lens | On |
| **mid** | Laptop / iPad Pro | 4,000 | Simplified vertex | Bloom only | Off |
| **low** | Phone / Intel GPU | 1,500 | Minimal | ToneMap only | Off |

Detection via: `navigator.hardwareConcurrency`, `renderer.capabilities`, and a manual quality dropdown in settings.

### 7.2 Rendering Optimizations

- **InstancedMesh** for all repeated geometry (particles, stars, fractal units). Single draw call per type.
- **LOD (Level of Detail)**: Fractal objects switch to lower subdivision levels at distance > 3 units away from camera.
- **useFrame throttling**: Custom hook caps R3F frame callback to 30 FPS on `low`, 48 FPS on `mid`. Achieved via `requestAnimationFrame` skip-counting.
- **Object pooling**: Particle systems reuse dead particles instead of alloc/dealloc. Pre-allocated buffers.
- **Frustum culling**: Three.js built-in; objects outside camera frustum skip render.
- **Texture atlas**: Shared sprite sheet for all glow sprites (single GPU upload instead of many).

### 7.3 Memory & Battery

- **Dispose pattern**: On world change, `useEffect` cleanup calls `geometry.dispose()`, `material.dispose()`, `texture.dispose()` on all Three.js objects to prevent GPU memory leaks.
- **Audio pooling**: Tone.js synth nodes are reused across world transitions; only the patch/preset changes. Avoids creating new AudioContexts.
- **Canvas reuse**: Single `<Canvas>` lives for entire session. Route changes swap scene children, never remount the Canvas (avoids WebGL context loss + shader recompilation).
- **requestIdleCallback** for non-critical analytics sends.

---

## 8. Component Specifications

### 8.1 `App`

```typescript
// No props (root component)
```

| Responsibility | Connections |
|----------------|-------------|
| Mounts BrowserRouter, sets up error boundary | Router → Layout |
| Provides Suspense boundary for world chunks | AudioEngine (sibling) |

### 8.2 `Layout`

```typescript
interface LayoutProps {
  children?: React.ReactNode; // Route outlet
}
```

| Responsibility | Connections |
|----------------|-------------|
| Owns the R3F `<Canvas>` lifecycle | Renders ActiveWorld inside Canvas |
| Wraps children with PostEffects | Reads worldStore.current for transition |
| Handles canvas resize via useHelper | Provides AudioContext to children |

### 8.3 `WorldSelector`

```typescript
interface WorldSelectorProps {
  worlds: WorldEntry[];      // [{ id, label, color }]
  activeWorld: string;       // current world id
  onSelect: (worldId: string) => void;
  isTransitioning: boolean;  // disable during animation
}
```

| Responsibility | Connections |
|----------------|-------------|
| Renders 4 diegetic glowing orbs in bottom-center | Calls worldStore.setWorld() on tap |
| Orb colors match world aesthetic | Reads worldStore.transitionPhase to disable |
| Mobile: expands to full-width bottom sheet on tap | Connected to settingsStore for visibility toggle |
| Variants: desktop (hover labels), mobile (touch targets 44px+) | |

### 8.4 `AudioEngine`

```typescript
interface AudioEngineProps {
  currentWorld: string;
  volume: number;        // 0–1
  isMuted: boolean;
}
```

| Responsibility | Connections |
|----------------|-------------|
| Manages Tone.js synth lifecycle | Listens to worldStore.currentWorld |
| Crossfades between soundscapes (1.5s) | Reads settingsStore.volume |
| Handles AudioContext resume (user gesture) | No direct DOM interaction — pure audio |
| Disposes synths on unmount | |

### 8.5 `TheDrift` (example world)

```typescript
interface WorldBaseProps {
  quality: 'high' | 'mid' | 'low';
  transitionPhase: 'idle' | 'entering' | 'exiting';
}

// TheDrift extends WorldBaseProps with no additional props
```

| Responsibility | Connections |
|----------------|-------------|
| Creates InstancedMesh of 4K/2K/1K star sprites | Uses useFrame for particle animation |
| 3 parallax layers with different velocities | Connects to CameraController for auto-orbit |
| Star twinkle via vertex shader uniform | Cleans up geometries on unmount |
| Subtle color shift over hours (real-time clock) | |

### 8.6 `Singularity` (example world — complex)

```typescript
interface SingularityProps extends WorldBaseProps {
  lensIntensity: number;  // 0–1, modulated during transition
}
```

| Responsibility | Connections |
|----------------|-------------|
| Recursive subdivision of platonic solids | Custom gravitational lens shader applied as post effect |
| Edge glow via custom shader material | Uses useFrame for vertex displacement |
| LOD system: 3 subdivision levels based on camera distance | On 'exiting': lensIntensity ramps to 2.0 for warp effect |
| Fractal rotation speed inversely proportional to depth | |

### 8.7 `OverlayUI`

```typescript
interface OverlayUIProps {
  worldTitle: string;
  visitCount: number | null;
  showNavigation: boolean;  // auto-hide after 5s idle
}
```

| Responsibility | Connections |
|----------------|-------------|
| Renders world name in top-left (thin font, low opacity) | Reads analyticsStore.visitCount |
| Visit counter bottom-right ("127 visitors") | Hides cursor after no movement (diegetic) |
| Auto-hides nav after idle; tap anywhere reveals | Connects to worldStore for title |

### 8.8 `useWorldTransition`

```typescript
interface UseWorldTransitionReturn {
  phase: 'idle' | 'entering' | 'exiting';
  progress: number;       // 0→1 during any phase
  setWorld: (id: string) => void;
  currentWorld: string;
}
```

| Responsibility | Connections |
|----------------|-------------|
| 1 source of truth for world change timing | Used by Layout, ActiveWorld, TransitionOverlay |
| Manages debounced analytics send | Powered by worldStore internally |

---

## Appendix A: World Registry

```typescript
// src/worlds/index.ts
export const WORLD_REGISTRY = {
  the_drift: {
    id: 'the_drift',
    path: '/drift',
    component: lazy(() => import('./TheDrift')),
    label: 'The Drift',
    color: '#4488ff',
    audioModule: 'driftPad',
  },
  nebula_heart: {
    id: 'nebula_heart',
    path: '/nebula',
    component: lazy(() => import('./NebulaHeart')),
    label: "Nebula's Heart",
    color: '#cc44ff',
    audioModule: 'nebulaBells',
  },
  singularity: {
    id: 'singularity',
    path: '/singularity',
    component: lazy(() => import('./Singularity')),
    label: 'Singularity',
    color: '#ffffff',
    audioModule: 'singularityPulse',
  },
  solar_sail: {
    id: 'solar_sail',
    path: '/solar',
    component: lazy(() => import('./SolarSail')),
    label: 'Solar Sail',
    color: '#ff8833',
    audioModule: 'solarStrings',
  },
} as const;
```

## Appendix B: Zustand Store Shape

```typescript
// src/store/worldStore.ts
interface WorldState {
  currentWorld: string;
  previousWorld: string | null;
  transitionPhase: 'idle' | 'entering' | 'exiting';
  transitionProgress: number; // 0–1

  setWorld: (id: string) => void;
  setTransitionPhase: (phase: WorldState['transitionPhase']) => void;
  setTransitionProgress: (p: number) => void;
}

// src/store/analyticsStore.ts
interface AnalyticsState {
  visits: Record<string, number>; // worldId → count
  sessionId: string | null;
  loading: boolean;
  fetchVisits: () => Promise<void>;
  recordVisit: (worldId: string) => Promise<void>;
}
```

---

*End of architecture document. This blueprint focuses on structure, data flow, and component boundaries — implementation details are deferred to the engineering phase.*
