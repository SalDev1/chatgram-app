const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

const sendMessage = asyncHandler(async (req, res) => {
  // There are two things I will be sending to the databse.
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    // We want to populate everything from sender , chat , user.
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");

    // We are populating the user with new chat details.
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    // We will find the chat by id and update it with latest message.
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Fetching all of the messages in the selected chat.
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
