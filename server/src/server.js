import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

// Connect to MongoDB
connectDB().catch((error) => {
  console.error("Failed to connect to database:", error.message);
});

// For Vercel, we export the app instance rather than listening to a port.
// Vercel will handle the networking. 
// If running locally, listen on the port.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
