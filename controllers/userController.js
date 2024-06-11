// Import modułów z modelam.
const User = require('../models/user');

// Import funkcji obsługi wyjątków/błedów wywołań asynchronicznych.
const asyncHandler = require("express-async-handler");

// Import funkcji walidatora.
const { body, validationResult } = require("express-validator");

// Import modułów do szyfrowania i autentykacji
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
//local storage

// Kontroler listy userów.
exports.user_list = asyncHandler(async (req, res, next) => {
  const all_users = await User.find({}).exec();
  res.render("user_list", { title: "List of all users:", user_list: all_users });
});

// Kontroler wyświetlania formularza dodawania nowego usera - GET.
exports.user_add_get = (req, res, next) => {
  res.render("user_form", { title: "Add users" });
};

// Kontroler obsługi danych formularza dodawania nowego usera - POST.
exports.user_add_post = [
  // Walidacja i sanityzacja danych z formularza.
  body("first_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name too short."),

  // Własny middleware w kontrolerze - test
  // (req, res, next) => {console.log('Z kontrolera user..'); 
  // next()},	

  body("last_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Last name name too short."),

  body("username", "Username must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .isAlpha()
    .withMessage("Username must be alphabet letters."),

  body("password", "Password to short!")
    .isLength({ min: 8 }),

  asyncHandler(async (req, res, next) => {

    // Pozyskanie z request obiektu błędu i jego ewentualna obsługa.
    const errors = validationResult(req);

    //zaszyfrowanie hasła - asynchroniczne, hash zwraca obiekt promise, stąd await
    const passwordHash = await bcrypt.hash(req.body.password, 10)

    console.log(passwordHash)
    // Tworzenie obiektu User po 'oczyszczeniu' danych. 
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: passwordHash,
    });

    if (!errors.isEmpty()) {
      // Jeśli pojawiły się błędy - ponownie wyrenderuj formularz i wypełnij pola 
      // wprowadzonymi danymi po sanityzacji.
      res.render("user_form", {
        title: "Add user:",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Dane z formularza są poprawne.
      // Należy jeszcze sprawdzić czy w bazie istnieje już użytkownik
      // o tym samym username.
      const userExists = await User.findOne({ username: req.body.username })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (userExists) {
        // Błąd - użytkownik już istnieje w bazie, przekierowanie na stronę błędu.
        // res.redirect("/users");
        res.send("User exists");
      } else {
        await user.save();
        // Nowy użytkownik dodany - przekieruj wywołanie na listę userów.
        res.redirect("/users");
      }
    }
  }),
];


// Kontroler wyświetlania formularza logowania - GET.
exports.user_login_get = (req, res, next) => {
  res.render("user_login_form", { title: "Login" });
};

// Kontroler obsługi danych formularza logowania - POST.
exports.user_login_post = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Znajdź użytkownika po nazwie użytkownika
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    // Porównaj hasła
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send('Invalid username or password');
    }

    console.log('Generating token for user:', user._id);

    // Generuj token z użytkownikiem _id i username
    const token = jwt.sign({ _id: user._id.toString(), username: user.username }, 'kodSzyfrujacy', { expiresIn: '1h' });

    // Ustaw token jako ciasteczko
    res.cookie('mytoken', token, { httpOnly: true });

    // Przekieruj do strony głównej lub dowolnej strony
    res.redirect('/images');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

// Kontroler wylogowania - GET.
exports.user_logout_get = (req, res, next) => {
 // wyczyść token
  res.clearCookie('mytoken', {
    sameSite: 'strict',
    httpOnly: true,
    signed: false
  });

  res.redirect('/');
};
