import mongoose from "mongoose";

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("MONGO_URI must be configured in production.");
      }

      console.log(
        "No MONGO_URI provided. Starting MongoMemoryServer for development...",
      );

      const { MongoMemoryServer } = await import("mongodb-memory-server");

      mongoServer = await MongoMemoryServer.create();

      mongoUri = mongoServer.getUri();

      console.log(`MongoMemoryServer started dynamically at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);

    throw error;
  }
};

export default connectDB;
