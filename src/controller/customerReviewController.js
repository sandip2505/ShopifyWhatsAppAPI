const customerReview = {};

const Review = require('../schema/customerReviewSchema');
const StoreReview = require('../schema/storeReviews');


customerReview.addReview = async (req, res) => {
  const {
    name,
    email,
    mobile,
    rating,
    reviewText,
    recommend,
    productId,
    isActive,
    storeName
  } = req.body;
  console.log(storeName, "storeName")
  try {
    if (!name || !email || !rating || !reviewText || !productId) {
      return res.status(400).json({
        message: "Missing required fields."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (mobile) {
      const mobileRegex = /^\d{10,15}$/; // Adjust regex based on your requirements
      if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number format." });
      }
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }



    const newReview = new Review({
      name,
      email,
      mobile,
      rating,
      storeName,
      reviewText,
      recommend: recommend || false,
      productId,
      isActive,
      createdAt: new Date()
    });

    const savedReview = await newReview.save();

    return res.status(201).json({
      message: "Review added successfully.",
      review: savedReview
    });
  } catch (error) {
    console.error("Error saving review:", error);
    return res.status(500).json({ message: "Error saving review.", error: error.message });
  }
};

// customerReview.getAllReview = async (req, res) => {
//   const { email, status, name, rating, productId } = req.query;

//   try {
//     let filter = {};

//     if (email) filter.email = email;
//     if (status) filter.isActive = status;
//     if (name) filter.name = new RegExp(name, "i"); 
//     if (rating) filter.rating = Number(rating);
//     if (productId) filter.productId = productId;

//     const reviews = await Review.find(filter);

//     return res.status(200).json({
//       message: "Reviews fetched successfully.",
//       reviews,
//     });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return res.status(500).json({ message: "Error fetching reviews.", error: error.message });
//   }
// };

customerReview.getAllReview = async (req, res) => {
  const { email, name, rating, productId, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;
  const storeName = req.params.storeName;
  console.log(storeName)
  let status = req.query.status ? req.query.status : null;

  if (status === 'true') {
    status = true;
  } else if (status === 'false') {
    status = false;
  }
  try {
    // Create a filter object based on provided query parameters
    let filter = {};
    if (storeName) {
      filter.storeName = storeName;
    }
    if (email) filter.email = email;
    if (typeof status === 'boolean') filter.isActive = status;
    if (name) filter.name = new RegExp(name, "i"); // Case-insensitive name search
    if (rating) filter.rating = Number(rating);
    if (productId) filter.productId = productId;

    // Convert pagination values to numbers
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Sorting logic
    const sortOrder = order === "asc" ? 1 : -1;

    // Fetch filtered, paginated, and sorted reviews
    const reviews = await Review.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize);

    // Count total reviews (for pagination info)
    const totalReviews = await Review.countDocuments(filter);

    // Calculate average rating for the filtered reviews
    const ratingStats = await Review.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);
    // Extract average rating or default to 0 if no reviews
    const averageRating = ratingStats.length > 0 ? parseFloat(ratingStats[0].averageRating.toFixed(1)) : 0;

    return res.status(200).json({
      message: "Reviews fetched successfully.",
      reviews,
      totalReviews,
      averageRating,
      totalPages: Math.ceil(totalReviews / pageSize),
      currentPage: pageNumber,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error fetching reviews.", error: error.message });
  }
};



customerReview.getReviewbyProduct = async (req, res) => {
  const { productId, storeName } = req.params;
  console.log(productId, storeName)
  try {
    if (!productId || !storeName) {
      return res.status(400).json({ message: "Product ID and storeName are required." });
    }

    const reviews = await Review.find({ storeName: storeName, productId: productId, isActive: true });

    // Calculate average rating for this product
    let averageRating = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    return res.status(200).json({
      message: "Reviews fetched successfully.",
      reviews,
      totalReviews: reviews.length,
      averageRating: parseFloat(averageRating.toFixed(1))
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error fetching reviews.", error: error.message });
  }
}
customerReview.deleteReview = async (req, res) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ message: "Review ID is required." });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    await review.remove();

    return res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Error deleting review.", error: error.message });
  }

}

customerReview.getAllActiveReview = async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true });

    let totalRating = 0;

    if (reviews.length > 0) {
      totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    }

    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return res.status(200).json({
      message: "Reviews fetched successfully.",
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1))
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error fetching reviews.", error: error.message });
  }
}

customerReview.updateReview = async (req, res) => {
  const id = req.params.id;
  const {
    isActive,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Review ID is required." });
    }

    const review = await Review.findById(id);

    if (isActive !== undefined) {
      review.isActive = isActive;
    }

    await review.save();

    return res.status(200).json({ message: "Review updated successfully.", review });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ message: "Error updating review.", error: error.message });
  }
}

customerReview.storeReview = async (req, res) => {
  console.log("Received Body:", req.body);
  console.log("Uploaded Files:", req.files);
  try {
    const { name, email, reviewTitle, rating, reviewMessage, storeName } = req.body;

    if (!name || !email || !reviewTitle || !rating || !reviewMessage || !storeName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }

    // Store only image paths
    console.log("Uploaded files:", req.files); // Debugging

    const reviewImages = req.files
      ? [...new Set(req.files.map(file => file.originalname))]
      : [];


    const newReview = new StoreReview({
      name,
      email,
      reviewTitle,
      rating,
      reviewMessage,
      reviewImages,
      storeName,
    });

    const savedReview = await newReview.save();

    return res.status(201).json({
      message: "Review added successfully.",
      review: savedReview
    });
  } catch (error) {
    console.error("Error saving review:", error);
    return res.status(500).json({ message: "Error saving review.", error: error.message });
  }
};

customerReview.getStoreReview = async (req, res) => {
  try {
    const isActive = req.query.active ? true : false;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;
    const storeName = req.params.storeName;
    const filter = { storeName }; // Assuming 'storeName' is a field in the document
    if (isActive) {
      filter.isActive = isActive;
    }

    // Fetch paginated reviews

    const reviews = await StoreReview.find(filter)
      .skip(skip)
      .limit(limit);
    // Count total reviews
    const totalReviewsCount = await StoreReview.countDocuments(filter);

    // Calculate average rating
    const ratingStats = await StoreReview.aggregate([
      { $match:  filter  },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);

    console.log(ratingStats)
    const averageRating = ratingStats.length > 0 ? parseFloat(ratingStats[0].averageRating.toFixed(1)) : 0;

    return res.status(200).json({
      message: "Reviews fetched successfully.",
      reviews,
      averageRating,
      totalReviews: totalReviewsCount,
      currentPage: page,
      totalPages: Math.ceil(totalReviewsCount / limit),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error fetching reviews.", error: error.message });
  }
};


customerReview.updateStoreReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update the review
    const updatedReview = await StoreReview.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    return res.status(200).json({
      message: "Review updated successfully.",
      updatedReview
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ message: "Error updating review.", error: error.message });
  }
};

customerReview.deleteStoreReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the review
    const deletedReview = await StoreReview.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    return res.status(200).json({
      message: "Review deleted successfully.",
      deletedReview
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Error deleting review.", error: error.message });
  }
}





module.exports = customerReview;

