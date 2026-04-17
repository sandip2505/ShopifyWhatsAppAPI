const upsellController = {};
const upsell = require('../schema/upsellProduct');

upsellController.addProduct = async (req, res) => {
  const {
    products,
    shop_name
  } = req.body; // Expecting all relevant fields

  console.log("shop_name:newww", shop_name);
  console.log("products--new:", products);
  console.log("req.body", req.body);

  // Validate input
  if (!shop_name) {
    return res.status(400).json({
      message: "Invalid input. shop_name is required.",
    });
  }


  try {
    // Find if there's already an entry for the given shop_name
    let existingShop = await upsell.findOne({ shop_name });

    if (existingShop) {
      existingShop.products = products.filter((product) => product).map((product) => ({
        productID: product.productID,
        variantIDs: product.variantIDs
      })); // Ensure no null values and store variantIDs

      await existingShop.save();
      return res.status(200).json({
        message: "Products successfully updated.",
        shop: existingShop,
      });
    } else {
      // If the shop does not exist, create a new entry
      const newShop = new upsell({
        products: products.length === 0
          ? []
          : products.filter((product) => product).map((product) => ({
            productID: product.productID,
            variantIDs: product.variantIDs
          })),
        shop_name
        // Only add products if autoRecommendUpsell is disabled
      });
      console.log(":newShop", newShop);
      const response = await newShop.save();
      return res.status(200).json({
        message: "Products successfully added.",
        shop: newShop,
      });
    }
  } catch (error) {
    console.error("Error saving products:", error);
    return res.status(500).json({ message: "Error saving products.", error });
  }
};
upsellController.upsertConfig = async (req, res) => {
  const {
    shop_name,
    autoRecommendUpsell,
    upsellLocation,
    customSelector,
    upsellLimit,
    title
  } = req.body; // Expecting all relevant fields
  console.log("shop_name:newww11", shop_name);
  console.log("req.body1111", req.body);
  if (!shop_name) {
    return res.status(400).json({
      message: "Invalid input. shop_name is required.",
    });
  }
  let existingShop = await upsell.findOne({ shop_name });
  if (existingShop) {
    existingShop.autoRecommendUpsell = autoRecommendUpsell;
    existingShop.upsellLocation = upsellLocation ? upsellLocation : upsellLocation == "undefined" ? "cart-drawer" : existingShop.upsellLocation;
    existingShop.customSelector = upsellLocation === "custom" ? customSelector || existingShop.customSelector : existingShop.customSelector; // Only set customSelector if upsellLocation is "custom"
    upsellLimit ? (existingShop.upsellLimit = upsellLimit) : null;
    existingShop.title = title || existingShop.title;

    await existingShop.save();
    return res.status(200).json({
      message: "Shop successfully updated.",
      shop: existingShop,
    });
  } else {
    // If the shop does not exist, create a new entry
    const newShop = new upsell({
      shop_name,
      autoRecommendUpsell,
      upsellLocation: upsellLocation || "cart-drawer", // Default location if not provided
      customSelector: upsellLocation === "custom" ? customSelector || "" : "", // Only set customSelector if upsellLocation is "custom"
      upsellLimit: upsellLimit || 5,
    });
    console.log(":newShop", newShop);
    const response = await newShop.save();
    return res.status(200).json({
      message: "Shop and products successfully added.",
      shop: newShop,
    });
  }
}

upsellController.updateTitle = async (req, res) => {
  try {
    const { shop_name, title } = req.body; // Extract the relevant fields from the request body
    console.log("req.body", req.body)

    // First, check if the shop already exists in the database
    const shop = await upsell.findOne({ shop_name: shop_name }); // Replace 'Shop' with your model's name

    if (shop) {
      // If the shop exists, update the title and buttonLabel
      shop.title = title;

      await shop.save(); // Save the updated shop
      return res
        .status(200)
        .json({ message: "Shop updated successfully", shop });
    } else {
      // If the shop doesn't exist, create a new one
      const newShop = new upsell({
        // Replace 'Shop' with your model's name
        shop_name: shop_name,
        title: title, l,
      });

      await newShop.save(); // Save the new shop to the database
      return res
        .status(201)
        .json({ message: "New shop added successfully", newShop });
    }
  } catch (error) {
    console.error("Error saving/updating shop:", error);
    return res
      .status(500)
      .json({ message: "Error saving/updating shop.", error });
  }
};

upsellController.getProducts = async (req, res) => {
  try {
    const shopname = req.query.shop_name;
    console.log("shopname", shopname);
    // Retrieve all products from the MongoDB collection
    const products = await upsell.findOne({ shop_name: shopname });
    console.log("products1111", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching added products:", error);
    res.status(500).json({ message: "Error fetching added products." });
  }
};

upsellController.deleteProduct = async (req, res) => {
  try {
    console.log("req.body11111", req.body);
    const result = await upsell.updateOne(
      { shop_name: req.body.shop_name, "products.productID": req.body.productId },
      {
        $pull: { "products.$.variantIDs": req.body.variantId },
      }
    );

    if (result.modifiedCount === 1) {
      console.log(`Variant ${req.body.variantId} deleted successfully.`);
    } else {
      console.log(`Variant ${req.body.variantId} not found or not deleted.`);
    }
    // console.log("products",products)
    res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({ message: "Error deleting variant." });
  }
};
upsellController.deleteAllProducts = async (req, res) => {
  try {
    const result = await upsell.updateOne(
      { shop_name: req.body.shop_name },
      {
        $set: { products: [] }, // Removes all products by setting the array to empty
      }
    );

    if (result.modifiedCount === 1) {
      console.log(`All products deleted successfully for shop: ${req.body.shop_name}.`);
      res.status(200).json({ status: true, message: "All products deleted successfully." });
    } else {
      console.log(`No products found for shop: ${req.body.shop_name}.`);
      res.status(404).json({ status: false, message: "No products found to delete." });
    }
  } catch (error) {
    console.error("Error deleting all products:", error);
    res.status(500).json({ status: false, message: "Error deleting all products." });
  }
};

module.exports = upsellController;