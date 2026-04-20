import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.mongo_url;

    if (!uri) {
      throw new Error("MONGO_URL is not defined in .env");
    }

    await mongoose.connect(uri);
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
