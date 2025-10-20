import express from "express";
import {
  getAllContacts,
  getMessages,
  sendMessage,
  getChatPartners,
} from "../controllers/message.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

//the middlewares execute in order, so rate limiting is performed first, and only then authentication middleware is reached
//so unauthenticated requests get blocked by rate limit
router.use(arcjetProtection, protectedRoute);
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessages);
router.post("/send/:id", sendMessage);

export default router;
