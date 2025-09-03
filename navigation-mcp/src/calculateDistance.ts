import { Coordinates } from './Coordinates.js';

export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const R = 6371; // Erdradius in Kilometern
    const φ1 = toRadians(coord1.lat);
    const φ2 = toRadians(coord2.lat);
    const Δφ = toRadians(coord2.lat - coord1.lat);
    const Δλ = toRadians(coord2.lon - coord1.lon);
    const sinDeltaLambda = Math.sin(Δλ / 2);
    const sinDeltaPhi = Math.sin(Δφ / 2);
    // Haversine-Formel
    const a = sinDeltaPhi * sinDeltaPhi +
        Math.cos(φ1) * Math.cos(φ2) *
        sinDeltaLambda * sinDeltaLambda;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distanz in Kilometern
}
