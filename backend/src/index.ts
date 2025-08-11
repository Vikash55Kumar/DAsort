import dotenv from "dotenv";
import { app } from "./app";
import { connectDB } from "./db/index";

// Type declaration for BigInt JSON serialization
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Add BigInt serialization support
BigInt.prototype.toJSON = function() {
    return this.toString();
};

dotenv.config();

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;

    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });

    // Error handling for server-level errors
    app.on("error", (error) => {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    });
  })
  .catch((error) => {
      console.error('❌ Database connection failed:', error.message);
  });