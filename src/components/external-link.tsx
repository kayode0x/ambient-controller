import { type Href, Link } from "expo-router";
import type { ComponentProps } from "react";
import { Alert } from "react-native";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
	href: Href & string;
};

export function ExternalLink({ href, ...rest }: Props) {
	return (
		<Link
			target="_blank"
			{...rest}
			href={href}
			onPress={async (event) => {
				Alert.alert("PRESSED");
			}}
		/>
	);
}
