const IceMajestyConfig = require("../schema/iceMajestyConfigSchema.js");

const iceMajestyController = {};

iceMajestyController.addConfig = async (req, res) => {
  try {
    const file = req.file && req.file.filename;
    const data = {
      shop: req.body.shopName,
      animationType: req.body.animationType,
      customImage: file || null,
      imageSize: req.body.imageSize && Number(req.body.imageSize),
      animationColor: req.body.animationColor,
      animationSpeed: req.body.animationSpeed && Number(req.body.animationSpeed),
      numberOfEffects: req.body.numberOfEffects && Number(req.body.numberOfEffects),
    };
    const isShop = await IceMajestyConfig.countDocuments({ shop: data.shop });

    if (isShop) {
      await IceMajestyConfig.updateOne({ shop: data.shop }, data);
    } else {
      await IceMajestyConfig.create(data);
    }
    res.status(200).json({ message: "Data added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

iceMajestyController.showConfig = async (req, res) => {
  try {
    const params = req.params.shop;
    const data = await IceMajestyConfig.findOne({ shop: params }).lean();

    const baseURL = process.env.BASEURL;
    const uploadsPath = "/uploads/";
    let fullIconURL = `${baseURL}${uploadsPath}${data.customImage || ""}`;

    res.status(200).json({
      data: {
        ...data,
        ...(data.customImage ? { customImage: fullIconURL } : {}),
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

module.exports = iceMajestyController;
