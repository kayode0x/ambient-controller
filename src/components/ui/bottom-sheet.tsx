import { useTheme } from "@/hooks/use-theme";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	type BottomSheetModalProps,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import type React from "react";
import { useCallback } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = BottomSheetModalProps & {
	modalRef: React.RefObject<BottomSheetModal>;
	onDismiss: () => void;
	children: React.ReactNode;
};

export function DetachedBottomSheet({
	modalRef,
	onDismiss,
	children,
	snapPoints,
	...rest
}: Props) {
	const renderBackdrop = useRenderBackdrop();
	const { top, bottom } = useSafeAreaInsets();

	return (
		<BottomSheetModal
			ref={modalRef}
			detached={true}
			topInset={top}
			bottomInset={bottom}
			snapPoints={snapPoints}
			onDismiss={onDismiss}
			handleComponent={() => null}
			keyboardBehavior="interactive"
			backdropComponent={renderBackdrop}
			backgroundComponent={DetachedSheetBackground}
			{...rest}
		>
			<DetachedSheetSubBackground>{children}</DetachedSheetSubBackground>
		</BottomSheetModal>
	);
}

function useRenderBackdrop() {
	const renderBackdrop = useCallback(
		(props: BottomSheetDefaultBackdropProps) => (
			<BottomSheetBackdrop
				opacity={0.8}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				onPress={() => Keyboard.dismiss()}
				{...props}
			/>
		),
		[],
	);

	return renderBackdrop;
}

function DetachedSheetBackground() {
	return <View style={styles.container} />;
}

function DetachedSheetSubBackground({
	children,
}: { children: React.ReactNode }) {
	const theme = useTheme();
	return (
		<BottomSheetView
			style={[
				styles.subContainer,
				{
					borderColor: theme.borderPrimary,
					backgroundColor: theme.backgroundSub,
				},
			]}
		>
			{children}
		</BottomSheetView>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 0,
		marginHorizontal: 15,
		borderRadius: 15,
		minHeight: 500,
	},
	subContainer: {
		marginHorizontal: 15,
		borderRadius: 25,
		borderWidth: 1,
		borderStyle: "solid",
	},
});
