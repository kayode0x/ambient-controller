import type { Theme } from "@/types/themes";

export const BUILT_IN_THEMES: Theme[] = [
	{
		id: "christmas",
		label: "Christmas",
		icon: "🎄",
		colors: [
			"#ff3b5c", // red
			"#00ff00", // green
			"#ffffff", // white
			"#ffd700", // gold
			"#8b0000", // dark red
			"#006400", // dark green
		],
		mode: "7color_breathe",
		builtIn: true,
	},
	{
		id: "halloween",
		label: "Halloween",
		icon: "🎃",
		colors: [
			"#ff7518", // orange
			"#000000", // black
			"#ff0000", // red
		],
		mode: "3color_jump",
		builtIn: true,
	},
	{
		id: "4th_of_july",
		label: "4th of July",
		icon: "🇺🇸",
		colors: [
			"#ff0000", // red
			"#ffffff", // white
			"#0000ff", // blue
		],
		mode: "3color_jump",
		builtIn: true,
	},
	{
		id: "sunset",
		label: "Sunset",
		icon: "🌅",
		colors: [
			"#ff7e5f", // orange
			"#feb47b", // peach
			"#ff6a88", // pink
		],
		mode: "3color_gradient",
		builtIn: true,
	},
	{
		id: "ocean",
		label: "Ocean",
		icon: "🌊",
		colors: [
			"#00c6ff", // light blue
			"#0072ff", // blue
			"#00ffea", // cyan
		],
		mode: "3color_gradient",
		builtIn: true,
	},
	{
		id: "forest",
		label: "Forest",
		icon: "🌲",
		colors: [
			"#228B22", // forest green
			"#006400", // dark green
			"#8FBC8F", // dark sea green
		],
		mode: "3color_gradient",
		builtIn: true,
	},
	{
		id: "valentines",
		label: "Valentine's Day",
		icon: "❤️",
		colors: [
			"#ff69b4", // hot pink
			"#ff1493", // deep pink
			"#ffffff", // white
		],
		mode: "3color_gradient",
		builtIn: true,
	},
	{
		id: "new_year",
		label: "New Year",
		icon: "🎉",
		colors: [
			"#ff0000", // red
			"#00ff00", // green
			"#0000ff", // blue
			"#ffff00", // yellow
			"#ff00ff", // magenta
			"#00ffff", // cyan
			"#ffffff", // white
		],
		mode: "7color_flash",
		builtIn: true,
	},
	{
		id: "st_patrick",
		label: "St. Patrick's Day",
		icon: "🍀",
		colors: [
			"#006400", // dark green
			"#00ff00", // bright green
			"#ffffff", // white
		],
		mode: "3color_jump",
		builtIn: true,
	},
];
