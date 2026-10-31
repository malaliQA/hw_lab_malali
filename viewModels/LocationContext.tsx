import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarCoordinate, defaultCarCoordinate } from '../models/CarCoordinate';

const STORAGE_KEY = '@FindMyCar:coordinate';

// Everything a screen can read or call through useLocation().
type LocationContextValue = {
    coordinate: CarCoordinate;
    loading: boolean;
    saveCurrentLocation: () => Promise<CarCoordinate>;
    clearLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

// Provider that owns the saved car coordinate and shares it with every screen,
// so saving on one screen immediately updates any other screen reading it.
export function LocationProvider({ children }: { children: ReactNode }) {
    const [coordinate, setCoordinate] = useState<CarCoordinate>(defaultCarCoordinate);
    const [loading, setLoading] = useState(true);

    // Load whatever coordinate was saved from a previous session on mount.
    // This is the RN equivalent of the Swift LocationManager's loadLocation()
    // being called from init().
    useEffect(() => {
        // useEffect callbacks can't be async, so the await happens in this inner function.
        (async () => {
            try {
                const json = await AsyncStorage.getItem(STORAGE_KEY);
                if (json != null) setCoordinate(JSON.parse(json));
            } catch (error) {
                console.error('Error loading coordinate:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Checks location services and permission, gets the device's current
    // position, saves it to AsyncStorage and state, and returns it.
    // Throws an Error if services are off or permission is denied.
    async function saveCurrentLocation(): Promise<CarCoordinate> {
        // Confirm services + permissions before asking for a position.
        if (!(await Location.hasServicesEnabledAsync())) {
            throw new Error('Location services are disabled.');
        }
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            ({ status } = await Location.requestForegroundPermissionsAsync());
        }
        if (status !== 'granted') {
            throw new Error('Location access denied. Please enable in Settings.');
        }

        const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });

        const next: CarCoordinate = {
            latitude: fix.coords.latitude,
            longitude: fix.coords.longitude,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setCoordinate(next);
        return next;
    }

    // Resets the saved location to the (0, 0) default in storage and state.
    async function clearLocation(): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCarCoordinate));
        setCoordinate(defaultCarCoordinate);
    }

    return (
        <LocationContext.Provider value={{ coordinate, loading, saveCurrentLocation, clearLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

// Hook screens use to reach the shared location store. Throws if a component
// calls it outside of LocationProvider.
export function useLocation(): LocationContextValue {
    const ctx = useContext(LocationContext);
    if (!ctx) throw new Error('useLocation must be used inside a LocationProvider');
    return ctx;
}
