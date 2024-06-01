// Import modułów z modelami.
const Gallery = require("../models/gallery");
const User = require("../models/user");


// Import funkcji obsługi wyjątków/błedów wywołań asynchronicznych.
const asyncHandler = require("express-async-handler");

// Import funkcji walidatora.
const { body, validationResult } = require("express-validator");

// Kontroler listy galerii.
exports.gallery_list = asyncHandler(async (req, res, next) => {
  const all_galleries = await Gallery.find({}).populate("user").exec();
  res.render("gallery_list", { title: "List of all galleries:", gallery_list: all_galleries });
});


// Kontroler formularza dodawania nowej galerii - GET.
exports.gallery_add_get = asyncHandler(async (req, res, next) => {

  // opcje formularza - inny dla admina inny dla zwykłego usera
  let opcje;
  // lista wszystkich userów
  let all_users;

  if (req.user.username === "admin") {
    // dane do formularza admina
    all_users = await User.find().sort({ last_name: 1 }).exec();
    opcje = { "admin_user": true, "disabled": false }
  } else {
    // dane do formularza usera zwykłego
    let owner_user = await User.findOne({ "username": req.user.username }).exec();
    console.log(owner_user)
    opcje = { "admin_user": false, "disabled": true, "owner_user": owner_user }
    console.log(opcje)
  }
  // rendering formularza
  res.render("gallery_form", {
    title: "Add gallery",
    users: all_users,
    opcje: opcje,
  })
});

// --------------------------------------------------
// Kontroler obsługi danych formularza dodawania nowej galerii - POST.
exports.gallery_add_post = [
  // Walidacja i sanityzacja danych z formularza.
  body("g_name", "Gallery name too short.")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  body("g_description")
    .trim()
    .escape(),

  body("g_user", "Username must be selected.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Przetwarzanie po walidacji.
  asyncHandler(async (req, res, next) => {
    // Przechwyt obiektu błędów walidacji.
    const errors = validationResult(req);

    // Utworzenie obiektu modelu Gallery z danymi z formularza.
    const gallery = new Gallery({
      name: req.body.g_name,
      description: req.body.g_description,
      user: req.body.g_user,
      updated: new Date(),
    });

    // Sprawdzenie i obsługa ewentualnych błędów.
    if (!errors.isEmpty()) {
      // Jeśli pojawiły się błędy - ponownie wyrenderuj formularz i wypełnij pola wprowadzonymi danymi po sanityzacji.

      // opcje formularza - inny dla admina inny dla zwykłego usera
      let opcje;
      // lista wszystkich userów
      let all_users;

      if (req.user.username === "admin") {
        // dane do formularza admina
        all_users = await User.find().sort({ last_name: 1 }).exec();
        opcje = { "admin_user": true, "disabled": false }
      } else {
        // dane do formularza usera zwykłego
        let owner_user = await User.findOne({ "username": req.user.username }).exec();
        console.log(owner_user)
        opcje = { "admin_user": false, "disabled": true, "owner_user": owner_user }
        console.log(opcje)
      }

      // rendering formularza
      res.render("gallery_form", {
        title: "Add gallery:",
        gallery: gallery,
        users: all_users,
        opcje: opcje,
        errors: errors.array(),
      });
      return;
    } else {
      // Dane z formularza są poprawne.
      // Należy jeszcze sprawdzić czy w bazie istnieje galeria
      // o tej samej nazwie dla użytkownika.
      const galleryExists = await Gallery.findOne({
        name: req.body.g_name,
        user: req.body.g_user,
      })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (galleryExists) {
        // Błąd - nazwa galerii dla wybranego użytkownika już istnieje, 
        // przekierowanie na stronę błędu.
        // res.redirect("/users");
        res.send("Gallery exists");
      } else {
        await gallery.save();
        // Nowa galeria dodana - przekierowanie na stronę lista galerii.
        res.redirect("/galleries");
      }
    }
  }),
];
