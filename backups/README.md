# Animation Backups

This folder contains saved versions of the MyGlobal Group website with different animation implementations.

## Available Backups

### `App-realistic-birds-v1.tsx` 
**Date**: 2025-08-07  
**Description**: Complete realistic bird animation with enhanced flocking behavior
- **Features**:
  - 80-100 realistic aerodynamic birds (not V-shapes)
  - Streamlined body, curved wings, beak, and tail feathers  
  - Boids algorithm (separation, alignment, cohesion)
  - Progressive M-V-G letter formation
  - Particle trails and glow effects
  - Leader-follower dynamics (10% leaders)
  - 24-second epic cycle timing
  - Vortex transitions between formations
  - Speed-responsive wing animation
  - Feather details on larger birds

### `App-boids-murmuration-v1.tsx`
**Date**: 2025-08-07  
**Description**: Natural boids murmuration with organic flocking behavior
- **Features**:
  - 80-120 realistic birds with natural flocking
  - Pure boids algorithm (alignment, cohesion, separation, center attraction)
  - No forced formations - completely organic movement
  - Leader-follower dynamics (8% leaders with enhanced perception)
  - Varied bird speeds and agility for realistic diversity
  - Subtle particle trails and glow effects
  - Edge wrapping for seamless boundaries
  - Speed-responsive wing animation and rendering
  - Natural murmuration patterns and flow

### `App-dense-murmuration-v1.tsx`
**Date**: 2025-08-07  
**Description**: Dense murmuration with massive flocks and organic flowing shapes
- **Features**:
  - 400-800 tiny birds (0.8-1.5px) for proper murmuration density
  - Organic flowing shapes using noise-based flow fields
  - Natural letter formation (M/G) emerging randomly from flow
  - Enhanced cohesion (2.0x) for dense cluster formation
  - Soft boundary repulsion to keep flocks visible
  - Leaders with enhanced perception for natural guidance
  - Emergent wave patterns and collective behavior
  - Realistic murmuration dynamics like nature documentaries
  - Occasional attractor points for natural letter emergence

### `App-coordinated-flocks-v1.tsx`
**Date**: 2025-08-07  
**Description**: Coordinated multiple flocks with timed letter formations
- **Features**:
  - 500-800 birds organized into 3-4 distinct flocks
  - Each flock starts clustered and flows organically
  - Different colored flocks (blue, teal, amber, red)
  - Letter formations (M/G) every 3-5 seconds with random flocks
  - Proven letter-formation algorithm with murmuration dynamics
  - Dynamic weighting: strong flocking during organic flow, strong formation during letters
  - Formation progress system with smooth transitions
  - Leaders (6%) with enhanced perception within each flock
  - Random letter positions and 2-3 second letter hold times
  - Perfect balance of organic behavior and coordinated intelligence

### `App-simple-fixed-letters-v1.tsx`
**Date**: 2025-08-07  
**Description**: Simplified reliable version with fixed letter positions
- **Features**:
  - 500-700 birds in single unified flock (original blue color)
  - Fixed letter positions: M on left (30%), G on right (70%)
  - Reliable timing: flow (5-7s) → M (2-3s) → flow (5-7s) → G (2-3s) → repeat
  - Clean M formation algorithm (4 strokes: left vertical, left diagonal, right diagonal, right vertical)
  - Clean G formation algorithm (80% C-arc, 20% horizontal bar)
  - Smooth transitions with formation strength fading
  - Natural clustering at start for organic appearance
  - Soft edge boundaries
  - Leaders (5%) with enhanced visual presence
  - Proven to work reliably with clear letter formation

### `App-bold-simultaneous-MG-v1.tsx`
**Date**: 2025-08-07  
**Description**: Bold simultaneous M & G formations with holding phase
- **Features**:
  - 800-1200 tiny birds (0.8-1.2px) for extremely dense, bold letters
  - **SIMULTANEOUS M & G formation** - both letters appear at once!
  - M on left (25% position), G on right (75% position)
  - 4-phase cycle: flow → forming → **holding** → dispersing → repeat
  - Letters **hold for 1-2 seconds** for perfect visibility
  - Thicker letter strokes with variation (8px thickness variation)
  - Bigger letter sizes (M: 150x120px, G: 75px radius)
  - Very strong formation forces (3x maxForce) for tight, crisp letters
  - Brighter blue color for better visibility
  - Smart alignment - birds only align with same-letter birds during formation
  - 5-7 second flow periods between formations
  - Less background fade (0.04) for clearer letter visibility

### `App-fast-MG-proven-G-v1.tsx` ⭐ **CURRENT - FINAL**
**Date**: 2025-08-07  
**Description**: Fast initial formation with proven G design
- **Features**:
  - Same as `App-bold-simultaneous-MG-v1.tsx` PLUS:
  - **FAST FIRST FORMATION** - letters appear in just 1.7 seconds on page load!
  - **PROVEN G FORMATION** - uses the perfected G design we spent hours refining:
    - 80% birds form C-arc (counter-clockwise, 1.6π radians)
    - 20% birds form left-pointing arrow inside the C
    - startAngle: -0.1π, arcLength: 1.6π
    - Arrow: 40px left, 35px spread for clear visibility
  - After first formation: normal 5-7 second flow periods
  - **3x faster initial impact** - visitors see letters immediately
  - Perfect balance of speed and clarity

## 8. App-3d-depth-v-birds-v1.tsx
- **Features**: Simple V-shaped birds with 3D depth effect
- **Bird Count**: 150-250 birds
- **Visual Style**: Simple V-shapes like reference image with depth-based size scaling
- **Special Effects**: 
  - Birds scale from 0.3x to 2x based on depth
  - Atmospheric perspective (farther birds are more faded)
  - Color changes with depth (lighter when closer)
  - Subtle wing angle animation
  - Glow effect for closest birds
- **Letter Formation**: M and G with 3D depth variation
- **Performance**: Optimized with fewer, larger birds
- **Status**: Active implementation with stunning depth effect

## 9. App-three-flocks-MGG-v1.tsx ⭐ LATEST
- **Features**: Three distinct flocks forming M G G letters
- **Bird Count**: 300 total (100 per flock)
- **Visual Style**: Tiny V-shaped birds (3-5px base size)
- **Special Effects**:
  - Three colors: Blue (M), Orange (G1), Green (G2)
  - Depth-based scaling (0.6x to 1.4x)
  - Beautiful murmuration behavior between formations
  - Immediate letter formation on start
- **Letter Formation**: 
  - M G G letters displayed simultaneously
  - Larger letter size (150px height for M, 75px radius for G)
  - Letters form for 1 second, hold for 1 second
  - 10-second cycle (letters every 10 seconds)
- **Performance**: Optimized with tiny birds and efficient flocking
- **Status**: Active implementation with three-letter formation

## 10. App-all-blue-proper-G-v1.tsx
- **Features**: Three flocks all in blue forming M G G with proper G shape
- **Bird Count**: 300 total (100 per flock)
- **Visual Style**: Tiny V-shaped birds (3-5px base size) all in blue
- **Special Effects**:
  - Single color (blue) for all flocks with depth variation
  - Depth-based scaling (0.6x to 1.4x)
  - Beautiful murmuration behavior between formations
  - Immediate letter formation on start
- **Letter Formation**: 
  - M G G letters displayed simultaneously  
  - Proper G with C-arc (65%), horizontal bar (20%), vertical line down (15%)
  - Larger letter size (150px height for M, 75px radius for G)
  - Letters form for 1 second, hold for 1 second
  - 8-second cycle (letters every 8 seconds)
- **Performance**: Optimized with tiny birds and efficient flocking
- **Status**: Active implementation with corrected G formation

## 11. App-all-blue-proper-G-fixed-sections-v1.tsx ⭐ LATEST
- **Features**: Three flocks all in blue forming M G G with proper G shape - FIXED canvas positioning
- **Bird Count**: 300 total (100 per flock)
- **Visual Style**: Tiny V-shaped birds (3-5px base size) all in blue
- **Special Effects**:
  - Single color (blue) for all flocks with depth variation
  - Depth-based scaling (0.6x to 1.4x)
  - Beautiful murmuration behavior between formations
  - Immediate letter formation on start
- **Letter Formation**: 
  - M G G letters displayed simultaneously  
  - Proper G with C-arc (65%), horizontal bar (20%), vertical line down (15%)
  - Larger letter size (150px height for M, 75px radius for G)
  - Letters form for 1 second, hold for 1 second
  - 8-second cycle (letters every 8 seconds)
- **Performance**: Optimized with tiny birds and efficient flocking
- **FIX**: Changed canvas from `position: fixed` to `position: absolute` to stop covering other sections
- **Status**: FIXED version - all website sections are now visible

## How to Restore a Backup

To restore any backup version:
```bash
cp backups/[backup-filename] src/App.tsx
```

Then redeploy:
```bash
gcloud builds submit --config cloudbuild.yaml --substitutions _SERVICE_NAME=myglobal-group-app,_REGION=us-west1,_REGISTRY_HOSTNAME=gcr.io,_PORT=8080,_MEMORY=512Mi,_CPU=1,_MIN_INSTANCES=0,_MAX_INSTANCES=3,_CONTAINER_CONCURRENCY=80,_TIMEOUT_SECONDS=300,_NODE_VERSION=18,_NGINX_VERSION=alpine,_AUTH_FLAG=--allow-unauthenticated,_GEMINI_API_KEY=not-needed
``` 