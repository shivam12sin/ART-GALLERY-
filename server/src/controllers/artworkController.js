import Artwork from "../models/Artwork.js";

export async function getArtworks(req, res, next) {
  try {
    const {
      search = "",
      category,
      medium,
      minPrice,
      maxPrice,
      sort = "-createdAt",
      featured
    } = req.query;

    const filters = {};

    // Build the MongoDB query from optional URL filters.
    // Example: /api/artworks?search=blue&category=Abstract&sort=price
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { artistName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (category) filters.category = category;
    if (medium) filters.medium = medium;
    if (featured === "true") filters.isFeatured = true;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const artworks = await Artwork.find(filters).sort(sort).populate("artist", "name avatarUrl");
    res.json({ artworks });
  } catch (error) {
    next(error);
  }
}

export async function getArtworkById(req, res, next) {
  try {
    const artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("artist", "name avatarUrl bio");

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found." });
    }

    res.json({ artwork });
  } catch (error) {
    next(error);
  }
}

export async function getMyArtworks(req, res, next) {
  try {
    const artworks = await Artwork.find({ artist: req.user._id }).sort("-createdAt");
    res.json({ artworks });
  } catch (error) {
    next(error);
  }
}

export async function createArtwork(req, res, next) {
  try {
    // The logged-in artist/admin becomes the owner of the artwork.
    const artwork = await Artwork.create({
      ...req.body,
      artist: req.user._id,
      artistName: req.body.artistName || req.user.name
    });

    res.status(201).json({ artwork });
  } catch (error) {
    next(error);
  }
}

export async function updateArtwork(req, res, next) {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found." });
    }

    const ownsArtwork = artwork.artist?.toString() === req.user._id.toString();
    if (!ownsArtwork && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can update only your own artworks." });
    }

    Object.assign(artwork, req.body);
    await artwork.save();
    res.json({ artwork });
  } catch (error) {
    next(error);
  }
}

export async function deleteArtwork(req, res, next) {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found." });
    }

    const ownsArtwork = artwork.artist?.toString() === req.user._id.toString();
    if (!ownsArtwork && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can delete only your own artworks." });
    }

    await artwork.deleteOne();
    res.json({ message: "Artwork deleted." });
  } catch (error) {
    next(error);
  }
}

export async function addReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found." });
    }

    // One review per user keeps ratings fair and easy to explain.
    const alreadyReviewed = artwork.reviews.some(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(409).json({ message: "You already reviewed this artwork." });
    }

    artwork.reviews.push({ user: req.user._id, rating, comment });
    await artwork.save();
    res.status(201).json({ artwork });
  } catch (error) {
    next(error);
  }
}

export async function getGalleryStats(req, res, next) {
  try {
    const [totalArtworks, availableArtworks, categories, artists] = await Promise.all([
      Artwork.countDocuments(),
      Artwork.countDocuments({ isAvailable: true }),
      Artwork.distinct("category"),
      Artwork.distinct("artistName")
    ]);

    res.json({
      totalArtworks,
      availableArtworks,
      totalCategories: categories.length,
      totalArtists: artists.length
    });
  } catch (error) {
    next(error);
  }
}
