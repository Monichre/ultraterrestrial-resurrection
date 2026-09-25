export const fragmentShader = `
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec4 data = texture2D(uTexture, vUv);
  
  // Velocity visualization
  vec2 vel = data.rg;
  float speed = length(vel) * 0.2;
  
  // Dye visualization
  float dye = data.b;
  
  // Create color based on velocity and dye
  vec3 color = mix(
    vec3(0.1, 0.1, 0.4), // Dark blue
    vec3(0.1, 0.5, 0.9), // Light blue
    speed
  );
  
  // Add dye color (purple)
  color = mix(color, vec3(0.7, 0.2, 0.9), dye);
  
  gl_FragColor = vec4(color, 1.0);
}
`;
