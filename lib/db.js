import mongoose from "mongoose";
import environment from "../SecureCode.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(environment.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};