var express = require('express');
var router = express.Router();

const image_controller = require("../controllers/imageController");

const authenticate = require('../middleware/authenticate');

// IMAGES GET (/images)
router.get("/", image_controller.image_list);

//IMAGE ADD GET
router.get("/image_add", authenticate, image_controller.image_add_get);
//IMAGE ADD POST
router.post("/image_add", authenticate, image_controller.image_add_post);

module.exports = router;
