# HomeHero3dQuality — Pseudocode

**Goal:** Restore cinematic 3D asset fidelity on the home hero (Earth + Moon) and tighten scroll-driven camera motion. Rendering quality has degraded from leftover debug geometry, antialias-off canvases, aggressive tilt-shift, and a raymarch shader that replaced the Moon GLB materials.

**Scope:** `Earth.tsx`, `Moon.tsx` (+ light journey stop polish if needed). Do not rewrite the GSAP master timeline.

---

## Diagnosis (confirmed)

1. **Earth** — debug red `boxGeometry` still in `EarthGLB`; Canvas lacks `dpr` / antialias / ACES tone mapping; console spam; GLB scene used without clone or texture anisotropy.
2. **Moon** — original PBR (`materials.Material_39`) replaced by a heavy raymarch `shaderMaterial`; `gl={{antialias: false}}`; `TiltShift2 blur={0.35}` smears the frame; Bloom stacks on top.
3. **Reference quality bar** — `PlanetJourneyFixed` / `hero-scene`: `dpr={[1,2]}`, `antialias: true`, `ACESFilmicToneMapping`, `SRGBColorSpace`, `powerPreference: 'high-performance'`.

---

## Pseudocode

### Shared helper (inline per file — avoid new package churn)

```
FUNCTION hardenGltfObject(root):
  root.traverse(child):
    IF child.isMesh:
      child.castShadow = false  // hero canvases are unshadowed; keep cheap
      child.receiveShadow = false
      IF child.material:
        materials = Array.isArray(child.material) ? child.material : [child.material]
        FOR each mat IN materials:
          FOR each mapKey IN [map, normalMap, roughnessMap, metalnessMap, aoMap, emissiveMap]:
            IF mat[mapKey]:
              mat[mapKey].anisotropy = min(rendererMaxAnisotropy OR 8, 16)
              IF mapKey == 'map' OR mapKey == 'emissiveMap':
                mat[mapKey].colorSpace = SRGBColorSpace
              mat[mapKey].needsUpdate = true
          IF mat.isMeshStandardMaterial OR mat.isMeshPhysicalMaterial:
            mat.envMapIntensity = mat.envMapIntensity ?? 0.6
          mat.needsUpdate = true
  RETURN root
```

### Moon.tsx

```
REMOVE raymarch shaderMaterial block entirely

MoonScene:
  { nodes, materials } = useGLTF(MOON_GLB)
  meshRef = useRef
  useFrame: meshRef.rotation.y += delta * MOON_SPIN  // ~0.06

  RETURN:
    <group>
      <mesh
        ref={meshRef}
        geometry={nodes['Sphere001_Material_#39_0'].geometry}
        material={materials.Material_39}
        material-normalScale={[1.35, 1.35]}
        material-roughness={0.92}
        material-metalness={0.02}
        scale={0.04}
      />
      <spotLight position={[10, 0, -10]} intensity={2.2} angle={0.28} penumbra={0.85} color="#f2f0ea" />
      <directionalLight position={[-4, 2, 6]} intensity={0.35} color="#9db8ff" />
    </group>

  ON mount (useLayoutEffect once): harden textures on materials.Material_39

Moon Canvas:
  dpr={[1, 2]}
  gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false }}
  onCreated:
    clearColor black
    outputColorSpace = SRGBColorSpace
    toneMapping = ACESFilmicToneMapping
    toneMappingExposure = 1.15

  Post:
    KEEP subtle Bloom (luminanceThreshold ~0.85, intensity ~0.4, mipmapBlur)
    REMOVE TiltShift2 entirely  // primary smear culprit
  Keep MoonJourneyRig unchanged API
```

### Earth.tsx

```
REMOVE:
  debug red box mesh
  development console.info spam in EarthGLB / EarthJourneyRig / onCreated
  unused framer-motion-3d import from hot path if EN stays isolated

EarthGLB:
  { scene } = useGLTF(EARTH_GLB_URL)
  cloned = useMemo(() => hardenGltfObject(scene.clone(true)), [scene])
  earthRef on group wrapping primitive OR on primitive
  Lights:
    ambient 0.28
    key directional 2.6 warm-white at [1.2, 0.4, -0.2]
    cool fill 0.7 at [-2, 1, 4] #9db8ff
    optional rim 0.35 at [-1, 0.2, -3] #c8d8ff
  RETURN:
    lights + <primitive ref={earthRef} object={cloned} scale={2.5} rotation-y={0.5} />

  OPTIONAL atmosphere (cheap):
    BackSide sphere scale ~2.62, meshBasicMaterial color #6ea8ff opacity 0.08 transparent depthWrite=false
    // only if it reads as lift, not glow spam

Earth Canvas:
  dpr={[1, 2]}
  camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
  gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false }}
  onCreated: same ACES + SRGB as Moon, exposure ~1.1
  Keep EarthJourneyRig; bump damp lambda slightly (4 → 5) for snappier scrub follow
```

### Journey motion polish (optional, same files)

```
EARTH_CAM_Z: keep stops; ensure departure push feels closer (3.4 ok)
MOON_CAM_Z: keep stops
Idle: EARTH_SPIN_RATE 0.08 (slightly slower = more massive), FLOAT_AMP 0.06
Moon spin 0.05–0.07
```

### home-animated.tsx

```
NO structural rewrite
IF canvases paint black boxes due to wrapper bg-black fighting alpha=false — leave as-is (already intentional)
```

### Docs

```
WRITE HomeHero3dQuality.md — architecture, quality settings, before/after causes
UPDATE ANIMATION_SEQUENCE.md briefly if camera constants change
```

---

## Verification

1. Load `/` — Earth shows textured globe, no red cube.
2. Moon shows cratered PBR surface, sharp edges (no tilt-shift smear).
3. Scroll Act 2 — cameras still scrub; flyby z-swap intact.
4. `prefers-reduced-motion` still hits staticMode path.
5. No new WebGL errors in console.
```
