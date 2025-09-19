import { calculateDistance } from "./calculateDistance.js";
import { Coordinates } from "./Coordinates.js";
import { getEChargersInGermany } from "./data.js";

export function getNearestChargers(location: Coordinates, limit = 5) {
    const chargers = getEChargersInGermany().toSorted(
        (c1, c2) => {
            const d1 = calculateDistance(location, c1.koordinaten);
            const d2 = calculateDistance(location, c2.koordinaten);
            return d1 - d2;
        }
    );
    return limit > 0 && limit < chargers.length ?
        chargers.slice(0, limit) :
        chargers;
}