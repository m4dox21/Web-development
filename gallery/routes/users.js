var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

router.get("/", user_controller.user_list);
// Obsługa GET: http://localhost/users/user_add
router.get("/user_add", user_controller.user_add_get);
// Obsługa POST: http://localhost/users/user_add
router.post("/user_add", user_controller.user_add_post);

//USER LOGIN GET (/users/user_login)
router.get("/user_login", user_controller.user_login_get);
//USER LOGIN POST(/users/user_login)
router.post("/user_login", user_controller.user_login_post);
//USER LOGOUT GET (/users/user_logout)
router.get("/user_logout", user_controller.user_logout_get);


module.exports = router;
