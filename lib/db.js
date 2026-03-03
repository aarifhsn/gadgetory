import mongoose from "mongoose";

let isConnected = false;

export async function dbConnect() {
  if (isConnected) {
    return;
  }
  try {
    const conn = await mongoose.connect(
      String(process.env.MONGODB_CONNECTION_STRING),
    );
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
