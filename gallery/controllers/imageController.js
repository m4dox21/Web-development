const Image = require("../models/image");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');

exports.image_list = asyncHandler(async (req, res, next) => {
  const all_images = await Image.find({}).populate("gallery").exec();
  //res.render("image_list", { title: "List of all images:", image_list: all_images, logged_user: req.user.username });
  res.render("image_list", { title: "List of all images:", image_list: all_images});
  // res.send(all_images);
});


// Import modeli
const Gallery = require("../models/gallery");
const User = require("../models/user");

// IMAGE ADD GET

exports.image_add_get = asyncHandler(async (req, res, next) => {
  const all_galleries = await Gallery.find({}).populate("user").exec();
  res.render("image_form", { title: "add image:", galleries: all_galleries });
});

exports.image_add_post = [
  body('i_name').trim().isLength({ min: 2 }).escape().withMessage('Name too short.'),
  body('i_description').trim().isLength({ min: 5 }).escape().withMessage('Description too short.'),
  body('i_path').trim().isLength({ min: 3 }).escape().withMessage('Path too short.'),
  body('i_gallery').notEmpty().withMessage('Select a gallery'),

  asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const image = new Image({
          name: req.body.i_name,
          description: req.body.i_description,
          path: req.body.i_path,
          gallery: req.body.i_gallery,
          
      });

      if (!errors.isEmpty()) {
          const galleries = await Gallery.find().exec();
          res.render('image_form', {
              title: 'Add Image',
              image,
              galleries,
              errors: errors.array()
          });
          return;
      } else {
          await image.save();
          res.redirect('/images'); // Redirect to the list of images or any other page
      }
  })
];