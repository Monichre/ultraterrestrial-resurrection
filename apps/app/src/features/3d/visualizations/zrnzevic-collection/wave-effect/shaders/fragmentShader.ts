export const fragmentShader = `
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;
varying float vElevation;

void main() {
  // Mix colors based on elevation
  vec3 color = mix(uColorA, uColorB, vElevation * 5.0 + 0.5);
  
  // Add some depth to the waves
  float intensity = 1.0 - clamp(vElevation * 10.0, 0.0, 1.0);
  
  gl_FragColor = vec4(color, intensity);
}
`;
