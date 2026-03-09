import type { HexColor } from "./color";

export interface ColorPreset {
	id: string;
	label: string;
	color: HexColor;
	/** ISO timestamp — used for ordering */
	createdAt: string;
}

export interface PresetsState {
	/** User-created, persisted. Max 5. */
	userPresets: ColorPreset[];
}
