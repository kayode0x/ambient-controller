/**
 * Protocol Format:
 * Color:      7e ff 05 03 [RR] [GG] [BB] ff ef
 * Mode:       7e ff 03 [MODE] 03 ff ff ff ef
 * Brightness: 7e ff 01 [VAL] 00 ff ff ff ef   (VAL: 0x01-0x64)
 * Speed:      7e ff 02 [VAL] 00 ff ff ff ef   (VAL: 0x03-0x64)
 */

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

export type ModeCategory = "jump" | "gradient" | "flash" | "breathe";

export interface ModeDefinition {
	id: ModeId;
	label: string;
	byte: number;
	category: ModeCategory;

	/** True if this mode cycles through colors automatically (no custom color needed) */
	isAutoColor: boolean;
}

/**
 * Mode Registry: maps mode IDs to their definitions,
 * including the byte value needed for commands and metadata for UI rendering.
 * The byte values are based on reverse engineering the official app's commands.
 */
export const MODES: Record<ModeId, ModeDefinition> = {
	// Jump
	"3color_jump": {
		id: "3color_jump",
		label: "3 Color Jump",
		byte: 0x87,
		category: "jump",
		isAutoColor: true,
	},
	"7color_jump": {
		id: "7color_jump",
		label: "7 Color Jump",
		byte: 0x88,
		category: "jump",
		isAutoColor: true,
	},

	// Gradient
	"3color_gradient": {
		id: "3color_gradient",
		label: "3 Color Gradient",
		byte: 0x89,
		category: "gradient",
		isAutoColor: true,
	},
	"7color_gradient": {
		id: "7color_gradient",
		label: "7 Color Gradient",
		byte: 0x8a,
		category: "gradient",
		isAutoColor: true,
	},
	red_gradient: {
		id: "red_gradient",
		label: "Red Gradient",
		byte: 0x8b,
		category: "gradient",
		isAutoColor: false,
	},
	green_gradient: {
		id: "green_gradient",
		label: "Green Gradient",
		byte: 0x8c,
		category: "gradient",
		isAutoColor: false,
	},
	blue_gradient: {
		id: "blue_gradient",
		label: "Blue Gradient",
		byte: 0x8d,
		category: "gradient",
		isAutoColor: false,
	},
	yellow_gradient: {
		id: "yellow_gradient",
		label: "Yellow Gradient",
		byte: 0x8e,
		category: "gradient",
		isAutoColor: false,
	},
	cyan_gradient: {
		id: "cyan_gradient",
		label: "Cyan Gradient",
		byte: 0x8f,
		category: "gradient",
		isAutoColor: false,
	},
	purple_gradient: {
		id: "purple_gradient",
		label: "Purple Gradient",
		byte: 0x90,
		category: "gradient",
		isAutoColor: false,
	},
	white_gradient: {
		id: "white_gradient",
		label: "White Gradient",
		byte: 0x91,
		category: "gradient",
		isAutoColor: false,
	},
	red_green_gradient: {
		id: "red_green_gradient",
		label: "Red-Green Gradient",
		byte: 0x92,
		category: "gradient",
		isAutoColor: true,
	},
	red_blue_gradient: {
		id: "red_blue_gradient",
		label: "Red-Blue Gradient",
		byte: 0x93,
		category: "gradient",
		isAutoColor: true,
	},
	green_blue_gradient: {
		id: "green_blue_gradient",
		label: "Green-Blue Gradient",
		byte: 0x94,
		category: "gradient",
		isAutoColor: true,
	},

	// Flash
	"7color_flash": {
		id: "7color_flash",
		label: "7 Color Flash",
		byte: 0x95,
		category: "flash",
		isAutoColor: true,
	},
	red_flash: {
		id: "red_flash",
		label: "Red Flash",
		byte: 0x96,
		category: "flash",
		isAutoColor: false,
	},
	green_flash: {
		id: "green_flash",
		label: "Green Flash",
		byte: 0x97,
		category: "flash",
		isAutoColor: false,
	},
	blue_flash: {
		id: "blue_flash",
		label: "Blue Flash",
		byte: 0x98,
		category: "flash",
		isAutoColor: false,
	},
	yellow_flash: {
		id: "yellow_flash",
		label: "Yellow Flash",
		byte: 0x99,
		category: "flash",
		isAutoColor: false,
	},
	cyan_flash: {
		id: "cyan_flash",
		label: "Cyan Flash",
		byte: 0x9a,
		category: "flash",
		isAutoColor: false,
	},
	purple_flash: {
		id: "purple_flash",
		label: "Purple Flash",
		byte: 0x9b,
		category: "flash",
		isAutoColor: false,
	},
	white_flash: {
		id: "white_flash",
		label: "White Flash",
		byte: 0x9c,
		category: "flash",
		isAutoColor: false,
	},

	// Breathe
	"7color_breathe": {
		id: "7color_breathe",
		label: "7 Color Breathe",
		byte: 0x9d,
		category: "breathe",
		isAutoColor: true,
	},
};

/**
 * All modes grouped by category — useful for rendering sectioned lists in the UI
 */
export const MODES_BY_CATEGORY: Record<ModeCategory, ModeDefinition[]> = {
	jump: Object.values(MODES).filter((m) => m.category === "jump"),
	gradient: Object.values(MODES).filter((m) => m.category === "gradient"),
	flash: Object.values(MODES).filter((m) => m.category === "flash"),
	breathe: Object.values(MODES).filter((m) => m.category === "breathe"),
};
