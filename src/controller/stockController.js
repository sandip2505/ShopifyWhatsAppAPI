const configuration = require("../schema/configurationSchema.js");
const stockController = {};

stockController.getConfiguration = async (req, res) => {
  try {
    const shopName = req.params.shop;
    let getConfiguration = await configuration.findOne({ shopName }, {
      stockStatus: 1,
      locationName: 1,
      locationAddress: 1,
      availableQuantity: 1,
      shopName: 1,
    });
    if (!getConfiguration) {
      getConfiguration = await configuration.create({ shopName });
    }
    res.status(200).json({ configuration: getConfiguration });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


stockController.addConfigurations = async (req, res) => {
  try {
    const data = {
      stockStatus: req.body.stockStatus,
      locationName: req.body.locationName,
      locationAddress: req.body.locationAddress,
      availableQuantity: req.body.availableQuantity,
      shopName: req.body.shopName,
    };
    console.log(req, "gettt")
    const hasData = await configuration.countDocuments({
      shopName: data.shopName,
    });
    if (hasData) {
      await configuration.findOneAndUpdate({ shopName: data.shopName }, data);
      return res.status(200).json({ message: "Configurations updated" });
    }
    await configuration.create(data);
    res.status(200).json({ message: "Configurations added to stock" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

stockController.configurationFields = async (req, res) => {
  const shopName = req.params.shop;
  try {
    let configurationFields = await configuration.findOne({ shopName }, {
      headerText: 1,
      inStockText: 1,
      lowStockText: 1,
      outOfStockText: 1,
      availableText: 1,
      unavailableText: 1,
      locationText: 1,
      addressText: 1,
      quantityText: 1,
      stockStatusText: 1,
      popupbtnText: 1,
    });

    if (!configurationFields) {
      configurationFields = await configuration.create({ shopName });
    }

    res.status(200).json({ configurationFields });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

stockController.addConfigurationsFields = async (req, res) => {
  try {
    const data = {
      headerText: req.body.headerText,
      inStockText: req.body.inStockText,
      lowStockText: req.body.lowStockText,
      outOfStockText: req.body.outOfStockText,
      availableText: req.body.availableText,
      unavailableText: req.body.unavailableText,
      locationText: req.body.locationText,
      addressText: req.body.addressText,
      quantityText: req.body.quantityText,
      popupbtnText: req.body.popupbtnText,
    };
    await configuration.create(data);
    res.status(200).json({ message: "Configurations fields added to stock" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

stockController.updateConfigurationsFields = async (req, res) => {
  const shopName = req.params.shop;
  try {
    const data = {
      headerText: req.body.inputValues.headerText,
      inStockText: req.body.inputValues.inStockText,
      lowStockText: req.body.inputValues.lowStockText,
      outOfStockText: req.body.inputValues.outOfStockText,
      availableText: req.body.inputValues.availableText,
      unavailableText: req.body.inputValues.unavailableText,
      locationText: req.body.inputValues.locationText,
      addressText: req.body.inputValues.addressText,
      quantityText: req.body.inputValues.quantityText,
      stockStatusText: req.body.inputValues.stockStatusText,
      popupbtnText: req.body.inputValues.popupbtnText,
    };

    const existingConfig = await configuration.findOne({ shopName });

    if (existingConfig) {
      await configuration.findOneAndUpdate({ shopName }, data);
      res.status(200).json({ message: "Configurations fields updated" });
    } else {
      await configuration.create({ shopName, ...data });
      res.status(201).json({ message: "New configuration created" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



stockController.configurationColor = async (req, res) => {
  const shopName = req.params.shop;
  try {
    const configurationColor = await configuration.findOne({ shopName }, {
      inStockTextColor: 1,
      inStockDotColor: 1,
      lowStockTextColor: 1,
      lowStockDotColor: 1,
      outOfStockTextColor: 1,
      outOfStockDotColor: 1,
      availableTextColor: 1,
      availableDotColor: 1,
      unavailableTextColor: 1,
      unavailableDotColor: 1,
      locationNameTextColor: 1,
      addressTextColor: 1,
      quantityTextColor: 1,
      stockStatusText: 1,
      stockStatusTextBold: 1,
      locationNameTextBold: 1,
      addressTextBold: 1,
      quantityTextBold: 1,
      popupbtnBackgroundColor: 1,
      popupbtnTextColor: 1,
      headerIconColor: 1,
      hideHeaderIcons: 1,
      locations: 1,

    });

    // const configurationFields = await configuration.findOne({ shopName }, {

    // })
    res.status(200).json({ configurationColor });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

stockController.addConfigurationsColor = async (req, res) => {

  console.log("addConfigurationsColor", req.body)
  const shopName = req.params.shop;
  try {
    const data = {
      inStockTextColor: req.body.inStockTextColor,
      inStockDotColor: req.body.inStockDotColor,
      lowStockTextColor: req.body.lowStockTextColor,
      lowStockDotColor: req.body.lowStockDotColor,
      outOfStockTextColor: req.body.outOfStockTextColor,
      outOfStockDotColor: req.body.outOfStockDotColor,
      availableTextColor: req.body.availableTextColor,
      availableDotColor: req.body.availableDotColor,
      unavailableTextColor: req.body.unavailableTextColor,
      unavailableDotColor: req.body.unavailableDotColor,
      locationNameTextColor: req.body.locationNameTextColor,
      addressTextColor: req.body.addressTextColor,
      quantityTextColor: req.body.quantityTextColor,
      stockStatusTextBold: req.body.stockStatusTextBold,
      locationNameTextBold: req.body.locationNameTextBold,
      addressTextBold: req.body.addressTextBold,
      quantityTextBold: req.body.quantityTextBold,
      popupbtnBackgroundColor: req.body.popupbtnBackgroundColor,
      popupbtnTextColor: req.body.popupbtnTextColor,
      headerIconColor: req.body.headerIconColor,
      hideHeaderIcons: req.body.hideHeaderIcons,
      locations: req.body.locations,

    };


    const existingConfig = await configuration.findOne({ shopName });

    if (existingConfig) {
      await configuration.findOneAndUpdate({ shopName }, data);
      res.status(200).json({ message: "Configurations Colors updated" });
    } else {
      await configuration.create({ shopName, ...data });
      res.status(201).json({ message: "New configuration Colors created" });
    }

    // await configuration.findOneAndUpdate({
    //   shopName: shopName
    // }, data);
    // res.status(200).json({ message: "Configurations fields updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = stockController;
