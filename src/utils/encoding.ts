/**
 * Convert a byte value (0-255) to a 2-digit hexadecimal string.
 * E.g. 0 → "00", 255 → "ff", 128 → "80"
 */
export function byteToHex(n: number): string {
	return n.toString(16).padStart(2, "0");
}

/**
 * Convert a percentage (e.g. from a slider) to a hex byte string for commands.
 * The percent value is clamped to the provided min and max range before conversion.
 */
export function percentToHex(
	percent: number,
	min: number,
	max: number,
): string {
	const val = Math.round(clamp(percent, min, max));
	return byteToHex(val);
}

/**
 * Clamp a number between a minimum and maximum value.
 * E.g. clamp(150, 0, 100) → 100, clamp(-5, 0, 100) → 0, clamp(50, 0, 100) → 50
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}
