import { Dimensions, Platform } from "react-native";
import { Screens } from "./theme";

export const ROOT_HORIZONTAL_PADDING = 15;
export const IS_ANDROID = Platform.OS === "android";
export const IS_TABLET = Dimensions.get("window").width >= Screens.md;
