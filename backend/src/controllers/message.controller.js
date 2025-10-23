import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }, // get every user except the logged in user
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getting contacts", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    // me and you

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId }, // i send you
        { senderId: userToChatId, receiverId: myId }, // you send me
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getting all messages");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "You cannot send a message to yourself" });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver not found" });
    }
    let imageUrl;
    if (image) {
      //upload base64 image to cloudinary
      const uploadImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //todo: send message in real time if user is online - socket

    res.status(201).json(newMessage);
  } catch (error) {}
};

export const getChatPartners = async (req, res) => {
  // get all the users related to us and then extract the users
  try {
    const loggedInUserId = req.user._id;

    // find all messages of logged in user
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set( //used set to remove duplicates
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error getting chat partners", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
