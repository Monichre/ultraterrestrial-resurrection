export const fragmentShader = `
uniform vec3 uColorTerrain;
uniform vec3 uColorValley;

varying float vElevation;
varying vec2 vUv;

void main() {
  // Normalize elevation to 0-1 range for color mapping
  float normalizedElevation = (vElevation + 1.0) * 0.5;
  
  // Create color gradient based on elevation
  vec3 color = mix(uColorValley, uColorTerrain, normalizedElevation);
  
  // Add lighting effect based on slopes
  float lightIntensity = 0.5 + 0.5 * normalizedElevation;
  color *= lightIntensity;
  
  // Add subtle grid pattern
  float gridSize = 50.0;
  float gridLine = 0.02;
  
  vec2 grid = step(gridLine, mod(vUv * gridSize, 1.0));
  float gridMask = min(grid.x, grid.y);
  
  // Apply grid effect subtly
  color = mix(color * 0.7, color, gridMask);
  
  gl_FragColor = vec4(color, 1.0);
}
`;
