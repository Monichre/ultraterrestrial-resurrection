# Three.js / 3D

- Uses Three.js via @react-three/fiber and @react-three/drei exclusively; bare Three.js only for utility code. Confidence: 0.97
- Prefers high-quality asset rendering: PBR materials (meshStandardMaterial with metalness/roughness), proper lighting rigs (directional + ambient). Confidence: 0.88
- Clock-based animation pattern: `useFrame` with delta for smooth, frame-rate-independent motion. Confidence: 0.9
- Performance: pause mixer/animations for off-screen objects; use LOD for distant geometry; cache clips. Confidence: 0.82
- Earth globe zoom level is a tunable prop (reducing initial zoom is a real concern). Confidence: 0.85
- Accepts external 3D asset folders (GLTF/GLB from Downloads or local paths) and integrates them into existing scene components. Confidence: 0.9
- Uses ScrollTrigger + `scrub` to tie Three.js animation progress to scroll position. Confidence: 0.88
