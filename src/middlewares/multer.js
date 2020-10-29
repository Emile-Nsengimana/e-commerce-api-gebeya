import multer from "multer";

const storage = multer.memoryStorage();
const multerUpload = multer({ storage }).single("image");

export { multerUpload };
