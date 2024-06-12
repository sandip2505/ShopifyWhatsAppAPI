

const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const whatsappController = require('../controller/whatsappController');
const apiKey = process.env.API_KEY;

const checkApiKey = (req, res, next) => {
    const apiKeyHeader = req.headers["x-api-key"];
    if (!apiKeyHeader || apiKeyHeader !== apiKey) {
        res.status(403).json({ Error: "Forbidden" });
    } else {
        next();
    }
};

router.get('/shopifyUser',  userController.getShopifyUser);
router.post('/shopifyUser', userController.postShopifyUser);


router.get('/mobile',  whatsappController.getCountrycode);
router.post('/whatsApp',  whatsappController.postWhatsAppData);
router.get('/whatsApp',  whatsappController.getWhatsAppData);
router.get('/whatsAppData',  whatsappController.whatsAppData);
router.get('/editWhatsApp/:id',  whatsappController.getWhatsAppDataById);
router.put('/updateWhatsApp/:id',  whatsappController.updateWhatsApp);
router.delete('/deleteWhatsApp/:id',  whatsappController.deleteWhatsApp);

// header routes

// router.post('/header',  whatsappController.postHeaderData);
// router.get('/header',  whatsappController.getHeaderData);
// router.get('/header/:id',  whatsappController.getHeaderDatanById);
// router.put('/header/:id',  whatsappController.updateHeaderData);
// router.delete('/header/:id',  whatsappController.deleteHeaderData);

module.exports = router;
