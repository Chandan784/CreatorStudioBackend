import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileUrl: String,
  fileType: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
