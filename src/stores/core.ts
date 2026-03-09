import { ALL_MODES } from "@/modules/modes";
import { BUILT_IN_THEMES } from "@/modules/themes";
import type {
	AppState,
	BleState,
	ColorPreset,
	DynamicPayload,
	DynamicRuleId,
	GeoFenceState,
	GeoFenceZone,
	HexColor,
	LightState,
	ModeId,
	PresetsState,
	ResolvedLightCommand,
	RulesState,
	Theme,
	ThemesState,
} from "@/types";
import { observable } from "@legendapp/state";

// =============================================================================
// GlowKit — Legend State Store
//
// Split into two observables:
//   store$   — persisted to MMKV (survives app restarts)
//   session$ — in-memory only (resets on every launch)
//
// Usage:
//   import { store$, session$ } from "@/store"
//   import { useLight, useBle, ... } from "@/store"  ← typed slice hooks
// =============================================================================

import { computed } from "@legendapp/state";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { syncObservable } from "@legendapp/state/sync";

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTED STORE
// Everything here survives app restarts via MMKV.
// ─────────────────────────────────────────────────────────────────────────────

export const store$ = observable({
	// ── App ────────────────────────────────────────────────────────────────────
	app: {
		hasOnboarded: false as boolean,
		lastDeviceId: null as string | null,
	} satisfies AppState,

	// ── Light ──────────────────────────────────────────────────────────────────
	// power is intentionally NOT persisted here — it always resets to false
	// on launch. It lives in session$ below.
	light: {
		speed: 60,
		brightness: 75,
		color: "#00e5ff" as HexColor,
		activeMode: "7color_gradient" as ModeId,
	},

	// ── Presets ────────────────────────────────────────────────────────────────
	presets: {
		userPresets: [] as ColorPreset[],
	} satisfies PresetsState,

	// ── Themes ─────────────────────────────────────────────────────────────────
	themes: {
		allThemes: BUILT_IN_THEMES as Theme[],
		activeThemeId: null as string | null,
	} satisfies ThemesState,

	// ── Rules ──────────────────────────────────────────────────────────────────
	rules: {
		rules: {
			speed: {
				id: "speed",
				active: false as boolean,
				canOverrideTheme: true as boolean,
				canOverrideManual: true as boolean,
			},
			weather: {
				id: "weather",
				active: false as boolean,
				canOverrideTheme: false as boolean,
				canOverrideManual: true as boolean,
			},
			music: {
				id: "music",
				active: false as boolean,
				canOverrideTheme: false as boolean,
				canOverrideManual: true as boolean,
			},
			time_of_day: {
				id: "time_of_day",
				active: false as boolean,
				canOverrideTheme: false as boolean,
				canOverrideManual: true as boolean,
			},
			hard_brake: {
				id: "hard_brake",
				active: false as boolean,
				canOverrideTheme: true as boolean,
				canOverrideManual: true as boolean,
			},
			geo_fence: {
				id: "geo_fence",
				active: false as boolean,
				canOverrideTheme: false as boolean,
				canOverrideManual: true as boolean,
			},
		},
		layerOverrides: {
			dynamicOverTheme: true as boolean,
			dynamicOverManual: true as boolean,
			themeOverManual: true as boolean,
		},
	} satisfies RulesState,

	// ── Geo Fence Zones ────────────────────────────────────────────────────────
	geoFence: {
		zones: [] as GeoFenceZone[],
	} satisfies GeoFenceState,
});

// Wire MMKV persistence
syncObservable(store$, {
	persist: {
		retrySync: true,
		name: "glowkit-store",
		plugin: ObservablePersistMMKV,
	},
	debounceSet: 500,
	retry: {
		maxDelay: 30,
		infinite: true,
		backoff: "exponential",
	},
});

// ─────────────────────────────────────────────────────────────────────────────
// SESSION STORE  (in-memory, never persisted)
// ─────────────────────────────────────────────────────────────────────────────

export const session$ = observable({
	// ── BLE ────────────────────────────────────────────────────────────────────
	ble: {
		status: "disconnected" as BleState["status"],
		device: null as BleState["device"],
		error: null as string | null,
		/** Raw scan results before the user picks one */
		scanResults: [] as Array<{ id: string; name: string; rssi: number }>,
	},

	// ── Power (resets to off on every launch) ──────────────────────────────────
	light: {
		power: false as boolean,
	},

	// ── Dynamic rule payloads (set by hooks in modules/dynamic/) ───────────────
	// The rules engine reads from here to resolve what to send.
	dynamic: {
		speed: null as DynamicPayload | null,
		weather: null as DynamicPayload | null,
		music: null as DynamicPayload | null,
		time_of_day: null as DynamicPayload | null,
		hard_brake: null as DynamicPayload | null,
		geo_fence: null as DynamicPayload | null,
	},
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTED VALUES
// ─────────────────────────────────────────────────────────────────────────────

/** Full light state merging persisted + session power */
export const lightState$ = computed<LightState>(() => ({
	power: session$.light.power.get(),
	color: store$.light.color.get(),
	brightness: store$.light.brightness.get(),
	speed: store$.light.speed.get(),
	activeMode: store$.light.activeMode.get(),
}));

/** The ModeDefinition object for the currently active mode */
export const activeModeDef$ = computed(() => {
	const id = store$.light.activeMode.get();
	return ALL_MODES.find((m) => m.id === id) ?? null;
});

/**
 * Whether the color wheel should be disabled.
 * True when the active mode drives its own color palette.
 */
export const isAutoColor$ = computed(
	() => activeModeDef$.get()?.isAutoColor ?? false,
);

/** The Theme object for the active theme, or null */
export const activeTheme$ = computed(() => {
	const id = store$.themes.activeThemeId.get();
	const all = store$.themes.allThemes.get();
	return id ? (all.find((t) => t.id === id) ?? null) : null;
});

/** Rules that are currently toggled on */
export const activeRules$ = computed(() =>
	Object.values(store$.rules.rules.get()).filter((r) => r.active),
);

/**
 * Resolved light command — what the device should actually show right now.
 *
 * Priority stack (highest → lowest):
 *   1. Dynamic rule (if active + layer/rule override flags permit)
 *   2. Active theme (if set + themeOverManual flag permits)
 *   3. Manual (current color + mode from store)
 *
 * The rules engine (modules/rules/rules-engine.ts) consumes this to emit
 * BLE commands. It's defined here as a computed so components can also
 * read the winning source for display purposes.
 */
export const resolvedCommand$ = computed<ResolvedLightCommand>(() => {
	const layerOverrides = store$.rules.layerOverrides.get();
	const rules = store$.rules.rules.get();
	const dynamic = session$.dynamic.get();
	const theme = activeTheme$.get();
	const light = lightState$.get();
	const modeDef = activeModeDef$.get();

	// ── Layer 1: Dynamic rules ─────────────────────────────────────────────────
	if (layerOverrides.dynamicOverManual) {
		const RULE_PRIORITY: DynamicRuleId[] = [
			"hard_brake", // always highest urgency
			"speed",
			"music",
			"geo_fence",
			"weather",
			"time_of_day",
		];

		for (const ruleId of RULE_PRIORITY) {
			const rule = rules[ruleId];
			const payload = dynamic[ruleId];

			if (!rule?.active || !payload) continue;

			// Check theme lock
			if (theme && !layerOverrides.dynamicOverTheme) continue;
			if (theme && !rule.canOverrideTheme) continue;

			// Check manual lock
			if (!rule.canOverrideManual) continue;

			const data = (payload as DynamicPayload).data;

			// hard_brake just pulses red — always overrides color + mode
			if (ruleId === "hard_brake") {
				return {
					source: "dynamic",
					rule: ruleId,
					color: "#ff0000",
					mode: "red_flash",
					brightness: light.brightness,
					speed: 100,
				};
			}

			// music only affects speed, not color or mode
			if (ruleId === "music") {
				const musicData = data as import("@/types").MusicPayload;
				return {
					source: "dynamic",
					rule: ruleId,
					color: modeDef?.isAutoColor ? null : light.color,
					mode: light.activeMode,
					brightness: light.brightness,
					speed: musicData.speed,
				};
			}

			// speed / weather / time_of_day / geo_fence resolve a color
			const resolvedColor = (data as { color?: HexColor }).color ?? light.color;
			const resolvedMode =
				ruleId === "geo_fence"
					? ((data as import("@/types").GeoFencePayload).activeZone?.mode ??
						light.activeMode)
					: light.activeMode;

			return {
				source: "dynamic",
				rule: ruleId,
				color: modeDef?.isAutoColor ? null : resolvedColor,
				mode: resolvedMode,
				brightness: light.brightness,
				speed: light.speed,
			};
		}
	}

	// ── Layer 2: Active theme ──────────────────────────────────────────────────
	if (theme && layerOverrides.themeOverManual) {
		const themeModeId = theme.mode as ModeId;
		const themeModeDef = ALL_MODES.find((m) => m.id === themeModeId);
		return {
			source: "theme",
			rule: null,
			color: themeModeDef?.isAutoColor
				? null
				: (theme.colors[0] ?? light.color),
			mode: themeModeId,
			brightness: light.brightness,
			speed: light.speed,
		};
	}

	// ── Layer 3: Manual ────────────────────────────────────────────────────────
	return {
		source: "manual",
		rule: null,
		color: modeDef?.isAutoColor ? null : light.color,
		mode: light.activeMode,
		brightness: light.brightness,
		speed: light.speed,
	};
});

// ─────────────────────────────────────────────────────────────────────────────
// ACTIONS
// Thin wrappers — keep business logic here, not in components.
// ─────────────────────────────────────────────────────────────────────────────

export const actions = {
	// ── BLE ────────────────────────────────────────────────────────────────────
	ble: {
		setStatus: (s: BleState["status"]) => session$.ble.status.set(s),
		setDevice: (d: BleState["device"]) => {
			session$.ble.device.set(d);
			if (d) store$.app.lastDeviceId.set(d.id);
		},
		setError: (e: string | null) => session$.ble.error.set(e),
		setScanResults: (
			r: (typeof session$)["ble"]["scanResults"] extends { get(): infer T }
				? T
				: never,
		) => session$.ble.scanResults.set(r),
		disconnect: () => {
			session$.ble.status.set("disconnected");
			session$.ble.device.set(null);
			session$.light.power.set(false);
		},
	},

	// ── Light ──────────────────────────────────────────────────────────────────
	light: {
		setPower: (v: boolean) => session$.light.power.set(v),
		togglePower: () => session$.light.power.set(!session$.light.power.get()),
		setColor: (v: HexColor) => store$.light.color.set(v),
		setBrightness: (v: number) =>
			store$.light.brightness.set(Math.max(1, Math.min(100, v))),
		setSpeed: (v: number) =>
			store$.light.speed.set(Math.max(1, Math.min(100, v))),
		setMode: (v: ModeId) => store$.light.activeMode.set(v),
	},

	// ── Presets ────────────────────────────────────────────────────────────────
	presets: {
		add: (label: string, color: HexColor) => {
			const current = store$.presets.userPresets.get();
			if (current.length >= 5) return;
			store$.presets.userPresets.push({
				id: Date.now().toString(),
				label,
				color,
				createdAt: new Date().toISOString(),
			});
		},
		remove: (id: string) => {
			const current = store$.presets.userPresets.get();
			store$.presets.userPresets.set(current.filter((p) => p.id !== id));
		},
		update: (
			id: string,
			patch: Partial<Pick<ColorPreset, "label" | "color">>,
		) => {
			const current = store$.presets.userPresets.get();
			store$.presets.userPresets.set(
				current.map((p) => (p.id === id ? { ...p, ...patch } : p)),
			);
		},
	},

	// ── Themes ─────────────────────────────────────────────────────────────────
	themes: {
		setActive: (id: string | null) => store$.themes.activeThemeId.set(id),
		add: (theme: Theme) => {
			store$.themes.allThemes.push(theme);
		},
		update: (id: string, patch: Partial<Omit<Theme, "id" | "builtIn">>) => {
			const all = store$.themes.allThemes.get();
			store$.themes.allThemes.set(
				all.map((t) => (t.id === id && !t.builtIn ? { ...t, ...patch } : t)),
			);
		},
		remove: (id: string) => {
			const all = store$.themes.allThemes.get();
			store$.themes.allThemes.set(all.filter((t) => t.id !== id || t.builtIn));
			if (store$.themes.activeThemeId.get() === id) {
				store$.themes.activeThemeId.set(null);
			}
		},
	},

	// ── Rules ──────────────────────────────────────────────────────────────────
	rules: {
		toggleRule: (id: DynamicRuleId) => {
			const current = store$.rules.rules[id].active.get();
			store$.rules.rules[id].active.set(!current);
		},
		setRuleOverride: (
			id: DynamicRuleId,
			key: "canOverrideTheme" | "canOverrideManual",
			value: boolean,
		) => {
			store$.rules.rules[id][key].set(value);
		},
		setLayerOverride: (
			key: keyof (typeof store$)["rules"]["layerOverrides"] extends {
				get(): infer T;
			}
				? never
				: keyof import("@/types").LayerOverrides,
			value: boolean,
		) => {
			(store$.rules.layerOverrides[key] as ReturnType<typeof observable>).set(
				value,
			);
		},
	},

	// ── Dynamic payloads (called by hooks in modules/dynamic/) ─────────────────
	dynamic: {
		set: (payload: DynamicPayload) => {
			session$.dynamic[payload.rule].set(payload as unknown as never);
		},
		clear: (rule: DynamicRuleId) => {
			session$.dynamic[rule].set(null);
		},
	},

	// ── Geo Fence ──────────────────────────────────────────────────────────────
	geoFence: {
		addZone: (zone: GeoFenceZone) => {
			store$.geoFence.zones.push(zone);
		},
		updateZone: (id: string, patch: Partial<Omit<GeoFenceZone, "id">>) => {
			const zones = store$.geoFence.zones.get();
			store$.geoFence.zones.set(
				zones.map((z) => (z.id === id ? { ...z, ...patch } : z)),
			);
		},
		removeZone: (id: string) => {
			const zones = store$.geoFence.zones.get();
			store$.geoFence.zones.set(zones.filter((z) => z.id !== id));
		},
	},

	// ── App ────────────────────────────────────────────────────────────────────
	app: {
		completeOnboarding: () => store$.app.hasOnboarded.set(true),
	},
};

// ─────────────────────────────────────────────────────────────────────────────
// SLICE HOOKS
// Convenience hooks for components — wrap Legend's observer pattern.
// ─────────────────────────────────────────────────────────────────────────────

// In components, use Legend's `observer()` HOC or `useSelector()`:
//
//   import { observer } from "@legendapp/state/react"
//   import { store$, session$, activeTheme$, isAutoColor$ } from "@/store"
//
//   const HomeScreen = observer(() => {
//     const color      = store$.light.color.get()
//     const power      = session$.light.power.get()
//     const autoColor  = isAutoColor$.get()
//     const modeDef    = activeModeDef$.get()
//     ...
//   })
//
// Or use useSelector for non-observer components:
//
//   import { useSelector } from "@legendapp/state/react"
//   const color = useSelector(store$.light.color)
