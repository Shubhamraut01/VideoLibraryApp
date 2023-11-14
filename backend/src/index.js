// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import cors from "cors";
import path from "path";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/connection.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

connectDB();

/*
(async () => {
  try {
    mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      //app.on to see if error is because of express app
      console.log("ERROR", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR:", error);
    throw err;
  }
})();


*/
