var express = require('express');
var router = express.Router();

// Middleware autentykacji
const authenticate = require('../middleware/authenticate');

const user_controller = require("../controllers/userController");

//USERS GET (/users)
router.get("/", user_controller.user_list);

//USER ADD GET (/users/user_add)
router.get("/user_add", user_controller.user_add_get);

//USER ADD POST (/users/user_add)
router.post("/user_add", user_controller.user_add_post);


//USER LOGIN GET (/users/user_login)
router.get("/user_login", user_controller.user_login_get);
//USER LOGIN POST(/users/user_login)
router.post("/user_login", user_controller.user_login_post);

//USER LOGOUT GET (/users/user_logout)
router.get("/user_logout", user_controller.user_logout_get);

module.exports = router;
