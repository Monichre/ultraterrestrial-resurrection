"use client";
import * as THREE from "three";

export const nextTick = async (frames = 1) => {
	const _nextTick = async (idx: number) => {
		return new Promise((resolve) => {
			requestAnimationFrame(() => resolve(idx));
		});
	};
	for (let i = 0; i < frames; i++) {
		await _nextTick(i);
	}
};

// utils/wait.js
export const wait = async (seconds: number) => {
	return new Promise((resolve: any) => {
		setTimeout(() => {
			resolve();
		}, seconds * 1000); // Convert seconds to milliseconds
	});
};

export const firstOf = <T = any>(datas?: T[]) =>
	datas ? (datas.length < 1 ? undefined : datas[0]) : undefined;

export const lastOf = <T = any>(datas?: T[]) =>
	datas ? (datas.length < 1 ? undefined : datas[datas.length - 1]) : undefined;

export const randomInt = (min: number, max?: number) => {
	if (!max) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const pickOne = <T = any>(datas: T[]) =>
	datas.length < 1 ? undefined : datas[randomInt(datas.length - 1)];

export const range = (start: number, end?: number) => {
	if (!end) {
		end = start;
		start = 0;
	}
	return Array.from({ length: end - start }, (_, index) => start + index);
};

/**
 * clamp(-1,0,1)=0
 */
export function clamp(num: number, min: number, max: number): number {
	return num < max ? (num > min ? num : min) : max;
}

export const toSet = <T = any>(datas: T[], byKey?: (e: T) => any) => {
	if (byKey) {
		const keys: Record<string, boolean> = {};
		const newDatas: T[] = [];
		datas.forEach((e) => {
			const key = jsonEncode({ key: byKey(e) }) as any;
			if (!keys[key]) {
				newDatas.push(e);
				keys[key] = true;
			}
		});
		return newDatas;
	}
	return Array.from(new Set(datas));
};

export function jsonEncode(obj: any, prettier = false) {
	try {
		return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj);
	} catch (error) {
		return undefined;
	}
}

export function jsonDecode(json: string | undefined) {
	if (json == undefined) return undefined;
	try {
		return JSON.parse(json!);
	} catch (error) {
		return undefined;
	}
}

export function removeEmpty<T = any>(data: T): T {
	if (Array.isArray(data)) {
		return data.filter((e) => e != undefined) as any;
	}
	const res = {} as any;
	for (const key in data) {
		if (data[key] != undefined) {
			res[key] = data[key];
		}
	}
	return res;
}

export const deepClone = <T>(obj: T): T => {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}

	if (Array.isArray(obj)) {
		const copy: any[] = [];
		obj.forEach((item, index) => {
			copy[index] = deepClone(item);
		});

		return copy as unknown as T;
	}

	const copy = {} as T;

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			(copy as any)[key] = deepClone((obj as any)[key]);
		}
	}

	return copy;
};

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function flattenArray(arr: any[]): any[] {
	return arr.reduce((acc, val) => {
		return Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val);
	}, []);
}

export function truncate(str: string | null, length: number) {
	if (!str || str.length <= length) return str;
	return `${str.slice(0, length - 3)}...`;
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
