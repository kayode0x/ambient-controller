import type { HexColor } from "./color";

export type ModeCategoryId = "jump" | "gradient" | "flash" | "breathe";

export type ModeId =
	| "3color_jump"
	| "7color_jump"
	| "3color_gradient"
	| "7color_gradient"
	| "red_gradient"
	| "green_gradient"
	| "blue_gradient"
	| "yellow_gradient"
	| "cyan_gradient"
	| "purple_gradient"
	| "white_gradient"
	| "red_green_gradient"
	| "red_blue_gradient"
	| "green_blue_gradient"
	| "7color_flash"
	| "red_flash"
	| "green_flash"
	| "blue_flash"
	| "yellow_flash"
	| "cyan_flash"
	| "purple_flash"
	| "white_flash"
	| "7color_breathe";

export interface ModeDefinition {
	id: ModeId;
	label: string;
	/** Protocol byte value sent to device */
	byte: number;
	category: ModeCategoryId;
	/**
	 * When true, the device ignores the color command — it cycles through
	 * its own palette. The color wheel should be disabled in this state.
	 */
	isAutoColor: boolean;
	/**
	 * For single-color modes (e.g. red_gradient), the fixed accent color
	 * to display in the UI. Null for multi-color/auto modes.
	 */
	accent: HexColor | null;
}

export interface LightState {
	power: boolean;
	color: HexColor;
	brightness: number; // 1–100
	speed: number; // 1–100
	activeMode: ModeId;
}
