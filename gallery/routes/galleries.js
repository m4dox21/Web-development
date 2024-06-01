var express = require('express');
var router = express.Router();
// Import funkcji middleware autentykacji
const authenticate = require('../middleware/authenticate');

const gallery_controller = require("../controllers/galleryController");

// GALLERIES GET (/galleries)
router.get("/", gallery_controller.gallery_list);

// GALLERY ADD GET (/galleries/gallery_add)
// dodanie middleware autentykacji do dodawania galerii
router.get("/gallery_add", authenticate, gallery_controller.gallery_add_get);

// GALLERY ADD POST (/galleries/gallery_add)
router.post("/gallery_add", authenticate, gallery_controller.gallery_add_post);

module.exports = router;
