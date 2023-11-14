import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("string", `${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("MONGODB connection failed", error);
    process.exit(1); //read about it
  }
};

export default connectDB;
