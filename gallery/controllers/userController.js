const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Import modułów do szyfrowania i autentykacji
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.user_list = asyncHandler(async (req, res, next) => {
  const all_users = await User.find({}).exec();
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
  body("password", "Password must be at least 6 characters")
    .trim()
    .isLength({ min: 6 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("user_form", {
        title: "Add user:",
        user: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // Haszowanie hasła

      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword, // Dodanie zahashowanego hasła do bazy danych
      });

      const userExists = await User.findOne({ username: req.body.username })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (userExists) {
        res.send("User exists");
      } else {
        await newUser.save();
        res.render("registration_success", { username: req.body.username }); // Dodanie komunikatu o pomyślnej rejestracji
      }
    }
  }),
];



// Kontroler wyświetlania formularza logowania - GET.
exports.user_login_get = (req, res, next) => {
  res.render("user_login_form", { title: "Login" });
  };

// Kontroler obsługi danych formularza logowania - POST.
exports.user_login_post = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  
  User.findOne({ username })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err
            });
          }
          if (result) {
            // console.log(user.username)
            let token = jwt.sign({ username: user.username }, 'kodSzyfrujacy', { expiresIn: '1h' });
            res.cookie('mytoken', token, { maxAge: 600000 });
            //res.render('index', { title: 'Express', logged_user: username});
            res.render('index', { title: 'Express' });
          } else {
            res.json({
              message: 'Złe hasło'
            });
          }
        });
      } else {
        res.json({
          message: 'No user found!'
        });
      }
    });
};

// Kontroler wyświetlania formularza wylogowania - GET.
exports.user_logout_get = (req, res, next) => {
  res.clearCookie('mytoken', {
    sameSite: 'strict',
    httpOnly: true,
    signed: false
  });
  res.redirect('/');
};

