import mongoose from "mongoose";

// Rwanda: Province > District > Sector. Uganda: District > County/Municipality > Sub-county.
// Level is a 0-2 index into these labels per country; the actual nodes (which
// provinces/districts/sectors etc. exist) are admin-managed data, not hardcoded.
export const LOCATION_LEVELS = {
  Rwanda: ["Province", "District", "Sector"],
  Uganda: ["District", "County/Municipality", "Sub-county"],
};

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, enum: ["Uganda", "Rwanda"], required: true },
  level: { type: Number, required: true, min: 0, max: 2 },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Location", default: null },
});

locationSchema.index({ country: 1, level: 1, parent: 1 });

export default mongoose.model("Location", locationSchema);
