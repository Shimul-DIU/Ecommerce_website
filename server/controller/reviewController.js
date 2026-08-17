import Product from "../model/products.js";
import Review from "../model/reviewModel.js";


export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Validation
    if (!productId || !rating || !comment?.trim()) {
      return res.status(400).json({
        message: "Product, rating and comment are required",
      });
    }

    // Check product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment: comment.trim(),
    });

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to submit review",
    });
  }
};



// =====================================================
// GET ALL REVIEWS FOR A PRODUCT
// GET /api/reviews/product/:productId
// =====================================================

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Get reviews
    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    console.error(
      "Get product reviews error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews",
      error: error.message,
    });
  }
};