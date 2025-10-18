import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("MONGODB CONNECTED:", conn.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1); //1 is fail, 0 is success
  }
};
