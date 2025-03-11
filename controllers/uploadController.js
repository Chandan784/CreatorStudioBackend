import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import File from "../models/fileModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("file");

// Upload File Controller
export const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    const newFile = new File({
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
    });
    await newFile.save();

    res
      .status(201)
      .json({
        success: true,
        fileUrl: newFile.fileUrl,
        fileType: newFile.fileType,
      });
  });
};
