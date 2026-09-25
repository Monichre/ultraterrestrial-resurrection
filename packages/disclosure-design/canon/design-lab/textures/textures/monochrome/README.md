# R3F texture prep package

This package contains pre-sized, power-of-two texture assets derived from your source images.

## What was prepared
- `color` (`.webp`): sRGB texture for visible image data
- `luma` (`.png`): grayscale map for alpha/emissive use
- `height` (`.png`): contrast-boosted grayscale map for displacement use
- `md` variants: fit within 1024px max dimension
- `lg` variants: fit within 2048px max dimension

## Recommended Three.js settings
```ts
texture.colorSpace = THREE.SRGBColorSpace
texture.flipY = false
texture.generateMipmaps = true
texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
```

For luma/height maps:
```ts
map.colorSpace = THREE.SRGBColorSpace
luma.colorSpace = THREE.NoColorSpace
height.colorSpace = THREE.NoColorSpace
```

## Suggested mapping strategy
- Use `color` as `map`
- Use `luma` as `alphaMap` or `emissiveMap`
- Use `height` as `displacementMap`
- Prefer the `md` variants on mobile and the `lg` variants on desktop

## File layout
Everything under `public/` can be copied directly into a Next.js app.
