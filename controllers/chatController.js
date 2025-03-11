import Chat from "../models/chatModel.js";

// Save Chat Message
export const sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;

  const newChat = new Chat({ sender, receiver, message });
  await newChat.save();

  res.status(201).json({ success: true, chat: newChat });
};

// Get Chat History
export const getMessages = async (req, res) => {
  const { sender, receiver } = req.query;

  const messages = await Chat.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({ success: true, messages });
};
