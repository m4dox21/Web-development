var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

router.get("/", user_controller.user_list);
// Obsługa GET: http://localhost/users/user_add
router.get("/user_add", user_controller.user_add_get);
// Obsługa POST: http://localhost/users/user_add
router.post("/user_add", user_controller.user_add_post);

module.exports = router;
