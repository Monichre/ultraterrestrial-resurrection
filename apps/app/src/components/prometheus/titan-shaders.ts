// All colors arrive as linear-space uniforms; the EffectComposer's final pass encodes to sRGB.

const FLICKER_GLSL = /* glsl */ `
  float flicker(float t) {
    return 0.82 + 0.1 * sin(t * 13.0) + 0.06 * sin(t * 29.0 + 1.3) + 0.05 * sin(t * 7.3 + 2.1);
  }
`

const POINT_SIZE_GLSL = /* glsl */ `
  uniform float uPixelScale;
  float pointPixels(float worldSize, vec4 mvPosition) {
    return worldSize * uPixelScale * projectionMatrix[1][1] / max(-mvPosition.z, 0.001);
  }
`

export const BODY_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uAssembly;
  uniform float uFireGlow;
  uniform float uFireTime;
  uniform float uPointSize;
  uniform vec3 uFirePos;
  uniform vec3 uCore;
  uniform vec3 uRim;
  uniform vec3 uWarm;
  attribute vec3 aNormal;
  attribute vec3 aStart;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;
  ${FLICKER_GLSL}
  ${POINT_SIZE_GLSL}

  const vec3 CHEST = vec3(0.0, 1.33, 0.03);
  const vec3 KEY_LIGHT = vec3(0.45, 0.55, 0.7);

  void main() {
    // Arrival cascades from the feet up to the torch, so ignition lands on the last particles.
    float delay = mix(aSeed, clamp(position.y / 2.4, 0.0, 1.0), 0.6) * 0.55;
    float progress = clamp((uAssembly - delay) / 0.45, 0.0, 1.0);
    float settle = 1.0 - pow(1.0 - progress, 3.0);

    vec3 home = position;
    float breath = sin(uTime * 1.1) * 0.5 + 0.5;
    vec3 fromChest = home - CHEST;
    float chestWeight = exp(-dot(fromChest, fromChest) / 0.05);
    home += fromChest * chestWeight * breath * 0.03;
    home.y += chestWeight * breath * 0.005;

    vec3 p = mix(aStart, home, settle);
    float unsettled = 1.0 - settle;
    float swirl = unsettled * unsettled * (0.9 + aSeed * 1.2);
    float cs = cos(swirl);
    float sn = sin(swirl);
    p.xz = mat2(cs, -sn, sn, cs) * p.xz;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vec3 viewNormal = normalize(normalMatrix * aNormal);
    float facing = dot(viewNormal, normalize(-mvPosition.xyz));
    float rim = pow(1.0 - abs(facing), 3.0);
    float front = mix(0.07, 1.0, smoothstep(-0.2, 0.25, facing));
    float key = max(dot(aNormal, KEY_LIGHT), 0.0);
    float shimmer = 0.8 + 0.2 * sin(uTime * 0.8 + aSeed * 57.0 + position.y * 4.0);
    float star = step(0.985, aSeed);
    float twinkle = 0.55 + 0.45 * sin(uTime * (1.5 + aSeed * 2.0) + aSeed * 300.0);

    vec3 toFire = uFirePos - position;
    float fireDistance = length(toFire);
    float lambert = max(dot(aNormal, toFire / fireDistance), 0.0);
    float warm = uFireGlow * flicker(uFireTime) * 1.8 * exp(-fireDistance * 1.2);
    warm = clamp(warm * (0.25 + 0.75 * lambert), 0.0, 0.9) * settle;

    vec3 color = mix(uCore, uRim, rim);
    vColor = mix(color, uWarm, warm) * (1.0 + warm * 0.6 + star * twinkle * 0.8);
    float light = max(0.08 + key * key * 0.5, warm * 0.9);
    float body = mix(1.0, light + rim * 0.9 + star * twinkle * 0.6, settle);
    // Additive overlap saturates to white quickly; keep per-point energy low so hue survives.
    vAlpha = body * front * shimmer * 0.42;
    float size = uPointSize * (0.7 + 0.6 * aSeed) * (1.0 + rim * 0.4 + star * 0.9);
    size *= mix(0.75, 1.0, settle);
    gl_PointSize = pointPixels(size, mvPosition);
  }
`

export const FLAME_VERTEX = /* glsl */ `
  uniform float uFireTime;
  uniform float uIgnition;
  uniform float uIntensity;
  uniform float uPointSize;
  uniform vec3 uFirePos;
  uniform vec3 uHot;
  uniform vec3 uMid;
  uniform vec3 uCool;
  attribute vec4 aRandom;
  varying vec3 vColor;
  varying float vAlpha;
  ${FLICKER_GLSL}
  ${POINT_SIZE_GLSL}

  const float FLAME_HEIGHT = 0.5;
  const float FLAME_RADIUS = 0.085;

  void main() {
    float grow = uIgnition * (0.55 + 0.45 * uIntensity);
    float life = fract(uFireTime * (0.9 + aRandom.x * 0.8) + aRandom.y);
    float tongue = floor(aRandom.z * 5.0);
    float lift = 0.75 + 0.25 * sin(uFireTime * (5.0 + tongue * 1.3) + tongue * 2.1);
    float height = FLAME_HEIGHT * grow * lift * (0.7 + 0.6 * aRandom.w);

    float angle = aRandom.w * 6.2831 + uFireTime * 0.7;
    float spread = FLAME_RADIUS * grow * pow(1.0 - life, 0.8) * sqrt(fract(aRandom.x * 7.31));
    float tongueAngle = tongue * 1.2566 + 0.5 * sin(uFireTime * 1.7 + tongue);
    float lean = 0.022 * grow * life;
    vec3 offset = vec3(cos(angle) * spread, pow(life, 0.9) * height, sin(angle) * spread);
    offset.xz += vec2(cos(tongueAngle), sin(tongueAngle)) * lean;
    offset.x += sin(uFireTime * 3.1 + offset.y * 22.0) * 0.012 * life * grow;
    offset.z += cos(uFireTime * 2.6 + offset.y * 17.0) * 0.01 * life * grow;

    vec4 mvPosition = modelViewMatrix * vec4(uFirePos + offset, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float core = 1.0 - smoothstep(0.0, 0.8, spread / max(FLAME_RADIUS * grow, 1e-4));
    vec3 color = mix(uHot, uMid, smoothstep(0.08, 0.45, life - core * 0.2));
    vColor = mix(color, uCool, smoothstep(0.45, 0.95, life)) * (1.0 + core * (1.0 - life) * 0.8);
    float fade = smoothstep(0.0, 0.06, life) * pow(1.0 - life, 1.2);
    vAlpha = fade * uIgnition * flicker(uFireTime + aRandom.z) * min(uIntensity, 1.4) * 0.17;
    gl_PointSize = pointPixels(uPointSize * (1.0 - 0.55 * life) * (0.7 + 0.5 * grow), mvPosition);
  }
`

export const EMBER_VERTEX = /* glsl */ `
  uniform float uFireTime;
  uniform float uIgnition;
  uniform float uDensity;
  uniform float uPointSize;
  uniform vec3 uFirePos;
  uniform vec3 uMid;
  uniform vec3 uCool;
  attribute vec4 aRandom;
  varying vec3 vColor;
  varying float vAlpha;
  ${POINT_SIZE_GLSL}

  void main() {
    float span = 6.0 + aRandom.x * 5.0;
    float age = uFireTime - aRandom.y * span;
    float life = fract(age / span);
    float alive = step(0.0, age) * step(aRandom.z, uDensity);

    float angle = aRandom.w * 6.2831;
    vec3 outward = normalize(vec3(cos(angle), 0.0, sin(angle) * 0.6 + 0.3));
    float drift = life * (0.25 + aRandom.x * 0.95);
    float fall = life * life * (1.6 + aRandom.z * 0.9) - life * 0.1;
    vec3 sway = vec3(sin(uFireTime * 0.9 + aRandom.y * 20.0), 0.0, cos(uFireTime * 0.7 + aRandom.x * 17.0));
    vec3 p = uFirePos + vec3(0.0, 0.1, 0.0) + outward * drift - vec3(0.0, fall, 0.0) + sway * 0.05 * life;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float twinkle = 0.55 + 0.45 * sin(uFireTime * (3.0 + aRandom.x * 5.0) + aRandom.y * 31.0);
    vColor = mix(uCool, uMid, 1.0 - smoothstep(0.0, 0.7, life)) * 1.4;
    vAlpha = alive * uIgnition * twinkle * smoothstep(0.0, 0.04, life) * (1.0 - smoothstep(0.65, 1.0, life));
    gl_PointSize = alive * pointPixels(uPointSize * (0.6 + 0.8 * aRandom.w) * (1.0 - 0.5 * life), mvPosition);
  }
`

export const SPRITE_FRAGMENT = /* glsl */ `
  uniform float uFalloff;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0 || vAlpha <= 0.001) discard;
    gl_FragColor = vec4(vColor, pow(1.0 - d, uFalloff) * vAlpha);
  }
`
