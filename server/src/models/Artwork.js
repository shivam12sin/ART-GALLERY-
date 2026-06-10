import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 600
    }
  },
  { timestamps: true }
);

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    artistName: {
      type: String,
      required: true,
      trim: true
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    medium: {
      type: String,
      required: true,
      trim: true
    },
    dimensions: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

artworkSchema.virtual("averageRating").get(function getAverageRating() {
  if (!this.reviews.length) return 0;
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / this.reviews.length).toFixed(1));
});

artworkSchema.set("toJSON", { virtuals: true });
artworkSchema.set("toObject", { virtuals: true });

export default mongoose.model("Artwork", artworkSchema);
