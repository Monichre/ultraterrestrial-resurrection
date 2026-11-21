export const vertexShader = `
uniform float uTime;
uniform float uPixelRatio;

attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Apply subtle movement based on time
  modelPosition.x += sin(uTime + position.z * 5.0) * 0.05;
  modelPosition.y += cos(uTime + position.x * 5.0) * 0.05;
  modelPosition.z += sin(uTime + position.y * 5.0) * 0.05;
  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;
  
  // Size
  gl_PointSize = aSize * 10.0 * uPixelRatio;
  gl_PointSize *= (1.0 / - viewPosition.z); // Size attenuation
  
  // Color
  vColor = aColor;
}
`;
