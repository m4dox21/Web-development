var express = require('express');
var router = express.Router();

const gallery_controller = require("../controllers/galleryController");
// Middleware autentykacji
const authenticate = require('../middleware/authenticate')

// GET request for creating a Gallery. NOTE This must come before routes that display Gallery (uses id).
// GALLERY ADD GET (/galleries/gallery_add)
router.get("/gallery_add", authenticate, gallery_controller.gallery_add_get);

// POST request for creating Gallery.
// GALLERY ADD POST (/galleries/gallery_add)
router.post("/gallery_add", authenticate, gallery_controller.gallery_add_post)

// GET request to list all Galleries.
router.get("/", gallery_controller.gallery_list);



module.exports = router;
