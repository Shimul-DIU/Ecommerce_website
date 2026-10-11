import Wishlist from "../model/wishlist.model.js";

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user._id }).populate("products");
    const items = wl ? wl.products.filter(Boolean) : [];
    res.json({ items, ids: items.map((p) => String(p._id)) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// POST /api/wishlist/toggle   body: { productId }
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId required" });

    let wl = await Wishlist.findOne({ user: req.user._id });
    if (!wl) wl = new Wishlist({ user: req.user._id, products: [] });

    const exists = wl.products.some((p) => String(p) === String(productId));
    if (exists) {
      wl.products = wl.products.filter((p) => String(p) !== String(productId));
    } else {
      wl.products.push(productId);
    }
    await wl.save();

    res.json({ added: !exists, ids: wl.products.map(String) });
  } catch (error) {
    res.status(500).json({ message: "Failed to update wishlist" });
  }
};

// POST /api/wishlist/merge   body: { ids: [] }  (login-এর সময় localStorage মেলানোর জন্য)
export const mergeWishlist = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const wl = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: { $each: ids } } },
      { upsert: true, new: true }
    );
    res.json({ ids: wl.products.map(String) });
  } catch (error) {
    res.status(500).json({ message: "Failed to merge wishlist" });
  }
};