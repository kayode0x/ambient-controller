import type { HexColor } from "./color";
import type { ModeId } from "./light";

export type DynamicRuleId =
	| "speed"
	| "weather"
	| "music"
	| "time_of_day"
	| "hard_brake"
	| "geo_fence";

export type PriorityLayerId = "dynamic" | "theme" | "manual";

export interface DynamicRule {
	id: DynamicRuleId;
	active: boolean;
	/**
	 * When true, this rule fires even if a theme is active.
	 * When false, an active theme blocks this rule from running.
	 */
	canOverrideTheme: boolean;
	/**
	 * When true, this rule overrides a manually set color/preset.
	 * Exposed for power users — should almost always be true.
	 */
	canOverrideManual: boolean;
}

/**
 * Layer-level override flags — coarser control than per-rule flags.
 * If a layer flag is false, ALL rules in that layer are blocked
 * from overriding the layer below, regardless of per-rule settings.
 */
export interface LayerOverrides {
	dynamicOverTheme: boolean;
	dynamicOverManual: boolean;
	themeOverManual: boolean;
}

export interface RulesState {
	rules: Record<DynamicRuleId, DynamicRule>;
	layerOverrides: LayerOverrides;
}

/**
 * What the device should show right now.
 * Produced by rules-engine.ts after walking the full priority stack.
 */
export interface ResolvedLightCommand {
	source: PriorityLayerId;
	/** Populated when source === "dynamic" */
	rule: DynamicRuleId | null;
	/** Null when the active mode is isAutoColor */
	color: HexColor | null;
	mode: ModeId;
	brightness: number;
	speed: number;
}
