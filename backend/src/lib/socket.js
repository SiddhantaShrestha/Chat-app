import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app); // socket must wrap raw http not express

//io name is just a convention
const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket coneections
io.use(socketAuthMiddleware);

// to check if user is online or not
export function getReceiverSocketIds(userId) {
  // return userSocketMap[userId];
  return userSocketMap.get(userId); //return all sockets for that user
}

//for storing online users
// const userSocketMap = {}; // {userId: socketId}
const userSocketMap = new Map(); // Map<userId, Set<socketId>>
// so in this case if a user opens 3 diff tabs
// userSocketMap = {
//   "user123" => Set(["socketA", "socketB", "socketC"])
// }

io.on("connection", (socket) => {
  console.log("User connected", socket.user.fullName);

  const userId = socket.userId;
  //commented this below line as from this approach, one user can only have 1 active socket connection, multiple tab issue
  // userSocketMap[userId] = socket.id; // key will be userId, value will be socketId

  const sockets = userSocketMap.get(userId) ?? new Set();
  sockets.add(socket.id);
  userSocketMap.set(userId, sockets);
  //io.emit() is used to send events to all connected clients
  // io.emit("getOnlineUsers", Object.keys(userSocketMap)); // take all the keys and send it back to the client
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  //for typing
  socket.on("userTyping", ({ receiverId }) => {
    const receiverSocketIds = getReceiverSocketIds(receiverId);
    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("userTyping", {
          userId: userId,
          isTyping: true,
        });
      });
    }
  });

  socket.on("userStoppedTyping", ({ receiverId }) => {
    const receiverSocketIds = getReceiverSocketIds(receiverId);
    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("userTyping", {
          userId: userId,
          isTyping: false,
        });
      });
    }
  });

  //listen for the connections
  //with socket on, we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    // delete userSocketMap[userId];
    // io.emit("getOnlineUsers", Object.keys(userSocketMap)); // pass the new updated list
    const sockets = userSocketMap.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) userSocketMap.delete(userId);
    }
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };
