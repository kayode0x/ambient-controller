import React from "react";

const nest = (children: React.ReactNode, component: React.ReactElement) =>
	React.cloneElement(component, {}, children);

type MultiProviderProps = React.PropsWithChildren<{
	providers: React.ReactElement[];
}>;

export const MultiProvider: React.FC<MultiProviderProps> = ({
	children,
	providers,
}) => providers.reduceRight(nest, children as React.ReactElement);
