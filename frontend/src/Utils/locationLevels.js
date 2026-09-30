// Mirrors backend/models/locationModel.js LOCATION_LEVELS. Rwanda: Province >
// District > Sector. Uganda: District > County/Municipality > Sub-county.
// The actual nodes at each level are admin-managed data, not hardcoded here.
export const LOCATION_LEVELS = {
  Rwanda: ["Province", "District", "Sector"],
  Uganda: ["District", "County/Municipality", "Sub-county"],
};

export const SHIPPING_COUNTRIES = Object.keys(LOCATION_LEVELS);
