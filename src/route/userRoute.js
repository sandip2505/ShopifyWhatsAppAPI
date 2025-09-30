const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../controller/userController");
const whatsappController = require("../controller/whatsappController");
const upsellController = require("../controller/upsellController");
const customerReviewController = require("../controller/customerReviewController");
const stockController = require("../controller/stockController");
const iceMajestyController = require("../controller/iceMajestyController");
const autoNotifyController = require("../controller/autoNotifyController");
const rateLimit = require("express-rate-limit");
const apiKey = process.env.API_KEY;

const routerIceMajesty = express.Router();
const routerAutoNotify = express.Router();
// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Store in uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original filename
  },
});

const upload = multer({ storage });

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const checkApiKey = (req, res, next) => {
  const apiKeyHeader = req.headers["x-api-key"];
  if (!apiKeyHeader || apiKeyHeader !== apiKey) {
    // res.render("forbidden"); // or you can use res.status(403).send("Forbidden");
    res.status(403).json({ Error: "Forbidden" });
  } else {
    next();
  }
};

router.get("/shopifyUser", userController.getShopifyUser);
router.post("/shopifyUser", userController.postShopifyUser);

router.get("/mobile", whatsappController.getCountrycode);

router.post(
  "/whatsApp",
  checkApiKey,
  apiLimiter,
  whatsappController.postWhatsAppData
);
router.get(
  "/whatsApp",
  checkApiKey,
  apiLimiter,
  whatsappController.getWhatsAppData
);

router.get("/whatsAppData", whatsappController.whatsAppData);
router.get(
  "/editWhatsApp/:id",
  checkApiKey,
  whatsappController.getWhatsAppDataById
);
router.put(
  "/updateWhatsApp/:id",
  checkApiKey,
  whatsappController.updateWhatsApp
);
router.delete(
  "/deleteWhatsApp/:id",
  checkApiKey,
  whatsappController.deleteWhatsApp
);
router.get("/version", whatsappController.version);

// header routes

router.post("/header", checkApiKey, whatsappController.postHeaderData);
router.get("/header", checkApiKey, whatsappController.getHeaderData);
router.get("/header/:id", checkApiKey, whatsappController.getHeaderDatanById);
router.put("/header/:id", checkApiKey, whatsappController.updateHeaderData);
router.delete("/header/:id", checkApiKey, whatsappController.deleteHeaderData);
router.get("/headers", checkApiKey, whatsappController.HeaderData);

// upsell routes

router.post("/addProduct", upsellController.addProduct);
router.post("/updateTitle", upsellController.updateTitle);
router.get("/getProducts", upsellController.getProducts);
router.post("/deleteProduct", upsellController.deleteProduct);
router.post("/deleteAllProducts", upsellController.deleteAllProducts);

// Customer Review routes
router.post("/addReview", customerReviewController.addReview);
router.get("/getallReview/:storeName", customerReviewController.getAllReview);
router.get(
  "/getReview/:storeName/:productId",
  customerReviewController.getReviewbyProduct
);
router.delete("/deleteReview/:id", customerReviewController.deleteReview);
router.get("/activeReview", customerReviewController.getAllActiveReview);
router.put("/updateReview/:id", customerReviewController.updateReview);
router.post(
  "/storeReview",
  upload.array("reviewImages", 5),
  customerReviewController.storeReview
);
router.get("/storeReview/:storeName", customerReviewController.getStoreReview);
router
  .route("/storeReview/:id")
  .put(customerReviewController.updateStoreReview)
  .delete(customerReviewController.deleteStoreReview);

// RatingConfig
router.post(
  "/ratingConfig",
  checkApiKey,
  customerReviewController.addRatingConfig
);
router.get(
  "/ratingConfig/:storeName",
  checkApiKey,
  customerReviewController.getRatingConfig
);
router.put(
  "/ratingConfig/:storeName",
  checkApiKey,
  customerReviewController.updateRatingConfig
);
router.delete(
  "/ratingConfig/:storeName",
  checkApiKey,
  customerReviewController.deleteRatingConfig
);

// StoreReviewSetting
router.post(
  "/storeReviewSetting",
  checkApiKey,
  customerReviewController.addStoreReviewSetting
);
router.get(
  "/storeReviewSetting/:storeName",
  checkApiKey,
  customerReviewController.getStoreReviewSetting
);
router.put(
  "/storeReviewSetting/:storeName",
  checkApiKey,
  customerReviewController.updateStoreReviewSetting
);
router.delete(
  "/storeReviewSetting/:storeName",
  checkApiKey,
  customerReviewController.deleteStoreReviewSetting
);

// ReaviewSettings
router.post("/reviewSettings", customerReviewController.addReviewSettings);
router.get(
  "/reviewSettings/:storeName",
  customerReviewController.getReviewSettings
);
router.put(
  "/reviewSettings/:storeName",
  customerReviewController.updateReviewSettings
);
router.delete(
  "/reviewSettings/:storeName",
  customerReviewController.deleteReviewSettings
);

// router.get("/getProducts",customerReviewController.getProducts);
// router.post("/deleteAllProducts", customerReviewController.deleteAllProducts);

// Stock Configuration routes

router.post("/configuration", stockController.addConfigurations);
router.get("/configuration/:shop", stockController.getConfiguration);
router.get("/configurationFields/:shop", stockController.configurationFields);
router.post(
  "/addConfigurationsFields/:shop",
  stockController.updateConfigurationsFields
);
router.get("/configurationColor/:shop", stockController.configurationColor);
router.post(
  "/addConfigurationsColor/:shop",
  stockController.addConfigurationsColor
);

routerIceMajesty.get("/showConfig/:shop", iceMajestyController.showConfig);
routerIceMajesty.post(
  "/addConfig",
  upload.single("customImage"),
  iceMajestyController.addConfig
);
router.use("/ice-majesty", routerIceMajesty);
router.get("/docs", (req, res) => {
  res.render("docs", { title: "Documentation" });
});

routerAutoNotify.post("/sendMail", checkApiKey, autoNotifyController.sendMail);
router.use("/auto-notify", routerAutoNotify);
module.exports = router;
