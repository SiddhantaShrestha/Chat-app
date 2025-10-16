import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDb } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // wil be under req.body (to get access to the fields the user sends)
// or else  const {fullName, email, password} = req.body this line will be undefined(the variables)

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  //serve index.html file for everything except api
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

//connecting to database before handling requests to avoid connection failures
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port: " + PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
