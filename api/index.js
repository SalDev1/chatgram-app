const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const router = express.Router();
const path = require("path");
const chats = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

const { Server } = require("socket.io");
const User = require("./models/User");

// Helps to access all important information , PORT , MONGOURL.
// nodemon --> makes sure we don't restart the server again and again after making changes to the API Call.
// Use Postman to test your API Endpoint.
dotenv.config();
connectDB();

//middleware
// This allows the frontend data to be accepted as JSON.
app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("API is running successfully.");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//------------PRODUCTION DEPLOYMENT CODE --------------------

// __dirname1 --> signifies the current working directory.
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  // Establishing a path from current working directory to the build folder of the frontend.
  app.use(express.static(path.join(__dirname1, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
//------------PRODUCTION DEPLOYMENT CODE --------------------

app.use(notFound);
app.use(errorHandler);

// Dealing with PORT settings.
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});

// Socket IO Settings.
const socketIo = new Server(server, {
  // pingTimeout --> amount of time the server waits to receive a ping packet / message from client.
  // Otherwise , the server closes the connection with the client.
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// Creating a Socket connection + Set it up in the frontend.
socketIo.on("connection", (socket) => {
  console.log("Connected to socket.io", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);

    // console.log(userData._id);

    socket.emit("connected");
  });

  // When I click on any chat with my friends , a new room is created between me and my friend.
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room : " + room);
  });

  // Creating new socket for typing animation.
  // I show loading animation to other users , except me.

  socket.on("typing", (details) => {
    // console.log(details.selectedChat.users);
    // console.log(details.user._id);
    // socket.in(room).emit("typing");

    const users = details.selectedChat.users;
    const curr_user = details.user._id;

    // console.log(users);

    // I show loading animation to other users , except me.
    users.map((u) => {
      if (u._id === curr_user) return;

      socket.to(u._id).emit("typing");
    });
  });

  socket.on("stop typing", (details) => {
    // console.log(details.selectedChat.users);
    // console.log(details.user._id);
    // socket.in(room).emit("stop typing");

    const users = details.selectedChat.users;
    const curr_user = details.user._id;
    // console.log(users);

    // I stop loading animation of other users , except me.
    users.map((u) => {
      if (u._id === curr_user) return;

      socket.to(u._id).emit("stop typing");
    });

    // socket.in(room).in(user._id).emit("stop typing");
  });

  // Implementing real-time chatting.
  // What happens when we receiving a new chat.
  socket.on("new message", (newMessageReceived) => {
    // console.log(newMessageReceived);
    const chatInfo = newMessageReceived.chatData;
    const userInfo = newMessageReceived.userInfo;
    const selectedChat = newMessageReceived.selectedChat;

    // if (chat.sender == user._id) return;

    // socketIo.in(chat.chat).emit("messageResponse", newMessageReceived.chatData);

    console.log(newMessageReceived);
    // // console.log(details);

    if (!selectedChat.users) return console.log("chat.users not defined");
    selectedChat.users.forEach((user) => {
      // If the message is sent by me , then return it.
      if (user._id === chatInfo.sender) return;

      // Now , in the user's room , send that new message.
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
