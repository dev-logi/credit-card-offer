/**
 * Location service for getting user's current location.
 * Handles permissions and location retrieval.
 */

import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Request location permission and get current location.
 * @returns Location coordinates or null if permission denied or error
 */
export async function getCurrentLocation(): Promise<LocationCoordinates | null> {
  try {
    // Check if location services are enabled
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      Alert.alert(
        'Location Services Disabled',
        'Please enable location services in your device settings to see nearby stores.',
        [{ text: 'OK' }]
      );
      return null;
    }

    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to show nearby stores. You can still search for stores manually.',
        [{ text: 'OK' }]
      );
      return null;
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, // Good balance between accuracy and battery
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

/**
 * Check if location permission has been granted (without requesting).
 * @returns true if permission is granted, false otherwise
 */
export async function hasLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
}

