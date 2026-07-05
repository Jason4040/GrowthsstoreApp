import asyncHandler from "../middlewares/asyncHandler.js";
import Announcement from "../models/announcementModel.js";

const getAnnouncement = asyncHandler(async (req, res) => {
  try {
    let announcement = await Announcement.findOne();
    if (!announcement) {
      announcement = new Announcement({ text: "Welcome to our store!" });
      await announcement.save();
    }
    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  try {
    const { text, isActive } = req.body;
    let announcement = await Announcement.findOne();
    
    if (announcement) {
      announcement.text = text || announcement.text;
      if (isActive !== undefined) {
        announcement.isActive = isActive;
      }
      await announcement.save();
      res.json(announcement);
    } else {
      announcement = new Announcement({ text, isActive: isActive !== undefined ? isActive : true });
      await announcement.save();
      res.json(announcement);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid data" });
  }
});

export { getAnnouncement, updateAnnouncement };
