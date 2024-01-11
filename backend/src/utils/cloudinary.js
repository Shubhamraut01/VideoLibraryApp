import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: "dhg5lwnbq",
  api_key: 331514213394736,
  api_secret: "xveBwccCRUrheEwKY0qCh-qELnY",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("file is uploaded to cloudniry", response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file since oporation got failed
    return null;
  }
};

export { uploadOnCloudinary };
