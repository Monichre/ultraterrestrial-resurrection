export const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uCameraPosition;
uniform vec3 uCameraLookAt;

varying vec2 vUv;

// Ray marching constants
const int MAX_STEPS = 100;
const float MAX_DIST = 100.0;
const float SURF_DIST = 0.01;

// Signed Distance Functions (SDFs)
float sphereSDF(vec3 p, vec3 center, float radius) {
  return length(p - center) - radius;
}

float boxSDF(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float torousSDF(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// Add sinusoidal deformation to point coordinates
vec3 deform(vec3 p) {
  float deformAmount = 0.3 * sin(uTime * 0.5);
  p.x += deformAmount * sin(p.y * 3.0 + uTime);
  p.y += deformAmount * sin(p.z * 2.0 + uTime * 1.2);
  p.z += deformAmount * sin(p.x * 2.5 + uTime * 0.7);
  return p;
}

// Scene SDF - combines all objects
float sceneSDF(vec3 p) {
  vec3 deformedP = deform(p);
  
  // Animated position for sphere
  vec3 sphereCenter = vec3(
    2.0 * sin(uTime * 0.7),
    1.0 * cos(uTime * 0.5),
    0.0
  );
  
  // Create scene with multiple objects
  float sphere1 = sphereSDF(p, sphereCenter, 1.0);
  float sphere2 = sphereSDF(p, vec3(-1.5, 0.0, 0.0), 1.2);
  float box = boxSDF(deformedP - vec3(0.0, 0.0, 2.0), vec3(1.0));
  float torus = torousSDF(deformedP - vec3(0.0, -2.0, 0.0), vec2(2.0, 0.5));
  
  // Mouse influence creates a floating sphere
  vec3 mousePos = vec3(uMouse.x * 3.0, uMouse.y * 3.0, 0.0);
  float mouseSphere = sphereSDF(p, mousePos, 0.5);
  
  // Combine objects using smooth min
  float k = 1.0;  // Blending factor
  float d = sphere1;
  d = min(d, sphere2);
  d = min(d, box);
  d = min(d, torus);
  d = min(d, mouseSphere);
  
  return d;
}

// Calculate normal at a point
vec3 calcNormal(vec3 p) {
  float epsilon = 0.001;
  vec3 e = vec3(epsilon, 0.0, 0.0);
  
  return normalize(vec3(
    sceneSDF(p + e.xyy) - sceneSDF(p - e.xyy),
    sceneSDF(p + e.yxy) - sceneSDF(p - e.yxy),
    sceneSDF(p + e.yyx) - sceneSDF(p - e.yyx)
  ));
}

// Ray marching function
float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  
  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneSDF(p);
    dO += dS;
    if(dO > MAX_DIST || dS < SURF_DIST) break;
  }
  
  return dO;
}

// Basic lighting calculation
vec3 calculateLighting(vec3 p, vec3 normal) {
  // Key light
  vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
  float diff1 = max(dot(normal, lightDir1), 0.0);
  vec3 lightCol1 = vec3(1.0, 0.8, 0.6) * diff1;
  
  // Fill light
  vec3 lightDir2 = normalize(vec3(-1.0, 0.5, -0.5));
  float diff2 = max(dot(normal, lightDir2), 0.0) * 0.5;
  vec3 lightCol2 = vec3(0.4, 0.6, 1.0) * diff2;
  
  // Ambient light
  vec3 ambient = vec3(0.1, 0.1, 0.2);
  
  // Combine lighting
  return lightCol1 + lightCol2 + ambient;
}

void main() {
  // Normalize coordinates
  vec2 uv = vUv;
  uv = (uv - 0.5) * 2.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Setup camera
  vec3 ro = uCameraPosition;  // Ray origin (camera position)
  vec3 rd = normalize(vec3(uv, -1.0));  // Ray direction
  
  // Ray marching
  float d = rayMarch(ro, rd);
  
  // Set base color
  vec3 color = vec3(0.05, 0.05, 0.1);  // Background color
  
  // If ray hit something
  if(d < MAX_DIST) {
    vec3 p = ro + rd * d;  // Intersection point
    vec3 normal = calcNormal(p);
    
    // Calculate lighting
    vec3 lighting = calculateLighting(p, normal);
    
    // Set color based on position and time
    vec3 objColor = 0.5 + 0.5 * sin(p * 0.5 + uTime * 0.3);
    
    // Add some reflections from normal
    objColor += normal * 0.2;
    
    // Combine object color with lighting
    color = objColor * lighting;
    
    // Add fog based on distance
    float fogAmount = 1.0 - exp(-0.02 * d);
    color = mix(color, vec3(0.05, 0.05, 0.1), fogAmount);
  }
  
  // Apply gamma correction and output final color
  color = pow(color, vec3(0.4545));  // Gamma correction
  gl_FragColor = vec4(color, 1.0);
}
`;
