import { ThemedText } from "@/components/themed-text";
import { IS_ANDROID, ROOT_HORIZONTAL_PADDING } from "@/constants/helpers";
import { useTheme } from "@/hooks/use-theme";
import {
	Header,
	LargeHeader,
	type ScrollHeaderProps,
} from "@codeherence/react-native-header";
import type React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderProps = ScrollHeaderProps & {
	title?: string;
	onRightPress?: () => void;
	children?: React.ReactNode;
	NavRightIcons?: React.ReactNode;
};

export function AnimatedListHeader({
	title,
	children,
	showNavBar,
	onRightPress,
	NavRightIcons,
}: HeaderProps) {
	const theme = useTheme();
	const { left, right } = useSafeAreaInsets();

	const headerLeftStyle: StyleProp<ViewStyle> = {
		paddingLeft: Math.max(left, ROOT_HORIZONTAL_PADDING),
	};
	const headerRightStyle: StyleProp<ViewStyle> = {
		paddingLeft: Math.max(right, ROOT_HORIZONTAL_PADDING),
	};

	return (
		<View style={{ backgroundColor: theme.background, position: "relative" }}>
			{children}

			<Header
				noBottomBorder
				showNavBar={showNavBar}
				headerCenterFadesIn={!!title}
				headerLeftStyle={headerLeftStyle}
				headerStyle={{ paddingBottom: 5, backgroundColor: "transparent" }}
				headerRightStyle={headerRightStyle}
				headerCenter={
					title ? (
						<ThemedText
							numberOfLines={1}
							style={{
								fontSize: 16,
								color: theme.text,
								fontWeight: "bold",
							}}
						>
							{title}
						</ThemedText>
					) : null
				}
			/>
		</View>
	);
}

type LargeHeaderProps = {
	title: string;
	cover?: string;
	subtitle?: string;
	children?: React.ReactNode;
};

export function AnimatedListLargeHeader({
	title,
	subtitle,
	children,
}: LargeHeaderProps) {
	const theme = useTheme();
	const topSpacing = 12;
	return (
		<LargeHeader
			headerStyle={{
				marginTop: topSpacing,
				flexDirection: "column",
				backgroundColor: theme.background,
				zIndex: 1,
			}}
		>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<ThemedText style={{ fontSize: 19, fontWeight: "bold" }}>
					{title}
				</ThemedText>
			</View>

			{subtitle ? (
				<ThemedText
					style={{ color: theme.textSub, marginTop: 5, fontSize: 12 }}
				>
					{subtitle}
				</ThemedText>
			) : null}

			{children}
		</LargeHeader>
	);
}

const styles = StyleSheet.create({
	headerRight: {
		width: "100%",
		marginLeft: "auto",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		minHeight: IS_ANDROID ? 28 : 30,
		marginRight: 8,
	},
});
