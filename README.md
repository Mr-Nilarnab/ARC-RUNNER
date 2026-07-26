# ARC.RUNNER

> A high-octane, ember-core evasion arcade game inspired by Chrome's Dinosaur Runner. Built with vanilla HTML5, CSS3, and Web Audio API in a single file.

---

## 📸 Screenshot
<img width="1177" height="572" alt="Screenshot 2026-07-26 225118" src="https://github.com/user-attachments/assets/15cf9c93-afbf-40da-a9b9-78c81b29ac80" />


> Top row: Boot sequence with progress bar | Main menu with PLAY/EXIT | Live gameplay with HUD stats  
> Bottom: The ember-core mech jumping over server stacks and dodging aerial drones

---

## 🎮 About

**ARC.RUNNER** is a retro-futuristic runner game featuring:
- An autonomous **ember-core mech unit** evading server stacks and aerial drones
- JARVIS-inspired HUD interface with pulsing corner brackets and scanning animations
- Dynamic difficulty that scales with your distance
- Full 8-bit style synthesized sound effects (jump, duck, crash, boot beeps, milestone chimes)
- Responsive design for desktop, tablet, and mobile

Built as a **single-file HTML** game — no external dependencies, no assets, no API keys. Just download and play.

---

## ✨ Features

### 🚀 Gameplay
- **Endless runner** with procedurally spawned obstacles
- **Jump** over ground-level server stacks
- **Duck** under flying drone hazards
- **Speed ramps** automatically as you progress (1.0x → 2.7x)
- **Milestone chimes** every 500 meters for psychological rewards
- **Collision detection** with screen shake + red flash feedback

### 🎨 Visuals
- **Ember-red HUD theme** (charcoal background, glowing amber text, crimson accents)
- **Retro-futuristic UI** with:
  - Pulsing corner brackets
  - Animated scanline sweep
  - Grid-pattern floor
  - Real-time particle effects on jump/duck/crash
  - Responsive HUD stats (distance, best score, speed multiplier)

### 🔊 Audio
All sounds are **synthesized live** using the Web Audio API:
- Boot sequence beeps
- Menu clicks (sine wave)
- Jump/duck blips (frequency sweeps)
- Impact crash (noise burst + descending tone)
- Milestone fanfare (triangle wave chimes)
- **Toggle audio on/off** from the HUD (AUDIO button)

### 📱 Screens
1. **Boot Sequence** — 2.6s animated loading with system diagnostics
2. **Main Menu** — PLAY or EXIT options
3. **Game Screen** — Endless runner with pause/resume
4. **Pause Overlay** — P to resume, ESC to quit to menu
5. **Game Over** — "CORE BREACH" message with relaunch option
6. **Exit Screen** — Graceful shutdown message

---

## 🕹️ How to Play

### Installation
1. Download **`arc-runner.html`**
2. Open it in any modern web browser (Chrome, Firefox, Safari, Edge, etc.)
3. That's it! No server, no build process, no node_modules.

### Files Included
```
arc-runner.html       ← The complete game (45 KB, single file)
README.md            ← This documentation
SCREENSHOT.svg       ← Visual preview of all game screens
```

### Controls

| Action | Keyboard | Mobile |
|--------|----------|--------|
| **Jump** | `SPACE` or `↑` | Tap viewport or ▲ JUMP button |
| **Duck** | `↓` | Hold ▼ DUCK button |
| **Pause** | `P` | (N/A) |
| **Resume** | `SPACE` / Tap / `P` | Tap or use buttons |
| **Main Menu** | `ESC` | MAIN MENU button |
| **Restart** | `R` | RELAUNCH button |
| **Toggle Audio** | Click AUDIO stat | Click AUDIO stat |

### Strategy
- **Timing is everything** — jump just as obstacles approach
- **Duck when possible** — it's faster to dodge low hazards than leap
- **Watch the speed multiplier** — difficulty ramps smoothly; stay calm
- **500m milestones** — listen for the chime; it's a mental checkpoint
- **Best score tracking** — beat your personal record on the next run

---

## 🏗️ Architecture

### Single File, No Dependencies
- **HTML5 Canvas** for rendering
- **Web Audio API** for procedural sound synthesis
- **Vanilla JavaScript (ES6)** with no external libraries
- **CSS3 animations** for boot sequence, pulsing effects, screen shake
- **Responsive design** — works from 380px (mobile) to full desktop

### Key Systems
```
┌─────────────────────────────────────┐
│   ARC.RUNNER Game Engine            │
├─────────────────────────────────────┤
│ • Boot sequence & screen state      │
│ • Physics & collision detection     │
│ • Obstacle spawning & movement      │
│ • Particle effects (jump/duck/hit)  │
│ • Web Audio synthesizer             │
│ • Canvas rendering loop (60 FPS)    │
└─────────────────────────────────────┘
```

### Game States
- **`boot`** — Animated boot sequence
- **`menu`** — Main menu (PLAY/EXIT)
- **`exit`** — Exit confirmation screen
- **`game`** — Active gameplay

### Game Substates
- **`ready`** — Waiting to engage (at menu or pre-start)
- **`playing`** — Active gameplay
- **`paused`** — Pause overlay active
- **`gameover`** — Core breach; waiting for relaunch

---

## 📊 Performance

- **File size**: ~45 KB (single HTML file)
- **Memory footprint**: <5 MB
- **Frame rate**: 60 FPS (locked via requestAnimationFrame)
- **CPU usage**: Minimal (canvas-based, no DOM animations except UI)
- **Mobile-friendly**: Optimized for touch input, works on iOS Safari & Android Chrome

---

## 🎨 Customization

Want to tweak colors, difficulty, or gameplay? Open the HTML file in a text editor:

### Change color scheme
Look for `:root` CSS variables (lines 8–20):
```css
--void: #0b0907;           /* Background */
--ember: #ff4620;          /* Primary accent (red) */
--amber: #ffb545;          /* Secondary accent (gold) */
```

### Adjust difficulty
In the JavaScript, find these constants:
- `nextSpawn` — how often obstacles appear (lower = harder)
- `speed` — base speed and ramp rate
- `GROUND_Y - 50` — player height (affects jump/duck hitboxes)

### Modify boot sequence messages
Edit the `BOOT_LINES` array (line 391):
```javascript
const BOOT_LINES = [
  'INITIALIZING CORE...',
  'CALIBRATING EMBER REACTOR...',
  // ... customize here
];
```

---

## 🎯 Game Mechanics

### Spawning
- Obstacles spawn at increasing frequency as score rises
- Mix of ground stacks (~68%) and aerial drones (~32%)
- Random sizes for visual variety
- Wave intervals shrink from 1.25s to 0.6s minimum

### Physics
- Gravity constant: `0.62 px/frame`
- Jump velocity: `-11.4 px/frame`
- Terminal velocity: capped by ground collision
- Duck reduces hitbox to 58×26 pixels (vs 42×50 standing)

### Scoring
- Base score: `0.9 points/frame`
- Multiplied by speed factor (1.0x to 2.7x)
- Speed ramps at `0.0045 per meter`
- Milestone bonus: audible chime every 500m

---

## 🐛 Known Limitations

- **Audio context**: Browser may require user interaction before audio plays (security policy)
- **Fullscreen**: Not available (intentional — retro HUD aesthetic)
- **Mobile Safari**: Muted by default (requires tap to unmute); works after first interaction
- **Window.close()**: Browsers block programmatic window closure for security; Exit screen shows prompt instead

---

## 🏆 Tips for High Scores

1. **Rhythm over reflexes** — develop muscle memory for jump timing
2. **Stay centered** — keep the mech near the middle of the screen
3. **Duck low hazards** — save jumps for tall stacks
4. **Audio feedback** — listen for the start chime and milestone beeps
5. **Multiple runs** — first run is always hardest; you'll improve

---

## 📝 Credits

**Creator:** MR. NILARNAB  
**GitHub:** MR NILARNAB GITHUB  
**Built:** July 2026  
**Engine:** HTML5 Canvas + Web Audio API  
**License:** Free to use, modify, and share

---

## 🔗 Similar Games

If you enjoy ARC.RUNNER, try:
- **Chrome Dinosaur Game** (the inspiration!)
- **Flappy Bird**
- **2048**
- **Crossy Road**

---

## 📞 Feedback & Issues

Found a bug? Have a feature idea? This is a single-file game made for fun — fork it, modify it, share it!

---

**Last Updated:** July 26, 2026  
**File:** `arc-runner.html` (45 KB, single file)

---

*"Arc-core evasion unit online. Clear the hazard grid. Hold the line."* ⚡🎮
