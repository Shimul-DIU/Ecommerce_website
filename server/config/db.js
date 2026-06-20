import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://localhost:27017/ecommerceDB"
    );

    console.log("Database Connected Successfully");

  } catch (error) {
    console.log("DB Connection Error:", error.message);
    process.exit(1);
  }
};

export { connectDB };