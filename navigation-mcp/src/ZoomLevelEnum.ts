import { z } from "zod";

// Centralized Zod enum for zoom levels and address details
export const ZoomLevelEnum = z.enum([
    "3", // country
    "5", // state
    "8", // county
    "10", // city
    "12", // town / borough
    "13", // village / suburb
    "14", // neighbourhood
    "15", // any settlement
    "16", // major streets
    "17", // major and minor streets
    "18" // building
]).describe(`Level of detail required for the address. Default is 18. This is a number that corresponds roughly to the zoom level used in XYZ tile sources in frameworks like Leaflet.js, Openlayers etc. In terms of address details the zoom:\n3: country\n5: state\n8: county\n10: city\n12: town / borough\n13: village / suburb\n14: neighbourhood\n15: any settlement\n16: major streets\n17: major and minor streets\n18: building`);
