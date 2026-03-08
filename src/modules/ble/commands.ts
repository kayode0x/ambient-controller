import { type RGB, hexToRgb } from "@/utils/colors";
import { byteToHex, clamp, percentToHex } from "@/utils/encoding";
import { MODES, type ModeId } from "../modes";

const CMD_PREFIX = "7eff";
const CMD_PREFIXES = {
	brightness: `${CMD_PREFIX}01`,
	speed: `${CMD_PREFIX}02`,
	mode: `${CMD_PREFIX}03`,
	color: `${CMD_PREFIX}0503`,
} as const;

const CMD_SUFFIX = "ffef";
const CMD_POSTFIX = `ffff${CMD_SUFFIX}`;

/**
 * Build a hex command string to set brightness.
 *
 * @param percent  1-100
 * @example
 * buildBrightnessCommand(50) → "7eff013200ffffffef"
 */
export function buildBrightnessCommand(percent: number): string {
	const val = percentToHex(percent, 1, 100);
	return `${CMD_PREFIXES.brightness}${val}00${CMD_POSTFIX}`;
}

/**
 * Build a hex command string to set effect speed.
 *
 * The device treats 0x03 as minimum (slowest) and 0x64 as maximum (fastest).
 *
 * @param percent  1-100
 * @example
 * buildSpeedCommand(50) → "7eff023200ffffffef"
 */
export function buildSpeedCommand(percent: number): string {
	const raw = Math.round(3 + (clamp(percent, 1, 100) / 100) * (100 - 3));
	return `${CMD_PREFIXES.speed}${byteToHex(raw)}00${CMD_POSTFIX}`;
}

/**
 * Build a hex command string to activate a mode.
 *
 * @example
 * buildModeCommand("red_gradient") → "7eff038b03ffffffef"
 */
export function buildModeCommand(modeId: ModeId): string {
	const mode = MODES[modeId];
	if (!mode) throw new Error(`Unknown mode: ${modeId}`);
	return `${CMD_PREFIXES.mode}${byteToHex(mode.byte)}03${CMD_POSTFIX}`;
}

/**
 * Build a hex command string to set a static color.
 *
 * @example
 * buildColorCommand({ r: 255, g: 0, b: 128 }) → "7eff050300ff80ffef"
 */
export function buildColorCommand(rgb: RGB): string {
	const rr = byteToHex(clamp(rgb.r, 0, 255));
	const gg = byteToHex(clamp(rgb.g, 0, 255));
	const bb = byteToHex(clamp(rgb.b, 0, 255));
	return `${CMD_PREFIXES.color}${rr}${gg}${bb}${CMD_SUFFIX}`;
}

/**
 * Build a color command directly from a hex color string.
 *
 * @example
 * buildColorCommandFromHex("#ff0080") → "7eff050300ff80ffef"
 */
export function buildColorCommandFromHex(hex: string): string {
	return buildColorCommand(hexToRgb(hex));
}
