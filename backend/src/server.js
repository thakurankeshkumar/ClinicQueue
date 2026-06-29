import dotenv from 'dotenv';
import app from "./app.js";
import { env } from "./config/env.js"
import connectDB from "./config/db.js";

dotenv.config();
const PORT = env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        })
    } catch (err) {
        console.error("Failed to start Server");
        console.error("Error:", err);
    }

}

startServer();