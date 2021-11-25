//external imports
const express = require("express");

//internal imports
const { getLogin } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");

const router = express.Router(); // Router create korlam ..

// Login related router thakbe ..

// login page
router.get("/", decorateHtmlResponse("Login"), getLogin);

module.exports = router;
