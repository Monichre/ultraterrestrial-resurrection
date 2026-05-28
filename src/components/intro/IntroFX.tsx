"use client";

import { Effect } from "postprocessing";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Uniform } from "three";

/* ------------------------------------------------------------------ */
/*  Custom postprocessing Effect — glitch + ascii + static + blackout */
/* ------------------------------------------------------------------ */

const FRAG = /* glsl */ `
  uniform float uGlitch;
  uniform float uBlackout;
  uniform float uAscii;
  uniform float uStatic;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float luma(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  // Quantized 5-step ASCII-style luminance (no font lookup, just steps)
  float asciiStep(float l) {
    return floor(l * 5.0) / 5.0;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 p = uv;

    // ----- Glitch: horizontal slice displacement + chromatic aberration -----
    float gAmt = uGlitch;
    float band = step(0.985 - gAmt * 0.15, hash(vec2(floor(p.y * 80.0), floor(uTime * 12.0))));
    float shift = (hash(vec2(floor(p.y * 40.0), floor(uTime * 30.0))) - 0.5) * gAmt * 0.12;
    p.x += shift * band;

    float ca = gAmt * 0.008;
    vec4 col;
    col.r = texture2D(inputBuffer, vec2(p.x + ca, p.y)).r;
    col.g = texture2D(inputBuffer, p).g;
    col.b = texture2D(inputBuffer, vec2(p.x - ca, p.y)).b;
    col.a = 1.0;

    // ----- Static / film grain -----
    float n = hash(uv * vec2(1920.0, 1080.0) + uTime * 60.0);
    col.rgb = mix(col.rgb, vec3(n), uStatic * 0.85);

    // ----- ASCII dither (cell-quantized luma, tinted) -----
    if (uAscii > 0.001) {
      vec2 cell = vec2(120.0, 70.0);
      vec2 cuv = floor(uv * cell) / cell;
      vec3 cellCol = texture2D(inputBuffer, cuv).rgb;
      float l = asciiStep(luma(cellCol));
      // hash inside cell decides whether to print "ink" vs background
      float ink = step(1.0 - l, hash(floor(uv * cell)));
      vec3 asciiCol = mix(vec3(0.02, 0.05, 0.04), vec3(0.55, 0.95, 0.7), ink * l);
      col.rgb = mix(col.rgb, asciiCol, uAscii);
    }

    // ----- Scanlines tied to glitch + ascii -----
    float scan = 0.92 + 0.08 * sin(uv.y * 1400.0 + uTime * 6.0);
    col.rgb *= mix(1.0, scan, max(uGlitch, uAscii) * 0.6);

    // ----- Blackout (multiplicative) -----
    col.rgb *= (1.0 - clamp(uBlackout, 0.0, 1.0));

    outputColor = col;
  }
`;

class IntroFXEffect extends Effect {
	constructor() {
		super("IntroFXEffect", FRAG, {
			uniforms: new Map<string, Uniform>([
				["uGlitch", new Uniform(0)],
				["uBlackout", new Uniform(0)],
				["uAscii", new Uniform(0)],
				["uStatic", new Uniform(0)],
				["uTime", new Uniform(0)],
			]),
		});
	}

	update(_renderer: unknown, _input: unknown, deltaTime: number) {
		const u = this.uniforms.get("uTime");
		if (u) u.value += deltaTime ?? 0;
	}
}

export type IntroFXHandle = {
	glitch: number;
	blackout: number;
	ascii: number;
	static: number;
};

type IntroFXProps = {
	state: React.MutableRefObject<IntroFXHandle>;
};

export const IntroFX = forwardRef<IntroFXEffect, IntroFXProps>(
	({ state }, ref) => {
		const effect = useMemo(() => new IntroFXEffect(), []);
		const innerRef = useRef(effect);
		useImperativeHandle(ref, () => effect, [effect]);

		useFrame(() => {
			const e = innerRef.current;
			if (!e) return;
			(e.uniforms.get("uGlitch") as Uniform).value = state.current.glitch;
			(e.uniforms.get("uBlackout") as Uniform).value = state.current.blackout;
			(e.uniforms.get("uAscii") as Uniform).value = state.current.ascii;
			(e.uniforms.get("uStatic") as Uniform).value = state.current.static;
		});

		return <primitive object={effect} dispose={null} />;
	},
);
IntroFX.displayName = "IntroFX";
