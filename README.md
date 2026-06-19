# ✦ Interstellar Drift

<p align="center">
  <img src="public/favicon.svg" width="80" alt="Interstellar Drift" />
</p>

<p align="center">
  <em>A procedural deep-space generative art experience.<br>
  No score. No goal. Just presence.</em>
</p>

---

## 🌌 About

**Interstellar Drift** is an interactive, meditative journey through procedurally generated deep space. Every visit reveals a unique universe — nebulae, starfields, and cosmic dust that will never exist in exactly the same configuration again.

Drift through the cosmos with your mouse (or finger), and click to warp to an entirely new universe with a different color palette and atmosphere.

## ✨ Features

- **5 Color Worlds** — Nebula Purple, Cosmic Teal, Golden Void, Deep Indigo, Aurora Shift — each with its own palette and mood
- **Procedural Nebulae** — Perlin noise-driven gas clouds that shift and breathe
- **Three-Layer Parallax** — Distant, mid, and near starfields drifting at different speeds for true depth
- **Cosmic Dust** — Hundreds of particles with organic movement and life cycles
- **Click to Warp** — Flash into a new universe with speed-line transitions
- **Ambient Soundscape** — Procedural cosmic drone generated live via Web Audio API (bass, harmonics, filtered "cosmic wind")
- **Vignette & Scanlines** — Subtle visual treatments for that "looking through something" feel
- **Fullscreen Mode** — Press `F` to go fullscreen
- **Mute Toggle** — Press `M` to toggle the ambient soundscape
- **Mobile Support** — Touch-optimized, works on any device

## 🎮 Controls

| Input | Action |
|-------|--------|
| **Mouse / Touch drag** | Drift through space |
| **Click / Tap** | Warp to a new universe |
| **Spacebar** | Warp |
| **F** | Toggle fullscreen |
| **M** | Toggle ambient audio |

## 🛠️ Tech Stack

- **[p5.js](https://p5js.org/)** — Creative coding library for the canvas rendering
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** — Procedural ambient drone generation
- **[Vite](https://vitejs.dev/)** — Build tool and dev server
- **[Vercel](https://vercel.com/)** — Deployment

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/ahmedayman10/interstellar-drift.git
cd interstellar-drift

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
interstellar-drift/
├── index.html           # Entry HTML
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
├── public/
│   └── favicon.svg      # Star favicon
└── src/
    ├── main.js          # p5.js sketch (instance mode) — core rendering
    ├── config.js        # Color world palettes & constants
    └── audio.js         # Web Audio API ambient soundscape
```

## 🎨 The Five Worlds

| World | Palette | Mood |
|-------|---------|------|
| **Nebula Purple** | Deep violets, cool blues, gold accent | Classic deep space — mysterious, vast |
| **Cosmic Teal** | Cold teals, icy blues, warm amber | Infinite, serene, drifting forever |
| **Golden Void** | Warm browns, deep ambers, burnt orange | Ancient, warm, primordial |
| **Deep Indigo** | Dark blues, muted purples, lavender accent | Contemplative, quiet, introspective |
| **Aurora Shift** | Vibrant teals, magentas, shifting greens | Alive, ethereal, electric |

## 🧬 Philosophy

> *"You are not going anywhere. You are not achieving anything. You are just... here. Drifting through light that existed before you and will exist after. There is no score because presence is not measured. There is no goal because the cosmos has none."*

Interstellar Drift is a meditation on scale, presence, and the beauty of the procedural — the idea that infinite complexity can emerge from simple rules, and that every moment in a generated universe is precious precisely because it will never repeat.

## 📄 License

MIT — drift freely.

---

<p align="center">
  <sub>Built with ✦ by <a href="https://github.com/ahmedayman10">Ahmed</a> + <a href="https://github.com/nousresearch/hermes-agent">Hermes Agent</a></sub>
</p>
