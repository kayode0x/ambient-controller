import { IS_ANDROID } from "@/constants/helpers";
import { useTheme } from "@/hooks/use-theme";
import {
	type ScrollHeaderProps,
	type ScrollLargeHeaderProps,
	ScrollViewWithHeaders,
} from "@codeherence/react-native-header";
import type { ReactNode } from "react";
import { type ScrollViewProps, StyleSheet, View } from "react-native";

type TabPageWrapperProps = {
	children: ReactNode;
	HeaderComponent: (props: ScrollHeaderProps) => ReactNode;
	LargeHeaderComponent: (props: ScrollLargeHeaderProps) => ReactNode;
} & ScrollViewProps;

export function TabPageWrapper({
	LargeHeaderComponent,
	HeaderComponent,
	children,
	...rest
}: TabPageWrapperProps) {
	const theme = useTheme();
	return (
		<View style={{ flex: 1, backgroundColor: theme.background }}>
			<ScrollViewWithHeaders
				HeaderComponent={HeaderComponent}
				showsVerticalScrollIndicator={false}
				LargeHeaderComponent={LargeHeaderComponent}
				{...rest}
			>
				<View
					style={[styles.subContainer, { backgroundColor: theme.background }]}
				>
					{children}
				</View>
			</ScrollViewWithHeaders>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	subContainer: {
		flex: 1,
		marginBottom: 20,
		paddingVertical: 15,
		paddingHorizontal: IS_ANDROID ? 0 : 5,
	},
});
