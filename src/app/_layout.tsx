import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { MultiProvider } from "@/components/ui/multi-provider";
import { useTheme } from "@/hooks/use-theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableFreeze } from "react-native-screens";

enableFreeze(true);

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const theme = useTheme();
	return (
		<MultiProvider
			providers={[
				// @ts-expect-error - Children will still be passed.
				<ThemeProvider
					key={"theme"}
					value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
				/>,
				<BottomSheetModalProvider key={"bottom-sheet"} />,
				<SafeAreaProvider
					style={{ backgroundColor: theme.background }}
					key={"safe-area"}
				/>,
			]}
		>
			<AnimatedSplashOverlay />
			<AppTabs />
		</MultiProvider>
	);
}
