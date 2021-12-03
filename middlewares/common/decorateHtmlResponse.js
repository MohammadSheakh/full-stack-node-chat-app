function decorateHtmlResponse(pageTitle) {
    return function (req, res, next) {
        res.locals.html = true;
        res.locals.title = `pageTitle ${pageTitle}- ${process.env.APP_NAME}`;
        res.locals.loggedInUser = {};
        res.locals.errors = {};
        res.locals.data = {};
        next();
    };
}
/**
 * jehetu eta shobar prothom middleware .. porer middleware gula te errors / data / aro kichu add  hoite pare
 * res.locals e .. tai age thekei blank object initialize kore rakhlam ..
 * blank kore rakhar mane hocche placeholder
 */

module.exports = decorateHtmlResponse;
