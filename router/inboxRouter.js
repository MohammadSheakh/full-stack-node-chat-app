//external imports
const express = require("express");

//internal imports
const {
    getInbox,
    searchUser,
    addConversation,
    getMessage,
    sendMessage,
} = require("../controller/inboxController");
const attachmentUpload = require("../middlewares/inbox/attachmentUpload");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/common/checkLogin"); // inbox page ke protect korar jonno checkLogin Guard
// decorateHtml middleware er porer middleware hishebe boshiye dilam
/**
 * taile jeta hobe inbox page e login obosthay gele .. login er jaygay logout option ta ashbe .. naile
 * logout korar kono option dekhato na ..karon response.locals er moddhe checkLogin deowar pore ekhon
 * user info ta she set kore diyeche .. user ekhon logged in
 *
 *  ekhono ekta shomossha ase .. amra logged in .. ekhon  amader to login page e jaite para uchit na ..
 *  ekhon eitai amra dekhbo .. etar jonno ekhon amra arekta simple middleware banabo .. amader je loginRouter ta
 *  ache .. shetar router.get method e decorateHtml er pore amra getLogin er age ekta simple middleware boshiye dibo
 *  sheta just check korbe .. jodi cookie theke thake already she simply just inbox page e redirect kore dibe ..
 *  valid cookie na thakle porer middleware e jabe .. mane getLogin e jabe .. mane login page e jabe ..
 */

const router = express.Router(); // Router create korlam ..

// Inbox related router thakbe ..

// inbox page
router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

// search user for conversation
router.post("/search", checkLogin, searchUser);

// add conversation
router.post("/conversation", checkLogin, addConversation);

// get message of a conversation
router.get("/message/:conversation_id", checkLogin, getMessage);

// send message
router.post("/message", checkLogin, attachmentUpload, sendMessage);

module.exports = router;
