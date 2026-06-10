export async function getFavorites(req, res, next) {
  try {
    await req.user.populate("favorites");
    res.json({ favorites: req.user.favorites });
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const artworkId = req.params.artworkId;
    const exists = req.user.favorites.some((favorite) => favorite.toString() === artworkId);

    req.user.favorites = exists
      ? req.user.favorites.filter((favorite) => favorite.toString() !== artworkId)
      : [...req.user.favorites, artworkId];

    await req.user.save();
    await req.user.populate("favorites");

    res.json({
      isFavorite: !exists,
      favorites: req.user.favorites
    });
  } catch (error) {
    next(error);
  }
}
