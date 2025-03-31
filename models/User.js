const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ["Agency", "Business", "Influencer", "Admin"], required: true },
    details: { type: mongoose.Schema.Types.ObjectId, refPath: "role" },

    // ✅ Password reset fields
    resetToken: { type: String, index: true },
    resetTokenExpires: { type: Date, expires: 0 }, // ✅ Auto-delete expired tokens
  },
  { timestamps: true } // ✅ Auto-manages createdAt & updatedAt
);

// ✅ Ensure `resetTokenExpires` field automatically removes expired tokens


module.exports = mongoose.model("User", userSchema);
