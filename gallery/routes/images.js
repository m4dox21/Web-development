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

// IMAGE SHOW GET
router.get("/:id", authenticate, image_controller.image_show_get);

// IMAGE UPDATE GET
router.get("/:id/update", authenticate, image_controller.image_update_get);

// IMAGE UPDATE POST
router.post("/:id/update", authenticate, image_controller.image_update_post);

// IMAGE DELETE POST
router.post("/:id/delete", authenticate, image_controller.image_delete_post);


module.exports = router;
