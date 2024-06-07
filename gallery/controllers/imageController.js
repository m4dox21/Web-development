const Image = require("../models/image");
const Gallery = require("../models/gallery");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');

// List images
exports.image_list = asyncHandler(async (req, res, next) => {
  const all_images = await Image.find({}).populate("gallery").exec();
  res.render("image_list", { title: "List of all images:", image_list: all_images });
});

// Show image details
exports.image_show_get = asyncHandler(async (req, res, next) => {
  const image = await Image.findById(req.params.id).exec();
  if (!image) { // No results.
    const err = new Error('Image not found');
    err.status = 404;
    return next(err);
  }
  res.render('image_detail', { title: 'Image Detail', image: image });
});

// Update image - GET
exports.image_update_get = asyncHandler(async (req, res, next) => {
  const image = await Image.findById(req.params.id).exec();
  if (!image) { // No results.
    const err = new Error('Image not found');
    err.status = 404;
    return next(err);
  }

  let galleries;
  if (req.user.username === 'admin') {
    galleries = await Gallery.find({}).exec();
  } else {
    galleries = await Gallery.find({ user: req.user._id }).exec();
  }

  res.render('image_update', { title: 'Update Image', image: image, galleries: galleries });
});

// Update image - POST
exports.image_update_post = [
  body('i_name').trim().isLength({ min: 2 }).escape().withMessage('Name too short.'),
  body('i_description').trim().isLength({ min: 5 }).escape().withMessage('Description too short.'),
  body('i_path').trim().isLength({ min: 3 }).escape().withMessage('Path too short.'),
  body('i_gallery').notEmpty().withMessage('Select a gallery'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const image = new Image({
      _id: req.params.id,
      name: req.body.i_name,
      description: req.body.i_description,
      path: req.body.i_path,
      gallery: req.body.i_gallery,
    });

    const gallery = await Gallery.findById(req.body.i_gallery).exec();

    if (!errors.isEmpty()) {
      let galleries;
      if (req.user.username === 'admin') {
        galleries = await Gallery.find({}).exec();
      } else {
        galleries = await Gallery.find({ user: req.user._id }).exec();
      }

      res.render('image_update', {
        title: 'Update Image',
        image,
        galleries,
        errors: errors.array()
      });
      return;
    } else {
      if (!gallery) {
        res.send('Gallery not found');
        return;
      }

      if (req.user.username !== 'admin') {
        if (!gallery.user || !req.user._id || gallery.user.toString() !== req.user._id.toString()) {
          res.send('Permission denied');
          return;
        }
      }

      await Image.findByIdAndUpdate(req.params.id, image, {});
      res.redirect('/images');
    }
  })
];

// Delete image - POST
exports.image_delete_post = asyncHandler(async (req, res, next) => {
  const image = await Image.findById(req.params.id).populate('gallery').exec();

  if (!image) {
    res.send('Image not found');
    return;
  }

  if (req.user.username !== 'admin' && (!image.gallery.user || image.gallery.user.toString() !== req.user._id.toString())) {
    res.send('Permission denied');
    return;
  }

  await Image.findByIdAndDelete(req.params.id);
  res.redirect('/images');
});

// IMAGE ADD GET
exports.image_add_get = asyncHandler(async (req, res, next) => {
  let galleries;
  if (req.user.username === 'admin') {
    galleries = await Gallery.find({}).exec();
  } else {
    galleries = await Gallery.find({ user: req.user._id }).exec();
  }

  res.render('image_form', { title: 'Add Image', galleries: galleries });
});

// IMAGE ADD POST
exports.image_add_post = [
  body('i_name', 'Image name too short.').trim().isLength({ min: 2 }).escape(),
  body('i_description').trim().escape(),
  body('i_path').trim().isLength({ min: 3 }).escape(),
  body('i_gallery', 'Gallery must be selected.').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const image = new Image({
      name: req.body.i_name,
      description: req.body.i_description,
      path: req.body.i_path,
      gallery: req.body.i_gallery,
    });

    const gallery = await Gallery.findById(req.body.i_gallery).exec();

    if (!errors.isEmpty()) {
      let galleries;
      if (req.user.username === 'admin') {
        galleries = await Gallery.find({}).exec();
      } else {
        galleries = await Gallery.find({ user: req.user._id }).exec();
      }

      res.render('image_form', {
        title: 'Add Image',
        galleries: galleries,
        image: image,
        errors: errors.array(),
      });
      return;
    } else {
      if (!gallery) {
        res.send('Gallery not found');
        return;
      }

      if (req.user.username !== 'admin') {
        if (!gallery.user || !req.user._id || gallery.user.toString() !== req.user._id.toString()) {
          res.send('Permission denied');
          return;
        }
      }

      await image.save();
      res.redirect('/images');
    }
  }),
];
