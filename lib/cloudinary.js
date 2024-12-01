import { v2 as cloudinary } from "cloudinary";
import environment from "../SecureCode.js";

cloudinary.config({
    cloud_name: environment.cloudinary.cloud_name,
    api_key: environment.cloudinary.api_key,
    api_secret: environment.cloudinary.api_secret,
});

export default cloudinary;
