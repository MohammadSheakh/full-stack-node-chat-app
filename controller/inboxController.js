// get inbox page
function getInbox(req, res, next) {
    // res.render("inbox", {
    //     title: "Inbox - Chat Application",
    // });
    res.render("inbox");
}

module.exports = {
    getInbox,
};
