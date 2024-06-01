var express = require('express');
var router = express.Router();

const image_controller = require("../controllers/imageController");

const authenticate = require('../middleware/authenticate');

// IMAGES GET (/images)
router.get("/", image_controller.image_list);

// IMAGES GET (/images) z AUTH
//router.get("/", authenticate, image_controller.image_list);

module.exports = router;
