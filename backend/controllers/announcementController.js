import asyncHandler from "../middlewares/asyncHandler.js";
import Announcement from "../models/announcementModel.js";

const getAnnouncements = asyncHandler(async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const createAnnouncement = asyncHandler(async (req, res) => {
  try {
    const { text, isActive } = req.body;
    const announcement = new Announcement({ text, isActive: isActive !== undefined ? isActive : true });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid data" });
  }
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  try {
    const { text, isActive } = req.body;
    const announcement = await Announcement.findById(req.params.id);
    
    if (announcement) {
      announcement.text = text !== undefined ? text : announcement.text;
      announcement.isActive = isActive !== undefined ? isActive : announcement.isActive;
      
      const updatedAnnouncement = await announcement.save();
      res.json(updatedAnnouncement);
    } else {
      res.status(404).json({ error: "Announcement not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid data" });
  }
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (announcement) {
      await Announcement.deleteOne({ _id: announcement._id });
      res.json({ message: "Announcement removed" });
    } else {
      res.status(404).json({ error: "Announcement not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
