const createError = require("http-errors"); // createError nam e ekta function ase
//🔵 404 not found handler
function notFoundHandler(req, res, next) {
    /**
     *  default error handling middleware .. sheta just etar porei likhbo .. next call korar
     * maddhome shekhane just pathiye dibo .. ekta error dia next call kore dibo ..
     * next er moddhe kichu ekta dia dile shetai error hishebe consider hoy ..
     * ei error tar jonno amra first time http-errors nam e ekta package install korechilam
     * she amader shundor error bananor way diye dey ..
     */
    next(createError(404, "your requested content was not found")); // error status , error message
}

//🔵 default error handler
function errorHandler(err, req, res, next) {
    // main error handler // parameter 4 ta .. first e error thakbe .. special middleware
    // ei je error ta amra pai .. eta hocche ekta error object .. etar moddhe message , status , stack egula thake .. dot operator dia access korte hoy
    // JSON akare response dilam..
    // res.json({
    //     // tar moddhe ekta object diye dei ..
    // });
    // html akare response dite chaile amra ..
    //🟡 res.locals.title = "Error Page"; // same kaj korbe
    //🟡 res.render("error", {
    //     // view te kono data pathaite chaile .. 2nd parameter er moddhe object akare data
    //     // pathaite pari ..
    //     title: "Error Page",
    // }); // 1st parameter -> view file er nam
    /**
     * development e full error ta dekhabe .. ar production e shudhu matro error er message tuku dekhabe
     * stack trace ta dekhabe na ..
     */
    res.locals.error =
        process.env.NODE_ENV === "development" ? err : { message: err.message };
    res.status(err.status || 500); // thakle valo naile default 500

    /**
     * amar jei response gula .. html akareo jete pare .. abar response gula JSON akareo jete pare ..
     * both khetre kintu error o different houwar kotha .. jodi keo API request kore .. dhoren Application
     * ta keo browser e browse korsen .. she dhoren ei URL ta ke hit koreche API dia.. tar mane ki ?
     * she expect korse apni ta ke JSON response diben  .. Tar mane take amar JSON response dite hobe
     * mane kichu Route ke amar JSON response dite hobe.. ar kichu Route ke amar HTML page dite hobe ..
     *
     * shei bebostha ta amra ekhane kore felte chacchi ..
     *
     * amra jeta korbo .. ultimately somehow amader application theke jokhon Route likhbo.. tokhon
     * somehow ami res.locals er moddhe dot html nam e ekta property rekhe dibo .. jeta true or false hobe
     *
     */
    if (res.locals.html) {
        // Route jokhon banabo tokhon ei jinish ta middleware er maddhome make sure korbo amar response
        // local er moddhe obosshoi html nam e ekta jinish thake .. je HTML Response chacche .. ta ke ami
        // set korbo .. je chacche na  .. ta ke ami korbo na ..
        /** tahole error handler er moddhe ami check korte pari .. ase kina html ta .. jodi thake
         * tahole ami ta ke html response dibo
         */
        res.render("error", {
            title: "Error Page",
        });
    } else {
        // mane she ashole JSON Response ba API response chacche ..
        // JSON response
        res.json(res.locals.error);
    }
}
module.exports = {
    notFoundHandler,
    errorHandler,
    // chaile colon dia .. kon nam e jabe sheta set kore deowa jete pare .. may be
    // nf: notFoundHandler may be
};

/**
 * 🔴🔵 amra amader jei application ta banacchi eta amra ekta complete full stack application banacchi .. shekhane
 *  amader template thakbe kintu html template .. sheta kintu server side rendering hoye html akare jabe .. browser er
 *  kase .. tarmane amra jei backend server ta amra banacchi .. shei server er shathe view gula kintu lege ase ..
 * eta react ba single page application er moto na je .. view alada thakbe .. server alada thakbe .. sheta kintu na ..
 *  ekhane amar server ar view kintu ek shathe ase .. tar mane ki ? amake server dia e html baniye response dite hobe ..
 *  ei hocche kotha .. kintu normally ..ki hoy .. front end alada vabe kaj kore .. React ba single page applicaiton e ..
 *  ar Server e amra just REST API dia request kori .. so ekhetre amader shob shomoy JSON request ashe .. and amra sheta
 *  accept kori .. kintu ei ketre amra jehetu HTML akare response dite parbo .. tar mane amake HTML akare response deowa
 *  o jante hobe abar .. ek e shathe JSON akare .. jodi amra ei server theke kono API expose korte chai .. API banate
 * chai ... tahole amake JSON Response o dite hobe .. So , dui dhoroner response e amake handle korte hobe .. ei project
 *  e amra shetai kore dekhabo,,,,dhore nite hobe ... amra actually amader application e dui dhoroner  response e jeno
 *  pathate pari .. shei way amader ke rakhte hobe ..
 *
 */
