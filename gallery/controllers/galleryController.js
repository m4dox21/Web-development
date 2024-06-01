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
  // Renderowanie formularza
  res.render("gallery_form", {
    title: "Add gallery",
    users: all_users,
  });
});

// Obsługa dodawania nowej galerii (POST)
exports.gallery_add_post = [
  // Walidacja i sanityzacja danych z formularza
  body("g_name").trim().isLength({ min: 2 }).escape().withMessage("Gallery name too short."),
  body("g_description").trim().isLength({ min: 2 }).escape().withMessage("Gallery description too short."),

  // Przetwarzanie danych po walidacji i sanityzacji
  asyncHandler(async (req, res, next) => {
    // Pozyskanie z request obiektu błędu i jego ewentualna obsługa
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Jeśli pojawiły się błędy - ponownie wyrenderuj formularz z informacją o błędach
      const all_users = await User.find().sort({ last_name: 1 }).exec();
      res.render("gallery_form", {
        title: "Add gallery:",
        users: all_users,
        errors: errors.array(),
      });
      return;
    } else {
      // Dane z formularza są poprawne
      // Sprawdzenie, czy galeria o podanej nazwie już istnieje dla danego użytkownika
      const galleryExists = await Gallery.findOne({
        name: req.body.g_name,
        user: req.body.g_user,
      }).collation({ locale: "en", strength: 2 }).exec();

      if (galleryExists) {
        // Błąd - galeria o podanej nazwie już istnieje dla danego użytkownika
        res.send("Gallery with this name already exists for the selected user.");
      } else {
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
      }
    }
  }),
];
