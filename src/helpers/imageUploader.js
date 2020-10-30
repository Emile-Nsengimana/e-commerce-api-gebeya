import path from "path";
import imageDataURI from "image-data-uri";
import { uploader } from "../middlewares/cloudinary";

const uploadImage = async (image) => {
  const dataBuffer = new Buffer.from(image.buffer);
  const mediaType = path.extname(image.originalname).toString();
  const imageData = imageDataURI.encode(dataBuffer, mediaType);

  // uploads image to cloudinary
  const uploadedImage = await uploader.upload(imageData);
  return uploadedImage.url;
};

export default uploadImage;
