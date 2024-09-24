

const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const whatsappController = require('../controller/whatsappController');
const rateLimit = require('express-rate-limit');
const apiKey = process.env.API_KEY;

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests from this IP, please try again after 15 minutes"
});

const checkApiKey = (req, res, next) => {
    const apiKeyHeader = req.headers["x-api-key"];
    if (!apiKeyHeader || apiKeyHeader !== apiKey) {
        res.status(403).json({ Error: "Forbidden" });
    } else {
        next();
    }
};

router.get('/shopifyUser', userController.getShopifyUser);
router.post('/shopifyUser', userController.postShopifyUser);


router.get('/mobile', whatsappController.getCountrycode);

router.post('/whatsApp', checkApiKey, apiLimiter, whatsappController.postWhatsAppData);
router.get('/whatsApp', checkApiKey, apiLimiter, whatsappController.getWhatsAppData);

router.get('/whatsAppData',  whatsappController.whatsAppData);
router.get('/editWhatsApp/:id', checkApiKey, whatsappController.getWhatsAppDataById);
router.put('/updateWhatsApp/:id', checkApiKey, whatsappController.updateWhatsApp);
router.delete('/deleteWhatsApp/:id', checkApiKey, whatsappController.deleteWhatsApp);
router.get('/version', whatsappController.version);


// header routes

router.post('/header', checkApiKey, whatsappController.postHeaderData);
router.get('/header', checkApiKey, whatsappController.getHeaderData);
router.get('/header/:id', checkApiKey, whatsappController.getHeaderDatanById);
router.put('/header/:id', checkApiKey, whatsappController.updateHeaderData);
router.delete('/header/:id', checkApiKey, whatsappController.deleteHeaderData);
router.get('/headers', checkApiKey, whatsappController.HeaderData);

module.exports = router;
