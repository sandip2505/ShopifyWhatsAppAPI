
const apicontroller = {};
const User = require('../schema/userSchema');
const WhatsApp = require('../schema/whatsappSchema');
const Header = require('../schema/headerSchema');
const validation = require('../helper/validation');


apicontroller.getCountrycode = async (req, res) => {
  try {
    const mobileNumber = req.query.mobile_number;
    console.log(mobileNumber, "mobileNumber");

    // Check if mobileNumber is not empty
    if (!mobileNumber) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    // Parse the phone number
    const phoneNumber = PhoneNumber.parse(mobileNumber, 'US'); // 'ZZ' allows parsing with any country code
    console.log("::::phone number::::", phoneNumber)

    // Check if the phone number is valid
    if (!phoneNumber || !PhoneNumber.isValidNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Extract the country code
    // const countryCode = PhoneNumber.getCountryCodeForRegion(phoneNumber.country);

    // Send the country code in the response
    res.json({ country_code: phoneNumber.country });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

apicontroller.postWhatsAppData = async (req, res) => {
  try {
    const {
      mobile_number,
      position,
      preFilledValue,
      selectedIcon,
      popUpMessage,
      enabled,
      shopName
    } = req.body;

    const validationResults = await validation.performBlankValidations({
      mobile_number,
      position,
      preFilledValue,
      popUpMessage,
      shopName
    });

    if (!validationResults.success) {
      console.log(validationResults.message);
      return res.status(400).json({ message: validationResults.message });
    }


    const existingShop = await WhatsApp.findOne({ shopName });

    if (existingShop) {

      await WhatsApp.findOneAndUpdate(
        { _id: existingShop._id },
        {
          mobile_number,
          position,
          prefield_message: preFilledValue,
          icon: selectedIcon,
          popup_message: popUpMessage,
          status: enabled
        }
      );

      const updatedData = await WhatsApp.findOne({ _id: existingShop._id });
      return res.status(200).json({ message: 'WhatsApp data updated successfully', userdata: updatedData });
    } else {
      const existingMobile = await WhatsApp.findOne({ mobile_number, deletedAt: null });
      if (existingMobile) {
        return res.status(404).json({ message: 'Mobile number already exists' });
      }
      const newWhatsApp = new WhatsApp({
        mobile_number,
        position,
        prefield_message: preFilledValue,
        icon: selectedIcon,
        popup_message: popUpMessage,
        status: enabled,
        shopName
      });

      const addedData = await newWhatsApp.save();
      return res.status(201).json({ message: 'WhatsApp data saved successfully', userdata: addedData });
    }
  } catch (error) {
    console.error('Error in postWhatsAppData:', error);
    return res.status(500).json({ message: error.message });
  }
};

apicontroller.getWhatsAppData = async (req, res) => {
  try {
    const shopName = req.query.shopName || null;
    console.log(await WhatsApp.find({ deletedAt: null }))
    const whatsAppData = await WhatsApp.findOne({ deletedAt: null, shopName: shopName });

    if (!whatsAppData) {
      return res.status(200).json({ message: 'WhatsApp data not found' });
    }

    // Define the base URL and uploads path
    const baseURL = process.env.BASEURL;
    const uploadsPath = '/uploads/';

    // Modify the data to include the full URL for the icon
    const iconFileName = whatsAppData.icon.replace('icon_', '') + '.png';
    const fullIconURL = `${baseURL}${uploadsPath}${iconFileName}`;
    const modifiedData = {
      ...whatsAppData.toObject(),
      icon: fullIconURL
    };

    res.status(200).json({ whatsAppData: modifiedData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

apicontroller.whatsAppData = async (req, res) => {
  try {

    const whatsAppData = await WhatsApp.find({ deletedAt: null  });

    // Define the base URL and uploads path
    const baseURL = process.env.BASEURL;
    const uploadsPath = '/uploads/';

    // Map over the data to include the full URL for the icon
    const modifiedData = whatsAppData.map(item => {
      const iconFileName = item.icon.replace('icon_', '') + '.png';
      const fullIconURL = `${baseURL}${uploadsPath}${iconFileName}`;
      return {
        ...item.toObject(),
        icon: fullIconURL
      };
    });

    res.status(200).json({ whatsAppData: modifiedData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// apicontroller.getWhatsAppDataById = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const whatsAppData = await WhatsApp.findOne({ _id: id, deletedAt: null });
//     if (!whatsAppData) {
//       return res.status(404).json({ message: 'WhatsApp data not found' });
//     }
//     res.status(200).json({ whatsAppData });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

apicontroller.getWhatsAppDataById = async (req, res) => {
  try {
    const id = req.params.id;
    const whatsAppData = await WhatsApp.findOne({ _id: id, deletedAt: null });
    if (!whatsAppData) {
      return res.status(404).json({ message: 'WhatsApp data not found' });
    }

    // Define the base URL and uploads path
    const baseURL = process.env.BASEURL;
    const uploadsPath = '/uploads/';

    // Construct the full URL for the icon
    const iconFileName = whatsAppData.icon.replace('icon_', '') + '.png';
    const fullIconURL = `${baseURL}${uploadsPath}${iconFileName}`;

    // Add the full URL to the response
    const response = {
      ...whatsAppData.toObject(),
      icon: fullIconURL,
    };

    res.status(200).json({ whatsAppData: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


apicontroller.updateWhatsApp = async (req, res) => {
  try {

    const id = req.params.id;
    const { mobile_number, position, preFilledValue, selectedIcon, popUpMessage, enabled } = req.body;
    const validationResults = await validation.performBlankValidations({ mobile_number, position, preFilledValue, selectedIcon, popUpMessage });
    const existingMobile = await WhatsApp.findOne({ mobile_number: mobile_number, _id: { $ne: id }, deletedAt: null });

    if (!validationResults.success) {
      return res.status(400).json({ message: validationResults.message });
    }
    if (existingMobile) {
      return res.status(404).json({ message: 'Mobile number already exists' });
    }
    const updateWhatsApp = await WhatsApp.findOneAndUpdate({ _id: id }, { mobile_number, position, prefield_message: preFilledValue, icon: selectedIcon, popup_message: popUpMessage, status: enabled });
    const updatedData = await WhatsApp.findOne({ _id: updateWhatsApp._id });
    console.log(updatedData, "updatedData")
    res.status(201).json({ message: 'WhatsApp data updated successfully', userdata: updatedData });
  } catch (error) {
    console.log(error)
  }
}

apicontroller.deleteWhatsApp = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteWhatsApp = await WhatsApp.findOneAndUpdate({ _id: id }, { deletedAt: Date.now() });
    res.status(201).json({ message: 'WhatsApp data deleted successfully' });
  } catch (error) {
    console.log(error)
  }
}


apicontroller.postHeaderData = async (req, res) => {
  try {
    const { title, header, body, storename } = req.body;

    // const validationResults = await validation.performBlankValidations({ title, header, body });
    // if (!validationResults.success) {
    //   return res.status(400).json({ message: validationResults.message });
    // }

    const newHeader = new Header({ title, header, body, storename });
    await newHeader.save();
    res.status(201).json({ message: 'Header data saved successfully', headerdata: newHeader });
  } catch (error) {
    console.log(error)
  }
}

apicontroller.getHeaderData = async (req, res) => {
  try {
    const storename = req.query.storename ? req.query.storename : null;
    const headerData = await Header.find({ deletedAt: null, storename: storename });
    console.log(headerData, "headerData");
    res.status(200).json(headerData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

apicontroller.getHeaderDatanById = async (req, res) => {
  try {
    const id = req.params.id;
    const header = await Header.findOne({ _id: id, deletedAt: null });
    res.status(200).json({ header });
  } catch (error) {
    console.log(error)
  }
}

apicontroller.updateHeaderData = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, header, body } = req.body;
    // const validationResults = await validation.performBlankValidations({ title, header, body });
    // if (!validationResults.success) {
    //   return res.status(400).json({ message: validationResults.message });
    // }
    const updateHeader = await Header.findOneAndUpdate({ _id: id }, { title, header, body });
    const updatedData = await Header.findOne({ _id: updateHeader._id });
    res.status(201).json({ message: 'Header data updated successfully', headerdata: updatedData });
  } catch (error) {
    console.log(error)
  }
}

apicontroller.deleteHeaderData = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteHeader = await Header.findOneAndUpdate({ _id: id }, { deletedAt: Date.now() });
    res.status(201).json({ message: 'Header data deleted successfully' });
  } catch (error) {
    console.log(error)
  }
}


module.exports = apicontroller;
