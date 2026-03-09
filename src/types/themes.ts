import type { HexColor } from "./color";
import type { ModeId } from "./light";

export interface Theme {
	id: string;
	label: string;
	icon: string;
	/** 1-7 colors in sequence order */
	colors: HexColor[];
	mode: ModeId;
	builtIn: boolean;
}

export interface ThemesState {
	allThemes: Theme[];
	activeThemeId: string | null;
}
