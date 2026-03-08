import { byteToHex } from "./encoding";

export interface RGB {
	r: number; // 0-255
	g: number; // 0-255
	b: number; // 0-255
}

/**
 * Convert a hex color string to an RGB object.
 *
 * @example
 * "#ff0080" → { r: 255, g: 0, b: 128 }
 */
export function hexToRgb(hex: string): RGB {
	const clean = hex.replace("#", "");
	return {
		r: Number.parseInt(clean.slice(0, 2), 16),
		g: Number.parseInt(clean.slice(2, 4), 16),
		b: Number.parseInt(clean.slice(4, 6), 16),
	};
}

/**
 * Convert an RGB object to a CSS hex color string.
 * @example
 * { r: 255, g: 0, b: 128 } → "#ff0080"
 */
export function rgbToHex({ r, g, b }: RGB): string {
	return `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}`;
}
