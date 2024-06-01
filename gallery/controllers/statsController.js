const gallery = require("../models/gallery");
const user = require("../models/user");
const image = require("../models/image");

const asyncHandler = require("express-async-handler");

exports.stats_list = asyncHandler(async (req, res, next) => {
  const numUsers = await user.countDocuments({}).exec();
  const numGalleries = await gallery.countDocuments({}).exec();
  const numImages = await image.countDocuments({}).exec();
  res.render("stats_list", {
    title: "Stats:",
    n_users: numUsers,
    n_galleries: numGalleries,
    n_images: numImages
  });
  //response "gołym" tekstem
  //res.send(`Users: ${numUsers} <br>Galleries: ${numGalleries} <br>Images: ${numImages}<br>`);
});

