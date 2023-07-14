import multer from "multer";
import path from "path";

const tempDir = path.join(__dirname, "../", "temp");
const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage: multerConfig });
