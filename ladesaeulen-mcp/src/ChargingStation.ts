import { Coordinates } from './Coordinates.js';

export interface ChargingStation {
    betreiber: string;
    art_der_ladeeinrichung: string;
    anzahl_ladepunkte: number;
    steckertypen1: string | null;
    steckertypen2: string | null;
    steckertypen3: string | null;
    steckertypen4: string | null;
    p1_kw: number | null;
    p2_kw: number | null;
    p3_kw: number | null;
    p4_kw: number | null;
    nennleistung_ladeeinrichtung_kw: number;
    kreis_kreisfreie_stadt: string;
    ort: string;
    postleitzahl: string;
    strasse: string;
    hausnummer: string;
    adresszusatz: string | null;
    inbetriebnahmedatum: string | null;
    koordinaten: Coordinates;
    anzeigename_karte: string | null;
    steckertypen5: string | null;
    p5_kw: number | null;
    steckertypen6: string | null;
    p6_kw: number | null;
}
