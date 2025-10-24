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

//for storing online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("User connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id; // key will be userId, value will be socketId

  //io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // take all the keys and send it back to the client

  //listen for the connections
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // pass the new updated list
  });
});

export { io, app, server };
