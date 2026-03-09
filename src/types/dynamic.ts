// Runtime-only (never persisted). Produced by hooks in modules/dynamic/.

import type { HexColor } from "./color";
import type { ModeId } from "./light";

export type DayPart = "dawn" | "morning" | "afternoon" | "dusk" | "night";

export type WeatherCondition =
	| "clear"
	| "cloudy"
	| "rain"
	| "snow"
	| "storm"
	| "fog"
	| "wind";

export interface SpeedPayload {
	mph: number;
	color: HexColor;
}

export interface WeatherPayload {
	condition: WeatherCondition;
	tempF: number;
	color: HexColor;
}

export interface MusicPayload {
	bpm: number;
	/** Speed percent (1–100) mapped from BPM */
	speed: number;
}

export interface TimePayload {
	dayPart: DayPart;
	color: HexColor;
}

export interface GeoFenceZone {
	id: string;
	label: string;
	latitude: number;
	longitude: number;
	/** Radius in meters */
	radius: number;
	color: HexColor;
	mode: ModeId;
}

export interface GeoFencePayload {
	activeZone: GeoFenceZone | null;
}

export interface HardBrakePayload {
	/** Managed by the hook — true for the flash duration */
	braking: boolean;
}

export type DynamicPayload =
	| { rule: "speed"; data: SpeedPayload }
	| { rule: "weather"; data: WeatherPayload }
	| { rule: "music"; data: MusicPayload }
	| { rule: "time_of_day"; data: TimePayload }
	| { rule: "geo_fence"; data: GeoFencePayload }
	| { rule: "hard_brake"; data: HardBrakePayload };

export interface GeoFenceState {
	zones: GeoFenceZone[];
}
