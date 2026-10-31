// A latitude/longitude pair. Used both for saving to storage and for placing
// the map marker, since react-native-maps accepts this shape directly.
export interface CarCoordinate {
    latitude: number;
    longitude: number;
}

// Placeholder value meaning "no car location has been saved yet".
export const defaultCarCoordinate: CarCoordinate = {
    latitude: 0.0,
    longitude: 0.0,
};

// Returns true when the coordinate is a real saved location, meaning at least
// one component differs from the (0, 0) default.
export function isValidCoordinate(coordinate: CarCoordinate): boolean {
    return coordinate.latitude !== 0 || coordinate.longitude !== 0;
}

// Formats a coordinate for display with six decimals, e.g. "(40.444644, -79.945424)".
export function formatCoordinate(coordinate: CarCoordinate): string {
    const lat = coordinate.latitude.toFixed(6);
    const lon = coordinate.longitude.toFixed(6);
    return `(${lat}, ${lon})`;
}
