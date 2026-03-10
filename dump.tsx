import ChristmasTheme from "@/components/Christmas";
import ChristmasThemeV2 from "@/components/ChristmasV2";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BLEService } from "@/constants/BLEInstance";
import { useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import type { Characteristic, Device, Service } from "react-native-ble-plx";

export default function DeviceScreen() {
	const [device, setDevice] = useState<Device | null>();
	const [chars, setChars] = useState<Characteristic | null>();
	const [services, setServices] = useState<Service[]>([]);
	useEffect(() => {
		const connectedDevice = BLEService.getDevice();
		setDevice(connectedDevice);
	}, []);

	async function getCharacteristics() {
		if (!device) {
			console.info("No device connected");
			return;
		}

		const connected = await device.isConnected();
		if (!connected) {
			console.info("Device not connected");
			return;
		}

		const dev = await device.discoverAllServicesAndCharacteristics();
		console.log("Discovered dev:", JSON.stringify(dev, null, 2));

		try {
			const services = await device.services();
			console.log("Services:", JSON.stringify(services, null, 2));
			setServices(services);
		} catch (error) {
			console.error("Error fetching characteristics:", error);
		}

		const chars = await device.characteristicsForService(services[0].uuid);
		console.log("Discovered Characteristics:", JSON.stringify(chars, null, 2));
		if (chars.length === 0) {
			console.info("No characteristics found for the first service");
			return;
		}
		setChars(chars[0]);
	}

	function hexToBase64(hexString: string): string {
		// Remove any spaces or 0x prefixes
		const cleanHex = hexString.replace(/\s+|0x/g, "");

		// Convert hex string to byte array
		const bytes = [];
		for (let i = 0; i < cleanHex.length; i += 2) {
			bytes.push(Number.parseInt(cleanHex.substr(i, 2), 16));
		}

		// Convert byte array to base64
		const binary = String.fromCharCode(...bytes);
		return btoa(binary);
	}

	function writeToDevice(value: string) {
		if (!chars) {
			console.info("No characteristics or services available");
			return;
		}

		const base64Value = hexToBase64(value);

		chars
			.writeWithoutResponse(base64Value)
			.then((c) => {
				console.log("Wrote to characteristic without response");
				console.log("Characteristic after write:", JSON.stringify(c, null, 2));
			})
			.catch((error) => {
				console.error("Error writing to characteristic:", error);
			});
	}

	const colors = [
		{ name: "Red", hex: "#ff0000", command: "7eff0503ff0000ffef" },
		{ name: "Orange", hex: "#ff8000", command: "7eff0503ff8000ffef" },
		{ name: "Yellow", hex: "#ffff00", command: "7eff0503ffff00ffef" },
		{ name: "Green", hex: "#00ff00", command: "7eff050300ff00ffef" },
		{ name: "Cyan", hex: "#00ffff", command: "7eff050300ffffef" },
		{ name: "Blue", hex: "#0000ff", command: "7eff05030000ffffef" },
		{ name: "Purple", hex: "#8000ff", command: "7eff05038000ffffef" },
		{ name: "Magenta", hex: "#ff00ff", command: "7eff0503ff00ffffef" },
		{ name: "White", hex: "#ffffff", command: "7eff0503ffffffffef" },
		{ name: "Gold", hex: "#ffd700", command: "7eff0503ffd700ffef" },
	];

	if (!device) {
		return (
			<ThemedView
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ThemedText>No device connected</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ScrollView>
			<ThemedText>Device Screen</ThemedText>

			<ThemedText>Name : {device.name}</ThemedText>

			{chars ? (
				<ThemedText>Characteristic UUID: {chars.uuid}</ThemedText>
			) : (
				<ThemedText
					onPress={getCharacteristics}
					style={{ marginTop: 20, color: "blue" }}
				>
					Get Characteristics
				</ThemedText>
			)}

			<TextInput
				placeholder="Enter value to write"
				style={{
					height: 40,
					borderColor: "gray",
					borderWidth: 1,
					width: "80%",
					marginTop: 20,
					paddingHorizontal: 10,
					color: "white",
				}}
				onSubmitEditing={(event) => writeToDevice(event.nativeEvent.text)}
			/>

			{chars ? <ChristmasTheme chars={chars} /> : null}
			{chars ? <ChristmasThemeV2 chars={chars} /> : null}

			{colors.map((color, index) => (
				<TouchableOpacity
					key={index}
					onPress={() => writeToDevice(color.command)}
					style={[{ backgroundColor: color.hex }]}
				>
					<ThemedText>{color.name}</ThemedText>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
}

// ==========================================================================================================================================
// ==========================================================================================================================================
// ==========================================================================================================================================
// ==========================================================================================================================================
// ==========================================================================================================================================

import { Alert, PermissionsAndroid, Platform } from "react-native";
import {
	type Base64,
	type BleError,
	BleErrorCode,
	BleManager,
	State as BluetoothState,
	type DeviceId,
	LogLevel,
	type Subscription,
	type TransactionId,
	type UUID,
} from "react-native-ble-plx";

const deviceNotConnectedErrorText = "Device is not connected";

class BLEServiceInstance {
	manager: BleManager;

	device: Device | null;

	characteristicMonitor: Subscription | null;

	isCharacteristicMonitorDisconnectExpected = false;

	constructor() {
		this.device = null;
		this.characteristicMonitor = null;
		this.manager = new BleManager();
		this.manager.setLogLevel(LogLevel.Verbose);
	}

	createNewManager = () => {
		this.manager = new BleManager();
		this.manager.setLogLevel(LogLevel.Verbose);
	};

	getDevice = () => this.device;

	initializeBLE = () =>
		new Promise<void>((resolve) => {
			const subscription = this.manager.onStateChange((state) => {
				switch (state) {
					case BluetoothState.Unsupported:
						this.showErrorToast("");
						break;
					case BluetoothState.PoweredOff:
						this.onBluetoothPowerOff();
						this.manager.enable().catch((error: BleError) => {
							if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
								this.requestBluetoothPermission();
							}
						});
						break;
					case BluetoothState.Unauthorized:
						this.requestBluetoothPermission();
						break;
					case BluetoothState.PoweredOn:
						resolve();
						subscription.remove();
						break;
					default:
						console.error("Unsupported state: ", state);
					// resolve()
					// subscription.remove()
				}
			}, true);
		});

	disconnectDevice = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager
			.cancelDeviceConnection(this.device.id)
			.then(() => this.showSuccessToast("Device disconnected"))
			.catch((error) => {
				if (error?.code !== BleErrorCode.DeviceDisconnected) {
					this.onError(error);
				}
			});
	};

	disconnectDeviceById = (id: DeviceId) =>
		this.manager
			.cancelDeviceConnection(id)
			.then(() => this.showSuccessToast("Device disconnected"))
			.catch((error) => {
				if (error?.code !== BleErrorCode.DeviceDisconnected) {
					this.onError(error);
				}
			});

	onBluetoothPowerOff = () => {
		this.showErrorToast("Bluetooth is turned off");
	};

	scanDevices = async (
		onDeviceFound: (device: Device) => void,
		UUIDs: UUID[] | null = null,
		legacyScan?: boolean,
	) => {
		this.manager
			.startDeviceScan(UUIDs, { legacyScan }, (error, device) => {
				if (error) {
					this.onError(error);
					console.error("Error during device scan:", error.message);
					this.manager.stopDeviceScan();
					return;
				}
				if (device) {
					onDeviceFound(device);
				}
			})
			.then(() => {})
			.catch((err) => {
				this.onError(err);
				console.error("Error starting device scan:", err);
			});
	};

	connectToDevice = (deviceId: DeviceId) =>
		new Promise<Device>((resolve, reject) => {
			this.manager.stopDeviceScan();
			this.manager
				.connectToDevice(deviceId)
				.then((device) => {
					this.device = device;
					resolve(device);
				})
				.catch((error) => {
					if (
						error.errorCode === BleErrorCode.DeviceAlreadyConnected &&
						this.device
					) {
						resolve(this.device);
					} else {
						this.onError(error);
						reject(error);
					}
				});
		});

	discoverAllServicesAndCharacteristicsForDevice = async () =>
		new Promise<Device>((resolve, reject) => {
			if (!this.device) {
				this.showErrorToast(deviceNotConnectedErrorText);
				reject(new Error(deviceNotConnectedErrorText));
				return;
			}
			this.manager
				.discoverAllServicesAndCharacteristicsForDevice(this.device.id)
				.then((device) => {
					resolve(device);
					this.device = device;
				})
				.catch((error) => {
					this.onError(error);
					reject(error);
				});
		});

	readCharacteristicForDevice = async (
		serviceUUID: UUID,
		characteristicUUID: UUID,
	) =>
		new Promise<Characteristic>((resolve, reject) => {
			if (!this.device) {
				this.showErrorToast(deviceNotConnectedErrorText);
				reject(new Error(deviceNotConnectedErrorText));
				return;
			}
			this.manager
				.readCharacteristicForDevice(
					this.device.id,
					serviceUUID,
					characteristicUUID,
				)
				.then((characteristic) => {
					resolve(characteristic);
				})
				.catch((error) => {
					this.onError(error);
				});
		});

	writeCharacteristicWithResponseForDevice = async (
		serviceUUID: UUID,
		characteristicUUID: UUID,
		time: Base64,
	) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager
			.writeCharacteristicWithResponseForDevice(
				this.device.id,
				serviceUUID,
				characteristicUUID,
				time,
			)
			.catch((error) => {
				this.onError(error);
			});
	};

	writeCharacteristicWithoutResponseForDevice = async (
		serviceUUID: UUID,
		characteristicUUID: UUID,
		time: Base64,
	) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager
			.writeCharacteristicWithoutResponseForDevice(
				this.device.id,
				serviceUUID,
				characteristicUUID,
				time,
			)
			.catch((error) => {
				this.onError(error);
			});
	};

	setupMonitor = (
		serviceUUID: UUID,
		characteristicUUID: UUID,
		onCharacteristicReceived: (characteristic: Characteristic) => void,
		onError: (error: Error) => void,
		transactionId?: TransactionId,
		hideErrorDisplay?: boolean,
	) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		this.characteristicMonitor = this.manager.monitorCharacteristicForDevice(
			this.device?.id,
			serviceUUID,
			characteristicUUID,
			(error, characteristic) => {
				if (error) {
					if (
						error.errorCode === 2 &&
						this.isCharacteristicMonitorDisconnectExpected
					) {
						this.isCharacteristicMonitorDisconnectExpected = false;
						return;
					}
					onError(error);
					if (!hideErrorDisplay) {
						this.onError(error);
						this.characteristicMonitor?.remove();
					}
					return;
				}
				if (characteristic) {
					onCharacteristicReceived(characteristic);
				}
			},
			transactionId,
		);
	};

	setupCustomMonitor: BleManager["monitorCharacteristicForDevice"] = (
		...args
	) => this.manager.monitorCharacteristicForDevice(...args);

	finishMonitor = () => {
		this.isCharacteristicMonitorDisconnectExpected = true;
		this.characteristicMonitor?.remove();
	};

	writeDescriptorForDevice = async (
		serviceUUID: UUID,
		characteristicUUID: UUID,
		descriptorUUID: UUID,
		data: Base64,
	) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager
			.writeDescriptorForDevice(
				this.device.id,
				serviceUUID,
				characteristicUUID,
				descriptorUUID,
				data,
			)
			.catch((error) => {
				this.onError(error);
			});
	};

	readDescriptorForDevice = async (
		serviceUUID: UUID,
		characteristicUUID: UUID,
		descriptorUUID: UUID,
	) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager
			.readDescriptorForDevice(
				this.device.id,
				serviceUUID,
				characteristicUUID,
				descriptorUUID,
			)
			.catch((error) => {
				this.onError(error);
			});
	};

	getServicesForDevice = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager.servicesForDevice(this.device.id).catch((error) => {
			this.onError(error);
		});
	};

	getCharacteristicsForDevice = (serviceUUID: UUID) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager
			.characteristicsForDevice(this.device.id, serviceUUID)
			.catch((error) => {
				this.onError(error);
			});
	};

	getDescriptorsForDevice = (serviceUUID: UUID, characteristicUUID: UUID) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager
			.descriptorsForDevice(this.device.id, serviceUUID, characteristicUUID)
			.catch((error) => {
				this.onError(error);
			});
	};

	isDeviceConnected = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager.isDeviceConnected(this.device.id);
	};

	isDeviceWithIdConnected = (id: DeviceId) =>
		this.manager
			.isDeviceConnected(id)
			.catch((error) =>
				console.error("Error checking device connection:", error),
			);

	getConnectedDevices = (expectedServices: UUID[]) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager.connectedDevices(expectedServices).catch((error) => {
			this.onError(error);
		});
	};

	requestMTUForDevice = (mtu: number) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager
			.requestMTUForDevice(this.device.id, mtu)
			.catch((error) => {
				this.onError(error);
			});
	};

	onDeviceDisconnected = (
		listener: (error: BleError | null, device: Device | null) => void,
	) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager.onDeviceDisconnected(this.device.id, listener);
	};

	onDeviceDisconnectedCustom: BleManager["onDeviceDisconnected"] = (...args) =>
		this.manager.onDeviceDisconnected(...args);

	readRSSIForDevice = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager.readRSSIForDevice(this.device.id).catch((error) => {
			this.onError(error);
		});
	};

	getDevices = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager.devices([this.device.id]).catch((error) => {
			this.onError(error);
		});
	};

	cancelTransaction = (transactionId: TransactionId) =>
		this.manager.cancelTransaction(transactionId);

	enable = () =>
		this.manager.enable().catch((error) => {
			this.onError(error);
		});

	disable = () =>
		this.manager.disable().catch((error) => {
			this.onError(error);
		});

	getState = () =>
		this.manager.state().catch((error) => {
			this.onError(error);
		});

	onError = (error: BleError) => {
		switch (error.errorCode) {
			case BleErrorCode.BluetoothUnauthorized:
				this.requestBluetoothPermission();
				break;
			case BleErrorCode.LocationServicesDisabled:
				this.showErrorToast("Location services are disabled");
				break;
			default:
				this.showErrorToast(JSON.stringify(error, null, 4));
		}
	};

	requestConnectionPriorityForDevice = (priority: 0 | 1 | 2) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager.requestConnectionPriorityForDevice(
			this.device?.id,
			priority,
		);
	};

	cancelDeviceConnection = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText);
			throw new Error(deviceNotConnectedErrorText);
		}
		return this.manager.cancelDeviceConnection(this.device?.id);
	};

	requestBluetoothPermission = async () => {
		if (Platform.OS === "ios") {
			return true;
		}
		if (Platform.OS === "android") {
			const apiLevel = Number.parseInt(Platform.Version.toString(), 10);

			if (
				apiLevel < 31 &&
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
			) {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				);
				return granted === PermissionsAndroid.RESULTS.GRANTED;
			}
			if (
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
			) {
				const result = await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
				]);

				return (
					result["android.permission.BLUETOOTH_CONNECT"] ===
						PermissionsAndroid.RESULTS.GRANTED &&
					result["android.permission.BLUETOOTH_SCAN"] ===
						PermissionsAndroid.RESULTS.GRANTED
				);
			}
		}

		this.showErrorToast("Permission have not been granted");

		return false;
	};

	showErrorToast = (error: string) => {
		Alert.alert("Error", error);
		console.error("BLE Error:", error);
	};

	showSuccessToast = (info: string) => {
		Alert.alert("Success", info);
	};
}

export const BLEService = new BLEServiceInstance();
