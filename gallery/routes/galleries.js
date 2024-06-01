var express = require('express');
var router = express.Router();

const gallery_controller = require("../controllers/galleryController");

// GET request for creating a Gallery. NOTE This must come before routes that display Gallery (uses id).
router.get('/gallery_add', gallery_controller.gallery_add_get);

// POST request for creating Gallery.
router.post('/gallery_add', gallery_controller.gallery_add_post);

// GET request to list all Galleries.
router.get("/", gallery_controller.gallery_list);

module.exports = router;
