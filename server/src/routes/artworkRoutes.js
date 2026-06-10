import express from "express";
import {
  addReview,
  createArtwork,
  deleteArtwork,
  getArtworkById,
  getArtworks,
  getGalleryStats,
  getMyArtworks,
  updateArtwork
} from "../controllers/artworkController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getArtworks);
router.get("/stats", getGalleryStats);
router.get("/mine", protect, authorize("artist", "admin"), getMyArtworks);
router.get("/:id", getArtworkById);
router.post("/", protect, authorize("artist", "admin"), createArtwork);
router.put("/:id", protect, authorize("artist", "admin"), updateArtwork);
router.delete("/:id", protect, authorize("artist", "admin"), deleteArtwork);
router.post("/:id/reviews", protect, addReview);

export default router;
