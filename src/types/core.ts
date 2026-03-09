export interface AppState {
	hasOnboarded: boolean;
	/** Used for auto-reconnect on app launch */
	lastDeviceId: string | null;
}
