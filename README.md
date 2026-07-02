# The Path — A Nature Walk

A meditative 3D experience where you design your own nature walk and then stroll through it in first person.

---

## What It Is

Trace a winding path through a hexagonal grid, populate the surrounding tiles with trees, flowers, water features and more, then step inside and walk the world you created. The scene features procedural grass, animated birds, distant hills, and dynamic clouds — all rendered in real time in the browser.

---

## How To Use

### 1. Draw Your Path

When the app loads you'll see a hexagonal grid. Click and hold on any tile, then drag to draw a continuous path through the grid. Release the mouse button when you're happy with your route. The path must be continuous — you can't skip tiles or loop back on yourself.

If you don't like what you drew, hit **Reset** at the bottom of the screen and start again.

### 2. Place Nature

Once your path is locked in, the surrounding tiles will glow purple. Click any glowing tile to choose what grows there — trees, flowers, bushes, water features and more. If you'd rather not choose everything individually, click **Fill remaining with nature** at the bottom of the selection dialog to fill in the rest randomly.

When you're satisfied, click **Done — Begin Walk** at the bottom of the screen.

### 3. Walk Your Path

You'll be placed at the start of your path, facing the way ahead. Use the following controls to explore:

| Action        | Keyboard | Mobile     |
| ------------- | -------- | ---------- |
| Walk forward  | W or ↑   | Touch drag |
| Walk backward | S or ↓   | Touch drag |
| Strafe left   | A or ←   | Touch drag |
| Strafe right  | D or →   | Touch drag |
| Look around   | Mouse    | Touch drag |

Click anywhere on the scene to capture the mouse for smoother look controls. Press **Escape** to release the mouse.

---

## Running Locally

```bash
npm install
npm run dev
```

Requires Node.js 18+. Open `http://localhost:5173` in your browser.

---

## Project Structure

```
src/
  components/
    r3f/
      environment/    — Grass, Hills, Birds, Clouds, LightingRig
      grid/           — HexGrid, HexTile, PathLine, StartMarker
      nature/         — Nature item components (trees, flowers, etc.)
      walk/           — WalkScene, WalkCamera, PathRibbon
    ui/               — IntroScreen, BuildHUD, NatureDialog, InstructionDialog
  config/
    grid.config.ts    — Hex grid geometry and colors
    natureItems.config.ts — Master list of placeable nature items
    lighting.config.ts — Day/night lighting presets
    walk.config.ts    — Camera height, walk speed, boundary width etc.
  hooks/
    useHexGrid.ts     — Hex coordinate math
    usePathDrag.ts    — Mouse/touch path drawing interaction
    usePathSpline.ts  — CatmullRom spline from path tile centers
  stores/
    useAppStore.ts    — App phase (intro / build / walk)
    useGridStore.ts   — Path, adjacent tiles, placed nature items
    useWeatherStore.ts — Wind, rain, day/night state
  utils/
    seededRandom.ts   — Deterministic random for consistent forest placement
```

---

## Tuning

Most visual parameters are exposed as constants at the top of their respective files or in `src/config/walk.config.ts`. Key values:

| Value               | Location       | What it does                     |
| ------------------- | -------------- | -------------------------------- |
| `cameraHeight`      | walk.config.ts | Eye height above ground          |
| `walkSpeed`         | walk.config.ts | Forward movement speed           |
| `pathBoundaryWidth` | walk.config.ts | How far you can stray from path  |
| `pathRibbonWidth`   | walk.config.ts | Visual width of dirt path        |
| `mouseSensitivity`  | walk.config.ts | Mouse look sensitivity           |
| `GRASS_HEIGHT`      | Grass.tsx      | Height of grass blades           |
| `GRASS_PATCH_SIZE`  | Grass.tsx      | Area covered by grass            |
| `NUM_GRASS`         | Grass.tsx      | Number of grass instances        |
| `HILLS`             | Hills.tsx      | Hill positions, sizes, distances |
| `FLOCK`             | Birds.tsx      | Bird count, heights, speeds      |

---

## 3D Assets

All GLB models go in `/public/models/` and textures in `/public/textures/`.

### Models Used

fox statue — https://poly.pizza/m/abxyXID5EA
deer / stag — https://poly.pizza/m/cKloIsNcT8
bush with purple flowers — https://poly.pizza/m/U1ymDy8tbY
fern — https://poly.pizza/m/fQ9cPdkwvAY
distant pine tree— https://poly.pizza/m/igSu0cPoBz
tree — https://poly.pizza/m/QVOop92WmG
fountain — https://poly.pizza/m/2guUSHGDPZ
berries — https://poly.pizza/m/6i0oxEqEUVk
red flowers — https://poly.pizza/m/hfPzQAedOe
purple flowers — https://poly.pizza/m/uwJ1rwrZlB
green / pink flowers — https://poly.pizza/m/06_hk2bO2Ix
yellow flowers— https://poly.pizza/m/GvfHo0roi3
tree 2 — https://poly.pizza/m/VfZbAkek1r
boulder — https://poly.pizza/m/34W5ymEePk

Windy Bush courtesy of SahilK and his Elemental Serenity project -- https://github.com/SahilK-027/Elemental-Serenity

---

## Notes

- Grass uses instanced buffer geometry with procedural blade placement — all positions are computed in the vertex shader from `gl_InstanceID`. Grass shader courtesy of SimonDev in his 'GLSL shaders from scratch' course (simondev.io)
- The path spline uses centripetal CatmullRom with midpoint insertion and phantom endpoint points for smooth curves through hex tile centers

---

## Tech Stack

- React + TypeScript
- React Three Fiber + Drei
- Zustand
- Tailwind v4
- Vite + vite-plugin-glsl
