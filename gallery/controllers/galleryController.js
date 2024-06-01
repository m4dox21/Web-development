const Gallery = require("../models/gallery");
const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.gallery_list = asyncHandler(async (req, res, next) => {
  const all_galleries = await Gallery.find({}).populate("user").exec();
  res.render("gallery_list", { title: "List of all galleries:", gallery_list: all_galleries });
});

// Kontroler formularza dodawania nowej galerii (GET)
exports.gallery_add_get = asyncHandler(async (req, res, next) => {
  // Pobranie listy użytkowników z bazy danych
  const all_users = await User.find().sort({ last_name: 1 }).exec();
  // Sprawdzenie, czy użytkownik jest zalogowany
  if (!req.user) {
    // Użytkownik nie jest zalogowany, renderuj formularz dla użytkownika niezalogowanego
    res.render("gallery_form", {
      title: "Add gallery",
      users: all_users,
    });
  } else {
    // Użytkownik jest zalogowany
    // Sprawdzenie, czy użytkownik jest administratorem
    if (req.user.username === 'admin') {
      // Użytkownik jest administratorem, renderuj formularz dla administratora
      res.render("gallery_form", {
        title: "Add gallery",
        users: all_users,
      });
    } else {
      // Użytkownik nie jest administratorem, renderuj formularz dla zwykłego użytkownika
      res.render("gallery_form_user", {
        title: "Add gallery",
      });
    }
  }
});

// Obsługa dodawania nowej galerii (POST)
exports.gallery_add_post = [
  // Walidacja i sanityzacja danych z formularza
  body("g_name").trim().isLength({ min: 2 }).escape().withMessage("Gallery name too short."),
  body("g_description").trim().isLength({ min: 2 }).escape().withMessage("Gallery description too short."),

  // Autentykacja użytkownika
  asyncHandler(async (req, res, next) => {
    // Sprawdzenie, czy użytkownik jest zalogowany
    if (!req.user) {
      return res.send('Login first!');
    }

    // Dane z formularza są poprawne
    // Sprawdzenie, czy użytkownik jest administratorem
    if (req.user.username === 'admin') {
      // Użytkownik jest administratorem - sprawdź czy podano użytkownika galerii
      if (!req.body.g_user) {
        return res.send('Specify a user for the gallery.');
      }
    } else {
      // Użytkownik nie jest administratorem - przypisz galerię do jego konta
      req.body.g_user = req.user._id;
    }

    console.log("User ID:", req.body.g_user); // Dodany console.log

    // Sprawdzenie, czy galeria o podanej nazwie już istnieje dla danego użytkownika
    const galleryExists = await Gallery.findOne({
      name: req.body.g_name,
      user: req.body.g_user,
    }).collation({ locale: "en", strength: 2 }).exec();

    if (galleryExists) {
      // Błąd - galeria o podanej nazwie już istnieje dla danego użytkownika
      return res.send("Gallery with this name already exists for the selected user.");
    }

    // Tworzenie nowej galerii na podstawie danych z formularza
    const gallery = new Gallery({
      name: req.body.g_name,
      description: req.body.g_description,
      user: req.body.g_user,
    });
    
    // Zapisanie nowej galerii w bazie danych
    await gallery.save();
    // Przekierowanie na stronę z listą galerii
    res.redirect("/galleries");
  }),
];

// Obsługa dodawania nowej galerii (POST) dla zwykłego użytkownika
exports.gallery_add_post_user = asyncHandler(async (req, res, next) => {
  // Sprawdzenie, czy użytkownik jest zalogowany
  if (!req.user) {
    return res.send('Login first!');
  }

  // Dane z formularza są poprawne
  // Przypisz galerię do użytkownika
  req.body.g_user = req.user._id;

  // Sprawdzenie, czy galeria o podanej nazwie już istnieje dla danego użytkownika
  const galleryExists = await Gallery.findOne({
    name: req.body.g_name,
    user: req.body.g_user,
  }).collation({ locale: "en", strength: 2 }).exec();

  if (galleryExists) {
    // Błąd - galeria o podanej nazwie już istnieje dla danego użytkownika
    return res.send("Gallery with this name already exists for the selected user.");
  }

  // Tworzenie nowej galerii na podstawie danych z formularza
  const gallery = new Gallery({
    name: req.body.g_name,
    description: req.body.g_description,
    user: req.body.g_user,
  });
  
  // Zapisanie nowej galerii w bazie danych
  await gallery.save();
  // Przekierowanie na stronę z listą galerii
  res.redirect("/galleries");
});
