//external imports
const express = require("express");

//internal imports
const { getUsers, addUser } = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
    addUserValidators,
    addUserValidationHandler,
    removeUser,
} = require("../middlewares/users/userValidators");

const router = express.Router(); // Router create korlam ..

// User related router thakbe ..

//🔵User page
router.get("/", decorateHtmlResponse("Users"), getUsers);

/**
 * notun ekta route banate hobe .. shei route ta process korbe . sheta hobe
// router.post ..and shei URL e amra decorateHtmlResponse dibo na .. karon oita html response hobe na ..
// oita jokhon form theke request hobe .. tokhon shetake ashole server-end e process kore .. REST API hobe
// she response dibe ekta JSON.. so, amar front-end e ami ekta JSON pabo ..

// form e ekta photo upload korar bebostha ase .. User er photo handle korar jonno amake multer use korte hobe

    amader ekhane notun jei route ta hobe .. shei route ta prothom e .. shobar age multer er kase amake
    pathate hobe .. jeno request ashar pore .. shobar age multer module er kase jay .. ar amader jei form
    data ta ashbe .. sheta ke she req.files er moddhe she file gula dey .. ar onnano field gula thake ..
    shegula ke ami req.body akare pete pari .. so shobar age amader multer middleware er kase jete hobe 
*/

//🔵 add user

// /url e post method e form e request pathai .. tahole ekhan theke amra response pabo .. file upload hobe .. validation hobe
router.post(
    "/",
    avatarUpload,
    addUserValidators,
    addUserValidationHandler,
    addUser
); // first e file upload korbe .. tarpor validate korbe ..
/** 🟡 addUserValidator add korar pore ami jeta korbo .. ei je validation korlam .. ei validation e jodi kono error hoy
 *  shei error ta ke handle korbo -> addUserValidationHandler mane validation handler korlam arki
 *
 * 🟡 er por amra ekta controller likhe felte pari .. shei controller e amader kaj hocche jei data ta ashse .. sheta
 *  chokh bondho kore database e save kore fela ..and user ke response dite pari ..
 */
// tahole multer ki korbe ? amar request jokhon form theke ashbe .. ei avatarUpload er kache jabe .. she shob uploading
// er kaj karbar kore .. jodi error hoy .. tahole she porer middleware e jete dibe na .. ar jodi error na hoy .. tahole
// simply porer middleware e jete dibe .. ar porer middleware e amra muloto amader request er validation korbo ..

// ekhon proshno hocche ei validation ta keno amra multer er pore korchi .. er karon ta hocche simple .. amader je
// template ta .. template ta te amra dekhsi je .. amader form er data ta kintu multi part akare jabe .. ei multi part
// form data handle korar jonno multer amader ke use korte hocche .. ekhane multer kintu shudhu matro file upload er jonno
// use korsi na .. amra multer ke use korsi ashole .. form data er field gula ke neowar jonno .. sheta ke parse korte parbo
// ek matro multer dia ..

// so jar karone ami jodi validation ta age ditam .. tahole amar form field gula kintu porer bar eshe parse korte parto na
// tar mane amake validation ta ke multer er pore dite hobe .. tahole apnara mone korte paren je .. multer er jodi file
// upload kore feli .. tarpore jodi validation bertho hoy .. shamne jodi na agay .. tahole file ta to pore thakbe .. file
// ta to .. unnesseary upload hishebe thakbe .. hae thakbe .. sheita abar amra amader poroborti validation middleware e
// amra shei file ta ke delete kore dibo .. mane amader ager step e mane validation e jodi kono vul hoy .. tahole ager
// jei file ta upload hoyeche sheta ami delete kore dibo manually ..

// tahole amader file upload er kaj shesh .. ekhon amra validator niye kaj korbo ..

//🔵 remove user
router.delete("/:id", removeUser);

module.exports = router;
