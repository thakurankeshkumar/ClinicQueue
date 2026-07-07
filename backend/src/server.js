import app from "./app.js";
import { env } from "./config/env.js"
import connectDB from "./config/db.js";

const PORT = env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${env.NODE_ENV}`);
        })
    } catch (err) {
        console.error("Failed to start Server");
        console.error("Error:", err);
    }

}

startServer();