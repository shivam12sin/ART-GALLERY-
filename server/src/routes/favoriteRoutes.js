import express from "express";
import { getFavorites, toggleFavorite } from "../controllers/favoriteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getFavorites);
router.patch("/:artworkId", protect, toggleFavorite);

export default router;
