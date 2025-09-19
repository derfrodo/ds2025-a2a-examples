import fs from 'fs';
import path from 'path';
import { ChargingStation } from './ChargingStation.js';
import { fileURLToPath } from 'url';

let echargersInGermany: ChargingStation[] | null = null;

function deepFreeze<T>(obj: T): T {
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            const value = (obj as any)[key];
            if (value && typeof value === 'object') {
                deepFreeze(value);
            }
        });
        Object.freeze(obj);
    }
    return obj;
}

export function getEChargersInGermany(): ReadonlyArray<ChargingStation> {
    if (!echargersInGermany) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.resolve(__dirname, '../data/ladesaulen-in-deutschland.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const originaldata = JSON.parse(fileContent) as ChargingStation[];
        echargersInGermany = originaldata.map(station => {
            const { p5_kw, p6_kw, ...rest } = station;
            return ({
                ...rest,
                p5_kw: typeof p5_kw === "string" ? Number(p5_kw) : p5_kw,
                p6_kw: typeof p6_kw === "string" ? Number(p6_kw) : p6_kw,
            })
        })
        deepFreeze(echargersInGermany);
    }

    return echargersInGermany;
}

