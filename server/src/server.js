import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

// Keep track of connection state to avoid connecting on every request
let isConnected = false;

// Middleware to ensure DB connection before handling requests in Serverless
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error("Database connection failed:", error.message);
      return res.status(500).json({ 
        message: "Database connection failed. Please check your MONGO_URI environment variable and ensure MongoDB Atlas Network Access allows connections from anywhere (0.0.0.0/0)." 
      });
    }
  }
  next();
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
