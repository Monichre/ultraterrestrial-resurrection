export const vertexShader = `
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  
  // Create wave effect
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  float elevation = sin(modelPosition.x * 10.0 + uTime * 2.0) * 0.1;
  elevation += sin(modelPosition.y * 10.0 + uTime * 2.0) * 0.1;
  
  modelPosition.z += elevation;
  vElevation = elevation;
  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;
}
`;
