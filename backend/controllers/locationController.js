import Location, { LOCATION_LEVELS } from "../models/locationModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const listLocations = asyncHandler(async (req, res) => {
  try {
    const { country, level, parent } = req.query;
    const filter = {};
    if (country) filter.country = country;
    if (level !== undefined) filter.level = Number(level);
    filter.parent = parent ? parent : null;

    const locations = await Location.find(filter).sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const createLocation = asyncHandler(async (req, res) => {
  try {
    const { name, country, level, parent } = req.body;

    if (!name) return res.json({ error: "Name is required" });
    if (!LOCATION_LEVELS[country]) return res.json({ error: "Invalid country" });
    if (level === undefined || level < 0 || level > 2) {
      return res.json({ error: "Invalid level" });
    }
    if (level > 0 && !parent) {
      return res.json({ error: `A parent ${LOCATION_LEVELS[country][level - 1]} is required` });
    }

    const location = await new Location({
      name,
      country,
      level,
      parent: level === 0 ? null : parent,
    }).save();
    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const updateLocation = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.json({ error: "Name is required" });

    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });

    location.name = name;
    const updated = await location.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeLocation = asyncHandler(async (req, res) => {
  try {
    const hasChildren = await Location.exists({ parent: req.params.id });
    if (hasChildren) {
      return res.json({ error: "Delete its child locations first" });
    }

    const removed = await Location.findByIdAndDelete(req.params.id);
    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { listLocations, createLocation, updateLocation, removeLocation };
