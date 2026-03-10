/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
	light: {
		text: "#000000",
		textSub: "#757575",
		background: "#FFFFFF",
		backgroundSub: "#F9F9F9",
		backgroundElement: "#F0F0F3",
		backgroundSelected: "#E0E1E6",
		textSecondary: "#60646C",
		borderPrimary: "rgba( 229, 229, 234, 0.5 )",
		borderSecondary: "rgba( 229, 229, 234, 0.5 )",
	},
	dark: {
		text: "#ffffff",
		textSub: "#BDBDBD",
		background: "#000000",
		backgroundSub: "#1A1A1A",
		backgroundElement: "#212225",
		backgroundSelected: "#2E3135",
		textSecondary: "#B0B4BA",
		borderPrimary: "rgba( 209, 209, 214, 0.15 )",
		borderSecondary: "rgba( 72, 72, 74, 0.4 )",
	},
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: "system-ui",
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: "ui-serif",
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: "ui-rounded",
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: "ui-monospace",
	},
	default: {
		sans: "normal",
		serif: "serif",
		rounded: "normal",
		mono: "monospace",
	},
});

export const Spacing = {
	half: 2,
	one: 4,
	two: 8,
	three: 16,
	four: 24,
	five: 32,
	six: 64,
} as const;

export const Screens = {
	sm: 540,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1600,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
