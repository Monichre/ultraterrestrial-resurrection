"use client";

import { useGSAP } from "@gsap/react";
import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
	Bloom,
	EffectComposer,
	Vignette,
} from "@react-three/postprocessing";
import gsap from "gsap";
import { Suspense, memo, useMemo, useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { IntroFX, type IntroFXHandle } from "./IntroFX";

/* ------------------------------------------------------------------ */
/*  Shared timeline phase signals (so overlays sync without refactor)  */
/* ------------------------------------------------------------------ */

export type IntroPhase =
	| "idle"
	| "approach"
	| "arrival"
	| "orbit"
	| "flicker"
	| "blackout"
	| "static";

const phaseListeners = new Set<(p: IntroPhase) => void>();

export const setIntroPhase = (p: IntroPhase) => {
	phaseListeners.forEach((fn) => fn(p));
};

export const onIntroPhase = (fn: (p: IntroPhase) => void) => {
	phaseListeners.add(fn);
	return () => phaseListeners.delete(fn);
};

/* ------------------------------------------------------------------ */
/*  Atmosphere fresnel                                                */
/* ------------------------------------------------------------------ */

const ATMOS_VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const ATMOS_FRAG = /* glsl */ `
  varying vec3 vN; varying vec3 vV;
  uniform vec3 uColor; uniform float uIntensity; uniform float uPower;
  void main() {
    float f = pow(1.0 - max(dot(vN, vV), 0.0), uPower);
    gl_FragColor = vec4(uColor, f * uIntensity);
  }
`;

const Atmosphere: React.FC<{
	intensity: React.MutableRefObject<number>;
}> = ({ intensity }) => {
	const matRef = useRef<THREE.ShaderMaterial>(null!);
	useFrame(() => {
		if (matRef.current) matRef.current.uniforms.uIntensity.value = intensity.current;
	});
	return (
		<mesh scale={2.75}>
			<sphereGeometry args={[1, 64, 64]} />
			<shaderMaterial
				ref={matRef}
				vertexShader={ATMOS_VERT}
				fragmentShader={ATMOS_FRAG}
				transparent
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
				depthWrite={false}
				uniforms={{
					uColor: { value: new THREE.Color("#4aa8ff") },
					uIntensity: { value: 0 },
					uPower: { value: 2.6 },
				}}
			/>
		</mesh>
	);
};

/* ------------------------------------------------------------------ */
/*  Earth                                                             */
/* ------------------------------------------------------------------ */

const EarthBody: React.FC = memo(() => {
	const ref = useRef<THREE.Mesh>(null!);
	const [color, normal, ao] = useLoader(TextureLoader, [
		"/assets/earth2/color.jpg",
		"/assets/earth2/normal.png",
		"/assets/earth2/occlusion.jpg",
	]) as THREE.Texture[];

	useFrame((_, dt) => {
		if (ref.current) ref.current.rotation.y += dt / 14;
	});

	return (
		<mesh ref={ref} scale={2.5} rotation={[0, 0.5, 23.5 * (Math.PI / 180)]}>
			<sphereGeometry args={[1, 96, 96]} />
			<meshStandardMaterial
				map={color}
				normalMap={normal}
				aoMap={ao}
				metalness={0.05}
				roughness={0.92}
			/>
		</mesh>
	);
});
EarthBody.displayName = "EarthBody";

/* ------------------------------------------------------------------ */
/*  Moon — orbital pivot driven entirely by GSAP                      */
/* ------------------------------------------------------------------ */

const MoonOrbit: React.FC<{
	angleRef: React.MutableRefObject<number>;
	scaleRef: React.MutableRefObject<number>;
}> = ({ angleRef, scaleRef }) => {
	useGLTF.preload("/assets/moon/moon.glb");
	const { nodes, materials }: any = useGLTF("/assets/moon/moon.glb");
	const pivot = useRef<THREE.Group>(null!);
	const inner = useRef<THREE.Group>(null!);
	const mesh = useRef<THREE.Mesh>(null!);

	useFrame((_, dt) => {
		if (pivot.current) pivot.current.rotation.y = angleRef.current;
		if (inner.current) {
			const s = scaleRef.current;
			inner.current.scale.setScalar(s);
		}
		if (mesh.current) mesh.current.rotation.y += dt / 8;
	});

	return (
		<group ref={pivot}>
			{/* push moon out along +X, then pivot rotates the whole group around Y */}
			<group position={[7.5, 0.4, 0]} ref={inner}>
				<mesh
					ref={mesh}
					geometry={nodes["Sphere001_Material_#39_0"].geometry}
					material={materials.Material_39}
					material-normalScale={1.5}
					scale={0.045}
				/>
			</group>
		</group>
	);
};

/* ------------------------------------------------------------------ */
/*  Starfield streaks (depth-z particles for travel feel)             */
/* ------------------------------------------------------------------ */

const StarStreaks: React.FC = () => {
	const points = useRef<THREE.Points>(null!);
	const geo = useMemo(() => {
		const g = new THREE.BufferGeometry();
		const N = 1500;
		const pos = new Float32Array(N * 3);
		for (let i = 0; i < N; i++) {
			pos[i * 3] = (Math.random() - 0.5) * 200;
			pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
			pos[i * 3 + 2] = -Math.random() * 220;
		}
		g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
		return g;
	}, []);

	useFrame((_, dt) => {
		if (!points.current) return;
		const arr = (points.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
		for (let i = 2; i < arr.length; i += 3) {
			arr[i] += dt * 30;
			if (arr[i] > 5) arr[i] = -220;
		}
		(points.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
	});

	return (
		<points ref={points} geometry={geo}>
			<pointsMaterial
				size={0.12}
				sizeAttenuation
				color="#cfe7ff"
				transparent
				opacity={0.85}
				blending={THREE.AdditiveBlending}
				depthWrite={false}
			/>
		</points>
	);
};

/* ------------------------------------------------------------------ */
/*  UFO orb — small additive sprite that flickers in/out              */
/* ------------------------------------------------------------------ */

const UFOOrb: React.FC<{
	position: [number, number, number];
	delay: number;
	color?: string;
}> = ({ position, delay, color = "#9ff7ff" }) => {
	const ref = useRef<THREE.Mesh>(null!);
	const matRef = useRef<THREE.MeshBasicMaterial>(null!);

	useGSAP(() => {
		if (!matRef.current || !ref.current) return;
		matRef.current.opacity = 0;
		ref.current.scale.setScalar(0.001);

		const tl = gsap.timeline({ delay, repeat: 2, repeatDelay: 1.6 + Math.random() * 1.2 });
		tl.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.18, ease: "power3.out" })
			.to(matRef.current, { opacity: 1, duration: 0.05 }, 0)
			.to(matRef.current, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.18)
			.to(ref.current.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.2 }, 0.2);
	}, []);

	return (
		<mesh ref={ref} position={position}>
			<sphereGeometry args={[0.12, 16, 16]} />
			<meshBasicMaterial
				ref={matRef}
				color={color}
				transparent
				toneMapped={false}
				blending={THREE.AdditiveBlending}
			/>
		</mesh>
	);
};

/* ------------------------------------------------------------------ */
/*  Flash light — short ambient burst                                  */
/* ------------------------------------------------------------------ */

const FlashLight: React.FC<{ delay: number }> = ({ delay }) => {
	const ref = useRef<THREE.PointLight>(null!);
	useGSAP(() => {
		if (!ref.current) return;
		ref.current.intensity = 0;
		gsap
			.timeline({ delay, repeat: 1, repeatDelay: 1.4 + Math.random() })
			.to(ref.current, { intensity: 6, duration: 0.06, ease: "power2.out" })
			.to(ref.current, { intensity: 0, duration: 0.35, ease: "power3.in" });
	}, []);
	return <pointLight ref={ref} position={[2, 1.5, 3]} color="#bfeaff" distance={20} />;
};

/* ------------------------------------------------------------------ */
/*  Camera rig — orbital state driven by GSAP, plus mouse parallax     */
/* ------------------------------------------------------------------ */

type CamState = {
	distance: number;
	angle: number;
	height: number;
	lookAtY: number;
};

const CameraRig: React.FC<{ state: React.MutableRefObject<CamState> }> = ({ state }) => {
	const { camera, size } = useThree();
	const px = useRef(0);
	const py = useRef(0);

	useGSAP(() => {
		const onMove = (e: MouseEvent) => {
			const nx = (e.clientX / size.width) * 2 - 1;
			const ny = -((e.clientY / size.height) * 2 - 1);
			px.current = nx * 0.35;
			py.current = ny * 0.25;
		};
		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, [size.width, size.height]);

	useFrame(() => {
		const s = state.current;
		const x = Math.sin(s.angle) * s.distance + px.current;
		const z = Math.cos(s.angle) * s.distance;
		const y = s.height + py.current;
		camera.position.set(x, y, z);
		camera.lookAt(0, s.lookAtY, 0);
	});

	return null;
};

/* ------------------------------------------------------------------ */
/*  Master timeline driver                                            */
/* ------------------------------------------------------------------ */

const TimelineDriver: React.FC<{
	camState: React.MutableRefObject<CamState>;
	atmos: React.MutableRefObject<number>;
	moonAngle: React.MutableRefObject<number>;
	moonScale: React.MutableRefObject<number>;
	fx: React.MutableRefObject<IntroFXHandle>;
}> = ({ camState, atmos, moonAngle, moonScale, fx }) => {
	useGSAP(() => {
		const tl = gsap.timeline();

		// Phase: approach
		tl.call(() => setIntroPhase("approach"), undefined, 0);
		tl.to(camState.current, { distance: 5.4, duration: 3.0, ease: "expo.out" }, 0);
		tl.to(atmos, { current: 1.2, duration: 2.4, ease: "power2.out" }, 1.0);

		// Phase: arrival
		tl.call(() => setIntroPhase("arrival"), undefined, 3.0);

		// Camera orbit pivot left around Earth
		tl.to(
			camState.current,
			{ angle: -Math.PI * 0.6, duration: 4.0, ease: "power2.inOut" },
			3.2,
		);
		tl.to(camState.current, { height: 0.4, duration: 4.0, ease: "sine.inOut" }, 3.2);

		// Phase: orbit + moon entry
		tl.call(() => setIntroPhase("orbit"), undefined, 3.4);
		tl.to(moonAngle, { current: Math.PI * 0.55, duration: 2.0, ease: "power2.out" }, 3.4);
		tl.to(moonScale, { current: 1, duration: 1.6, ease: "back.out(1.4)" }, 3.4);

		// Camera continues orbiting after moon visible
		tl.to(
			camState.current,
			{ angle: -Math.PI * 1.05, duration: 3.6, ease: "power1.inOut" },
			7.0,
		);
		// Moon arc continues
		tl.to(moonAngle, { current: -Math.PI * 0.15, duration: 3.6, ease: "power1.inOut" }, 7.0);

		// Flicker phase signal
		tl.call(() => setIntroPhase("flicker"), undefined, 4.0);

		// Glitch micro-pulses around 7.5 - 9.0
		const pulse = (t: number, amt = 0.35) => {
			tl.to(fx.current, { glitch: amt, duration: 0.08, ease: "power2.out" }, t);
			tl.to(fx.current, { glitch: 0, duration: 0.25, ease: "power3.in" }, t + 0.08);
		};
		pulse(6.4, 0.2);
		pulse(7.6, 0.35);
		pulse(8.4, 0.5);

		// Blackout
		tl.call(() => setIntroPhase("blackout"), undefined, 9.0);
		tl.to(fx.current, { blackout: 1, duration: 0.55, ease: "power4.in" }, 9.0);

		// Static + glitch sweep
		tl.call(() => setIntroPhase("static"), undefined, 9.6);
		tl.to(fx.current, { static: 0.85, duration: 0.4, ease: "power2.out" }, 9.6);
		tl.to(fx.current, { glitch: 1, duration: 0.4, ease: "power2.out" }, 9.6);

		// ASCII reveal & lift the blackout slightly so static is readable
		tl.to(fx.current, { ascii: 1, duration: 0.8, ease: "power2.out" }, 10.4);
		tl.to(fx.current, { blackout: 0.55, duration: 0.6, ease: "power2.out" }, 10.4);

		// Sustain end-state with gentle glitch jitter
		tl.to(
			fx.current,
			{ glitch: 0.6, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 },
			11.5,
		);
	}, []);

	return null;
};

/* ------------------------------------------------------------------ */
/*  Public scene                                                      */
/* ------------------------------------------------------------------ */

export const IntroScene: React.FC = () => {
	const camState = useRef<CamState>({
		distance: 80,
		angle: 0,
		height: 0,
		lookAtY: 0,
	});
	const atmos = useRef(0);
	const moonAngle = useRef(Math.PI * 1.05); // behind Earth, left
	const moonScale = useRef(0);
	const fx = useRef<IntroFXHandle>({
		glitch: 0,
		blackout: 0,
		ascii: 0,
		static: 0,
	});

	return (
		<div className="absolute inset-0 h-full w-full" id="intro-scene">
			<Canvas dpr={[1, 2]} camera={{ position: [0, 0, 80], fov: 45 }}>
				<color attach="background" args={["#02030a"]} />
				<fog attach="fog" args={["#02030a", 35, 140]} />

				<CameraRig state={camState} />
				<TimelineDriver
					camState={camState}
					atmos={atmos}
					moonAngle={moonAngle}
					moonScale={moonScale}
					fx={fx}
				/>

				<ambientLight intensity={0.12} />
				<directionalLight intensity={1.6} position={[1, 0.2, -0.25]} />

				<Suspense fallback={null}>
					<EarthBody />
					<Atmosphere intensity={atmos} />
					<MoonOrbit angleRef={moonAngle} scaleRef={moonScale} />
				</Suspense>

				<StarStreaks />

				{/* surreal flicker events */}
				<UFOOrb position={[2.6, 1.2, 1.4]} delay={4.2} />
				<UFOOrb position={[-3.1, -0.8, 0.6]} delay={5.4} color="#ffd1f5" />
				<UFOOrb position={[1.4, -1.6, 2.2]} delay={6.6} />
				<UFOOrb position={[-2.2, 1.8, -0.4]} delay={7.8} color="#fff3a8" />
				<FlashLight delay={4.6} />
				<FlashLight delay={7.2} />

				<EffectComposer enableNormalPass={false}>
					<Bloom mipmapBlur luminanceThreshold={0.55} intensity={0.9} />
					<Vignette eskil={false} offset={0.2} darkness={0.85} />
					<IntroFX state={fx} />
				</EffectComposer>
			</Canvas>
		</div>
	);
};
