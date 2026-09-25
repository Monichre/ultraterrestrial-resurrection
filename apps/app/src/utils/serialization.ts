/**
 * Utilities for safely serializing Xata records to pass from
 * Server Components to Client Components in Next.js
 */

/**
 * Validates if coordinates are valid geographic coordinates
 *
 * @param lat - Latitude value
 * @param lng - Longitude value
 * @returns Boolean indicating if coordinates are valid
 */
function isValidGeoCoordinates(lat: any, lng: any): boolean {
	return (
		typeof lat === "number" &&
		typeof lng === "number" &&
		!isNaN(lat) &&
		!isNaN(lng) &&
		lat >= -90 &&
		lat <= 90 &&
		lng >= -180 &&
		lng <= 180
	);
}

/**
 * Checks if an object is a valid coordinates object
 *
 * @param obj - Object to check
 * @returns Boolean indicating if the object is a valid coordinates object
 */
function isCoordinatesObject(obj: any): boolean {
	// Common coordinate object formats we want to detect:
	// 1. { lat: number, lng: number }
	// 2. { latitude: number, longitude: number }
	// 3. { lat: number, lon: number }

	if (!obj || typeof obj !== "object") return false;

	// Format 1: { lat, lng }
	if ("lat" in obj && "lng" in obj) {
		return isValidGeoCoordinates(obj.lat, obj.lng);
	}

	// Format 2: { latitude, longitude }
	if ("latitude" in obj && "longitude" in obj) {
		return isValidGeoCoordinates(obj.latitude, obj.longitude);
	}

	// Format 3: { lat, lon }
	if ("lat" in obj && "lon" in obj) {
		return isValidGeoCoordinates(obj.lat, obj.lon);
	}

	return false;
}

/**
 * Normalizes coordinates to a standard format
 *
 * @param coordsObj - Coordinates object in any supported format
 * @returns Normalized coordinates in { lat, lng } format or null if invalid
 */
function normalizeCoordinates(
	coordsObj: any,
): { lat: number; lng: number } | null {
	if (!coordsObj || typeof coordsObj !== "object") return null;

	// Format 1: { lat, lng }
	if (
		"lat" in coordsObj &&
		"lng" in coordsObj &&
		isValidGeoCoordinates(coordsObj.lat, coordsObj.lng)
	) {
		return { lat: coordsObj.lat, lng: coordsObj.lng };
	}

	// Format 2: { latitude, longitude }
	if (
		"latitude" in coordsObj &&
		"longitude" in coordsObj &&
		isValidGeoCoordinates(coordsObj.latitude, coordsObj.longitude)
	) {
		return { lat: coordsObj.latitude, lng: coordsObj.longitude };
	}

	// Format 3: { lat, lon }
	if (
		"lat" in coordsObj &&
		"lon" in coordsObj &&
		isValidGeoCoordinates(coordsObj.lat, coordsObj.lon)
	) {
		return { lat: coordsObj.lat, lng: coordsObj.lon };
	}

	return null;
}

/**
 * Safely serializes Xata records by removing non-serializable properties
 * and converting to plain JavaScript objects.
 *
 * @param records - A single Xata record or array of records
 * @returns Plain JavaScript object(s) safe for client components
 */
export function serializeXataRecords<T extends Record<string, any>>(
	records: T | T[] | null | undefined,
): Partial<T> | Partial<T>[] | null {
	if (!records) return null;

	const serializeRecord = (record: T): Partial<T> => {
		// Use toSerializable if available
		if (typeof record.toSerializable === "function") {
			const serialized = record.toSerializable();
			// Remove xata object which we never need
			if (serialized.xata) {
				delete serialized.xata;
			}

			// Process location and coordinates in serialized data
			if (serialized.location && typeof serialized.location === "object") {
				// Handle location object with coordinates
				if (serialized.location.coordinates) {
					const normalized = normalizeCoordinates(
						serialized.location.coordinates,
					);
					if (normalized) {
						serialized.location.coordinates = normalized;
					}
				}

				// Direct lat/lng on location
				if (isCoordinatesObject(serialized.location)) {
					const normalized = normalizeCoordinates(serialized.location);
					if (normalized) {
						serialized.location.coordinates =
							serialized.location.coordinates || normalized;
					}
				}
			}

			// Handle direct lat/lng on record
			if ("latitude" in serialized && "longitude" in serialized) {
				const lat = serialized.latitude;
				const lng = serialized.longitude;

				if (isValidGeoCoordinates(lat, lng)) {
					// Ensure location object exists
					serialized.location = serialized.location || {};
					// Add coordinates object if missing
					serialized.location.coordinates = serialized.location.coordinates || {
						lat,
						lng,
					};
				}
			}

			return serialized;
		}

		// Otherwise manually create a safe object
		const safeObject: Partial<T> = {};

		for (const [key, value] of Object.entries(record)) {
			// Skip the xata object completely
			if (key === "xata") continue;

			// Skip functions and symbols
			if (typeof value === "function" || typeof value === "symbol") continue;

			// Special handling for location field
			if (key === "location" && value && typeof value === "object") {
				const locationObj: any = {};

				// Copy basic location properties
				if ("city" in value) locationObj.city = value.city;
				if ("state" in value) locationObj.state = value.state;
				if ("country" in value) locationObj.country = value.country;

				// Process coordinates if present
				if ("coordinates" in value && value.coordinates) {
					const normalized = normalizeCoordinates(value.coordinates);
					if (normalized) {
						locationObj.coordinates = normalized;
					}
				}

				// Check if value itself has coordinate properties
				const directCoords = normalizeCoordinates(value);
				if (directCoords && !locationObj.coordinates) {
					locationObj.coordinates = directCoords;
				}

				safeObject[key as keyof T] = locationObj as any;
				continue;
			}

			// Handle direct latitude/longitude fields
			if (
				(key === "latitude" || key === "longitude") &&
				typeof value === "number" &&
				!isNaN(value)
			) {
				safeObject[key as keyof T] = value as any;

				// If we have both lat and lng, ensure location.coordinates exists
				const isLat = key === "latitude";
				const otherKey = isLat ? "longitude" : "latitude";

				if (otherKey in record && typeof record[otherKey] === "number") {
					// We found both lat and lng, make sure they're in location.coordinates
					const lat = isLat ? value : record[otherKey];
					const lng = isLat ? record[otherKey] : value;

					if (isValidGeoCoordinates(lat, lng)) {
						// Ensure location object exists
						safeObject.location = safeObject.location || ({} as any);
						// Add coordinates
						(safeObject.location as any).coordinates = { lat, lng };
					}
				}
				continue;
			}

    // Handle arrays (including file arrays) with deep serialization of items
    if (Array.isArray(value)) {
        safeObject[key as keyof T] = value.map((item) => {
            if (item == null) return item as any

            // For file objects, only keep safe properties
            if (
                typeof item === "object" &&
                ("mediaType" in item || "name" in item || "url" in item)
            ) {
                return {
                    name: (item as any).name,
                    mediaType: (item as any).mediaType,
                    url: (item as any).url,
                    size: (item as any).size,
                }
            }

            // Xata records or other objects: use toSerializable if available, otherwise recurse
            if (typeof item === "object") {
                if (typeof (item as any).toSerializable === "function") {
                    const serialized = (item as any).toSerializable()
                    // Reuse the same logic for nested objects
                    return serializeRecord(serialized as any)
                }
                return serializeRecord(item as any)
            }

            // Primitive
            return item as any
        }) as any
        continue
    }

			// Handle file objects
			if (
				value &&
				typeof value === "object" &&
				("mediaType" in value || "signedUrl" in value || "uploadUrl" in value)
			) {
				safeObject[key as keyof T] = {
					name: value.name,
					mediaType: value.mediaType,
					url: value.url,
					size: value.size,
					// Exclude problematic fields
				} as any;
				continue;
			}

			// Special handling for coordinates objects
			if (
				key === "coordinates" ||
				(value && typeof value === "object" && isCoordinatesObject(value))
			) {
				const normalized = normalizeCoordinates(value);
				safeObject[key as keyof T] = normalized as any;
				continue;
			}

			// Handle nested objects (recursive serialization)
			if (value && typeof value === "object" && !Array.isArray(value)) {
				safeObject[key as keyof T] = serializeRecord(value as any) as any;
				continue;
			}

			// Otherwise include the value directly
			safeObject[key as keyof T] = value as any;
		}

		// Post-processing to ensure location.coordinates exists if we have lat/lng
		if (
			("latitude" in safeObject || "lat" in safeObject) &&
			("longitude" in safeObject || "lng" in safeObject || "lon" in safeObject)
		) {
			const lat = (safeObject as any).latitude || (safeObject as any).lat;
			const lng =
				(safeObject as any).longitude ||
				(safeObject as any).lng ||
				(safeObject as any).lon;

			if (isValidGeoCoordinates(lat, lng)) {
				// Ensure location object exists
				safeObject.location = safeObject.location || ({} as any);
				// Add coordinates if they don't already exist
				const locationObj = safeObject.location as any;
				if (!locationObj.coordinates) {
					locationObj.coordinates = { lat, lng };
				}
			}
		}

		return safeObject;
	};

	// Handle array of records
	if (Array.isArray(records)) {
		return records.map(serializeRecord);
	}

	// Handle single record
	return serializeRecord(records);
}

/**
 * Simple function to safely stringify data for passing to client components
 *
 * @param data - Any data to be stringified
 * @returns JSON string representation of the data
 */
export function safeStringify(data: any): string {
	return JSON.stringify(serializeXataRecords(data));
}

/**
 * Utility function to check if coordinates are valid
 * Can be used directly in components
 *
 * @param coordinates - Coordinates object to validate
 * @returns Boolean indicating if coordinates are valid
 */
export function hasValidCoordinates(coordinates: any): boolean {
	if (!coordinates || typeof coordinates !== "object") return false;

	if ("lat" in coordinates && "lng" in coordinates) {
		return isValidGeoCoordinates(coordinates.lat, coordinates.lng);
	}

	if ("latitude" in coordinates && "longitude" in coordinates) {
		return isValidGeoCoordinates(coordinates.latitude, coordinates.longitude);
	}

	if ("lat" in coordinates && "lon" in coordinates) {
		return isValidGeoCoordinates(coordinates.lat, coordinates.lon);
	}

	return false;
}
