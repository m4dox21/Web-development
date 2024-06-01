const User = require("../models/user"); // Poprawiono import modelu

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.user_list = asyncHandler(async (req, res, next) => {
  const all_users = await User.find({}).exec(); // Poprawiono odwołanie do modelu User
  res.render("user_list", { title: "List of all users:", user_list: all_users });
});

exports.user_add_get = (req, res, next) => {
  res.render("user_form", { title: "Add users"});
};

exports.user_add_post = [
  body("first_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name too short."),
  body("last_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Last name too short."),
  body("username", "Username must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .isAlpha()
    .withMessage("Username must be alphabet letters."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newUser = new User({ // Poprawiono tworzenie nowego użytkownika
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
    });

    if (!errors.isEmpty()) {
      res.render("user_form", {
        title: "Add user:",
        user: newUser,
        errors: errors.array(),
      });
      return;
    } else {
      const userExists = await User.findOne({ username: req.body.username })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (userExists) {
        res.send("User exists");
      } else {
        await newUser.save();
        res.redirect("/users");
      }
    }
  }),
];
