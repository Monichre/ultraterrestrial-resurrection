"use client";
// components/Globe.js
import chroma from "chroma-js";
import {
	OrbitControls,
	Stars,
	shaderMaterial,
	useTexture,
} from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import type React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TransformControls } from "three-stdlib";
extend({ OrbitControls, TransformControls });
// EarthShaderMaterial.js
const EarthShaderMaterial: any = shaderMaterial(
	// Uniforms
	{ texture: new THREE.Texture() },
	// Vertex Shader
	`
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.05 );
      vNormal = normalize( normalMatrix * normal );
      vUv = uv;
    }
  `,
	// Fragment Shader
	`
    uniform sampler2D texture;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vec3 diffuse = texture2D( texture, vUv ).xyz;
      float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );
      vec3 atmosphere = vec3( 0, 1.0, 1.0 ) * pow( intensity, 3.0 );
      gl_FragColor = vec4( diffuse + atmosphere, 0.3 );
    }
  `,
);

extend({ EarthShaderMaterial });
// AtmosphereShaderMaterial.js
// const AtmosphereShaderMaterial = shaderMaterial(
//   // Uniforms
//   {},
//   // Vertex Shader
//   `
//     varying vec3 vNormal;
//     void main() {
//       vNormal = normalize( normalMatrix * normal );
//       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0 );
//     }
//   `,
//   // Fragment Shader
//   `
//     varying vec3 vNormal;
//     void main() {
//       float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );
//       gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
//     }
//   `
// )

// extend({ AtmosphereShaderMaterial })

function Globe() {
	const earthRef: any = useRef();
	const atmosphereRef: any = useRef();

	// Load Earth texture
	const earthTexture: any = useTexture(
		"https://cdn.rawgit.com/dataarts/webgl-globe/2d24ba30/globe/world.jpg",
	); // Replace with your texture path
	console.log("earthTexture: ", earthTexture);

	// Memoize the material to prevent unnecessary re-renders

	const material = new EarthShaderMaterial({
		texture: earthTexture,
	});

	useFrame(() => {
		earthRef.current.rotation.y += 0.001; // Rotate the Earth
	});
	// useFrame((state, delta) => {
	//   earthRef.current.rotation.y += delta / 10
	// })
	// atmosphereRef.current.rotation.y += delta / 10

	return (
		<>
			<mesh ref={earthRef} material={material}>
				<sphereGeometry args={[1, 32, 32]} />
				{/* <earthShaderMaterial key={EarthShaderMaterial.key} attach='material' /> */}
			</mesh>
			{/* <mesh ref={atmosphereRef} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[200, 40, 30]} />
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent={true}
        />
      </mesh> */}
		</>
	);
}

function colorFn(x: number) {
	const c = new THREE.Color();
	c.setHSL(0.441 + x / 2, 0.6, 0.75);
	return c;
}

function Point({ position, scale, color }: any) {
	const meshRef: any = useRef();

	useEffect(() => {
		if (meshRef.current) {
			meshRef.current.lookAt(new THREE.Vector3(0, 0, 0));
		}
	}, []);

	return (
		<mesh ref={meshRef} position={position} scale={scale}>
			<boxGeometry args={[0.75, 0.75, 1]} />
			<meshBasicMaterial color={color} />
		</mesh>
	);
}
export function calculateRadius(itemCount: number) {
	// Calculate the approximate spacing between items on a sphere
	const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

	// Calculate the radius based on the desired item count
	// We start with a heuristic approach for uniform distribution
	// and adjust the radius to ensure items are spread evenly.

	// Estimate initial radius based on empirical observation
	// The value 10 is chosen as a reasonable starting point
	// You might need to adjust it based on your visual inspection or specific requirements
	let radius = 30;

	// Optionally, use a loop to refine the radius based on a target density or other criteria
	for (let i = 0; i < itemCount; i++) {
		const y = 1 - (i / (itemCount - 1)) * 2; // y goes from 1 to -1
		const radiusCorrection = Math.sqrt(1 - y * y);
		const theta = phi * i;

		// Calculate position on the sphere
		const x = Math.cos(theta) * radiusCorrection;
		const z = Math.sin(theta) * radiusCorrection;

		// Adjust radius based on distribution heuristic
		radius = Math.max(radius, Math.sqrt(x * x + y * y + z * z));
	}

	return radius;
}

export const computeWordRefsWithPosition = (
	positionsByRecordId: any,
	items: any[],
) => {
	const radius = calculateRadius(items.length);
	console.log("radius: ", radius);
	const positioned = items.map((item: any, idx: number) => {
		console.log("item: ", item);
		const phi = Math.acos(-1 + (2 * idx) / items.length);
		const theta = Math.sqrt(items.length * Math.PI) * phi;
		const position = new THREE.Vector3().setFromSpherical(
			new THREE.Spherical(radius, phi, theta),
		);
		positionsByRecordId[item?.id] = position;
		return [position, item];
	});

	console.log("positioned: ", positioned);
	return positioned;
};

function DataPoints({ data }: any) {
	console.log("data: ", data);
	return (
		<>
			{data.map(
				(
					{ lat, lng, size, color, id }: any,
					index: React.Key | null | undefined,
				) => {
					const phi = ((90 - lat) * Math.PI) / 180;
					const theta = ((180 - lng) * Math.PI) / 180;

					const x = 200 * Math.sin(phi) * Math.cos(theta);
					const y = 200 * Math.cos(phi);
					const z = 200 * Math.sin(phi) * Math.sin(theta);

					const position = [x, y, z];
					// const position = new THREE.Vector3().setFromSpherical(
					//   new THREE.Spherical(x, y, z)
					// )
					const scaleZ = Math.max(size * 200, 0.1);

					const threeJsColor = new THREE.Color(chroma("#a8e5ee").rgb());
					return (
						<Point
							position={position}
							scale={[1, 1, scaleZ]}
							color={threeJsColor}
							key={id}
						/>
					);
				},
			)}
		</>
	);
}

export function CodePenEarth({ locations }: any) {
	// const [data, setData]: any = useState(locations)

	return (
		<Canvas
			camera={{ position: [0, 0, 1000], fov: 30 }}
			style={{ height: "100%", width: "100%" }}
		>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />

			<Globe />
			<DataPoints data={locations} />

			<OrbitControls />
			<Stars />
		</Canvas>
	);
}
