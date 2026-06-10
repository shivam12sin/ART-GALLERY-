import Artwork from "../models/Artwork.js";
import Order from "../models/Order.js";

export async function createOrder(req, res, next) {
  try {
    const { artworkIds, shippingAddress } = req.body;

    if (!Array.isArray(artworkIds) || artworkIds.length === 0) {
      return res.status(400).json({ message: "Select at least one artwork to order." });
    }

    const artworks = await Artwork.find({ _id: { $in: artworkIds }, isAvailable: true });

    if (artworks.length !== artworkIds.length) {
      return res.status(400).json({ message: "One or more artworks are unavailable." });
    }

    const items = artworks.map((artwork) => ({
      artwork: artwork._id,
      title: artwork.title,
      imageUrl: artwork.imageUrl,
      price: artwork.price
    }));
    const total = items.reduce((sum, item) => sum + item.price, 0);

    // This demo project treats an artwork as unique, so a successful order
    // marks each purchased artwork as unavailable.
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      shippingAddress
    });

    await Artwork.updateMany({ _id: { $in: artworkIds } }, { isAvailable: false });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find().sort("-createdAt").populate("user", "name email");
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
}
