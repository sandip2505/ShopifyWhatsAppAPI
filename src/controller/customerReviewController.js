const customerReview = {};

const Review = require('../schema/customerReviewSchema');
const StoreReview = require('../schema/storeReviews');
const RatingConfig = require("../schema/ratingConfig");
const StoreReviewSetting = require("../schema/storeReviewSetting");
const ReviewSettings = require("../schema/ReviewSettings");


customerReview.addReview = async (req, res) => {
  const {
    name,
    email,
    mobile,
    rating,
    reviewText,
    recommend,
    productId,
    productTitle,
    isActive,
    storeName
  } = req.body;
  console.log(storeName, "storeName")
  try {
    if (!name || !email || !rating || !reviewText || !productId || !productTitle) {
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
      productTitle,
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
      { $match: filter },
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


customerReview.addRatingConfig = async (req, res) => {
  try {
    const { storeName } = req.body;

    if (!storeName || typeof storeName !== 'string' || storeName.trim() === '') {
      return res.status(400).json({ success: false, message: "storeName is required and must be a non-empty string." });
    }

    const existing = await RatingConfig.findOne({ storeName: storeName.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Configuration for this shop already exists." });
    }
    const config = new RatingConfig(req.body);
    await config.save();

    res.status(201).json({ success: true, data: config });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.storeName) {
      return res.status(409).json({ success: false, message: "Shop name must be unique. This one already exists." });
    }

    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};


customerReview.getRatingConfig = async (req, res) => {
  try {
    const config = await RatingConfig.findOne({ storeName: req.params.storeName });
    if (!config) {
      return res.status(404).json({ success: false, message: "Config not found" });
    }
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


customerReview.updateRatingConfig = async (req, res) => {
  console.log("called");
  try {
    const config = await RatingConfig.findOneAndUpdate(
      { storeName: req.params.storeName },
      req.body,
      { new: true, runValidators: true }
    );

    if (!config) {
      return res.status(404).json({ success: false, message: "Config not found" });
    }

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



customerReview.deleteRatingConfig = async (req, res) => {
  try {
    const config = await RatingConfig.findByIdAndDelete(req.params.storeName);
    if (!config) {
      return res.status(404).json({ success: false, message: "Config not found" });
    }
    res.status(200).json({ success: true, message: "Config deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

customerReview.addStoreReviewSetting = async (req, res) => {
  try {
    const { storeName } = req.body;

    if (!storeName || typeof storeName !== 'string' || storeName.trim() === '') {
      return res.status(400).json({ success: false, message: "storeName is required and must be a non-empty string." });
    }

    const existing = await StoreReviewSetting.findOne({ storeName: storeName.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Store review setting for this shop already exists." });
    }

    const setting = new StoreReviewSetting(req.body);
    await setting.save();

    res.status(201).json({ success: true, data: setting });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.storeName) {
      return res.status(409).json({ success: false, message: "Shop name must be unique. This one already exists." });
    }

    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
}
customerReview.getStoreReviewSetting = async (req, res) => {
  try {
    console.log(req.params.storeName, "storeName in getStoreReviewSetting");
    const setting = await StoreReviewSetting.findOne({ storeName: req.params.storeName });
    if (!setting) {
      return res.status(404).json({ success: false, message: "Store review setting not found" });
    }
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

customerReview.updateStoreReviewSetting = async (req, res) => {
  console.log(req.body.data, "body in updateStoreReviewSetting");
  try {
    const setting = await StoreReviewSetting.findOneAndUpdate(
      { storeName: req.params.storeName },
      req.body,
      { new: true, runValidators: true }
    );
    console.log(setting, "setting in updateStoreReviewSetting");
    if (!setting) {
      return res.status(404).json({ success: false, message: "Store review setting not found" });
    }

    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
}
customerReview.deleteStoreReviewSetting = async (req, res) => {
  try {
    const setting = await StoreReviewSetting.findByIdAndDelete(req.params.storeName);
    if (!setting) {
      return res.status(404).json({ success: false, message: "Store review setting not found" });
    }
    res.status(200).json({ success: true, message: "Store review setting deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

customerReview.addReviewSettings = async (req, res) => {
  try {
    const { storeName } = req.body;

    if (!storeName || typeof storeName !== 'string' || storeName.trim() === '') {
      return res.status(400).json({ success: false, message: "storeName is required and must be a non-empty string." });
    }

    const existing = await ReviewSettings.findOne({ storeName: storeName.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Review settings for this shop already exists." });
    }

    const settings = new ReviewSettings(req.body);
    await settings.save();

    res.status(201).json({ success: true, data: settings });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.storeName) {
      return res.status(409).json({ success: false, message: "Shop name must be unique. This one already exists." });
    }

    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
}
customerReview.getReviewSettings = async (req, res) => {
  try {
    const settings = await ReviewSettings.findOne({ storeName: req.params.storeName });
    if (!settings) {
      return res.status(404).json({ success: false, message: "Review settings not found" });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
customerReview.updateReviewSettings = async (req, res) => {
  try {
    const settings = await ReviewSettings.findOneAndUpdate(
      { storeName: req.params.storeName },
      req.body,
      { new: true, runValidators: true }
    );
    if (!settings) {  
      return res.status(404).json({ success: false, message: "Review settings not found" });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
customerReview.deleteReviewSettings = async (req, res) => { 
  try {
    const settings = await ReviewSettings.findByIdAndDelete(req.params.storeName);
    if (!settings) {
      return res.status(404).json({ success: false, message: "Review settings not found" });
    }
    res.status(200).json({ success: true, message: "Review settings deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}







module.exports = customerReview;

