import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TabPageWrapper } from "@/components/ui/tab-page";
import {
	AnimatedListHeader,
	AnimatedListLargeHeader,
} from "@/components/ui/tab-page/headers";
import React from "react";

export default function TabTwoScreen() {
	return (
		<TabPageWrapper
			HeaderComponent={(props) => (
				<AnimatedListHeader {...props} title="Rules" />
			)}
			LargeHeaderComponent={() => (
				<AnimatedListLargeHeader title="Rules" subtitle="Hello there" />
			)}
		>
			<ThemedView style={{ backgroundColor: "red", height: 300 }}>
				<ThemedText>Hi</ThemedText>
			</ThemedView>
		</TabPageWrapper>
	);
}
