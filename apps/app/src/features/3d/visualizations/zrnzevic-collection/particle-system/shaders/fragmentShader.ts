export const fragmentShader = `
varying vec3 vColor;

void main() {
  // Create circular particles
  float distanceToCenter = length(gl_PointCoord - 0.5);
  float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
  
  // Add glow effect
  vec3 color = mix(vec3(0.0), vColor, strength);
  float alpha = strength;
  
  gl_FragColor = vec4(color, alpha);
}
`;
