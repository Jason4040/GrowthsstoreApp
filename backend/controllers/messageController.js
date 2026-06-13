import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { text, fileUrl, fileType, recipientId } = req.body;
    const senderId = req.user._id;

    let targetRecipientId = recipientId;

    // If the sender is not an admin, the recipient must be the admin
    if (!req.user.isAdmin) {
      const admin = await User.findOne({ isAdmin: true });
      if (!admin) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      targetRecipientId = admin._id;
    }

    if (!targetRecipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    const message = new Message({
      sender: senderId,
      recipient: targetRecipientId,
      text: text || "",
      fileUrl: fileUrl || "",
      fileType: fileType || "",
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get chat messages between user and admin
// @route   GET /api/messages
// @route   GET /api/messages/:userId (Admin only)
// @access  Private
const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    let targetUserId;

    if (req.user.isAdmin && req.params.userId) {
      targetUserId = req.params.userId;
    } else {
      // For clients, they talk to the admin
      const admin = await User.findOne({ isAdmin: true });
      if (!admin) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      targetUserId = admin._id;
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: targetUserId },
        { sender: targetUserId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all users who have active chats with admin
// @route   GET /api/messages/chats/users
// @access  Private/Admin
const getChatUsers = async (req, res) => {
  try {
    const adminId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: adminId }, { recipient: adminId }],
    });

    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.sender.toString() !== adminId.toString()) {
        userIds.add(msg.sender.toString());
      }
      if (msg.recipient.toString() !== adminId.toString()) {
        userIds.add(msg.recipient.toString());
      }
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select(
      "username email"
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { sendMessage, getMessages, getChatUsers };
