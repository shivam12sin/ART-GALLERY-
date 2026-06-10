import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
