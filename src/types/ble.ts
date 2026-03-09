export type BleConnectionStatus =
	| "disconnected"
	| "scanning"
	| "connecting"
	| "connected"
	| "error";

export interface BleDevice {
	id: string; // react-native-ble-plx device ID
	name: string;
	rssi: number; // signal strength in dBm
	serviceUUID: string;
	characteristicUUID: string;
}

export interface BleState {
	status: BleConnectionStatus;
	device: BleDevice | null;
	/** Last known error message, cleared on next connect attempt */
	error: string | null;
}
