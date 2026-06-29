import mongoose from "mongoose";
import { env } from "./env.js";

async function connectDB() {
    try {
        mongoose.connect(env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed");
        console.error(err.message);
        process.exit(1);
    }
}

export default connectDB;