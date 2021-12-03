//external imports
const express = require("express");

//internal imports
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { doLoginValidators, doLoginValidationHandler } = Require(
    "../middlewares/login/loginValidators.js"
);
const { redirectLoggedIn } = require("../middlewares/common/checkLogin");

const router = express.Router(); // Router create korlam ..

//set page title
const page_title = "Login";

// Login related router thakbe ..

// login page
router.get("/", decorateHtmlResponse(page_title), redirectLoggedIn, getLogin);

// logout
router.delete("/", logout);

// process login
router.post(
    "/",
    decorateHtmlResponse(page_title),
    doLoginValidators,
    doLoginValidationHandler,
    login
); // ei login er age amra bivinno middleware add korbo ..
// shudhu matro login function bole deowar pore .. ekhon amake validator gula banaite hobe ..
// middleware folder er moddhe age user namok folder er moddhe userValidator niye kaj korsilam
// ekhon login nam e ekta folder create kore .. tar moddhe loginValidator file e kaj korbo ..

// ekhono kintu amader ekta kaj baki ase .. sheta hocche amra ei je response ta dicchi .. processLogin .. sheta kintu ultimately
// kono JSON response dibe na .. kono API response na .. eta kintu front-end e ekta html template load korbe taina .. !
// so je dhoroner page e ashole html template load korbe front-end e .. shetar e kintu ei decorateHtmlResponse middleware ta
// proyojon hobe .. karon ekhane e amra muloto title and onnano jinish pati set korechilam.. mane response local gula set korechilam
// jegula amra template e variable hishebe use korsi .. so .. tahole shei decorateHtmlResponse amake ekhaneo dite hobe ..
// karon ei page ta to ultimately amader login page ta kei render korbe ..

module.exports = router;
