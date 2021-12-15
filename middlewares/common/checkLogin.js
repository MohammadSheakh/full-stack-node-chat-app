// ei checkLogin Guard ta kintu amra amader JWT video te dekhechilam ..
const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
    // checkLogin guard banacchi .. jeta amar jekono route ke protect korbe .. jei Route ta html response dibe
    // takeo protect korbe .. ar shei Route ta jodi API response dey .. taholeo protect korbe ..
    // amra jani userRouter ba jekono dhoroner URL .. jei route ta ke amake protect korte hobe .. shei Route er
    // age middleware hishebe checkLogin boshiye dibo ..

    // ekhon jei Route ta ke html response dite hobe .. sheta ke ami decorateHtml middleware dia first e likhi ..
    // tai na ? So, ami make sure korbo .. checkLogin ta jeno decorateHtml er pore boshe .. tahole jeta hobe ..
    // decorateHtml html response dite hole res.locals.html .. sheta ke true kore dibe.. so ei jaygay ami check
    // korte parbo .. jante parbo .. tahole amar response ta ki dite hobe .. so shetar upor base kore .. rest API
    // er khetre ami ta ke just ek dhoroner response dibo .. ar html response dite hole .. ta ke ami arek dhoroner
    // response dibo .. sheta amra dekhlei ekhon bujhbo ..
    let cookies =
        Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    // shobar age cookies ta ber kore niyechi .. karon amra jani jokhon request ashe .. tokhon browser er
    // jei cookie ta .. sheta ami server end e check korte pari .. so shei cookie ta ashole thake ashole
    // req.signedCookies er moddhe eta ekta object akare thake .. and object er moddhe protita property hoy
    // ek ekta cookie er nam .. so, multiple cookie o thakte pare .. so , jar karone amra jeta korechi ..
    // jehetu eta ekta object .. req.signedCookies ke Object.keys() dia eta ke array baniye niye .. tar length
    // check korsi .. je .. er moddhe ashole cookie ase kina .. jodi thake .. tahole eta ke ami cookies variable
    // er moddhe rekhechi ..

    if (cookies) {
        // shei cookies ta ultimately jodi thake .. tahole ami shekhan theke token ta .. mane amader JWT token ta
        // ber kore niye eshechi
        try {
            token = cookies[process.env.COOKIE_NAME];
            // tarpor ami sheta decoded korechi .. jwt.verify use kore .. and shekhane ami amar secret ta pass kore
            // diyechi .. tahole she amake verify kore .. jodi thik hoy .. taile decoded er moddhe JWT er jei data ta
            // mane user er information ta .. sheta ami ekhane peye jabo ..
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // so ami sheta ke req.user er moddhe save kore rekhechi ..
            req.user = decoded;
            // eta keno korechi ! jodi amar API response dite hoy .. shekhetre jeno porer middleware req.user er moddhe
            // information ta pay .. shejonno ami eta save kore rekhechi ..
            // ar jodi amake HTML response dite hoy .. tahole .. res.locals.html true hobe .. jeta amake decorateHTML
            // kore dibe .. so, shei ami ebar check korechi

            // pass the user info to response locals
            if (res.locals.html) {
                // ei ta dia check korle ami bujhbo amake ki response dite hobe .. jodi amake html response dite hoy
                // tahole
                res.locals.loggedInUser = decoded; // user er information pass kore dilam ..
            }
            // html response na hole next middleware e pass kore diyechi ..
            next();
        } catch (err) {
            // catch block er moddhe ami check korechi ..jodi amake html response dite hoy .. jodi error hoy
            // taile simply ami login page e redirect kore dibo  ar jodi amake JSON response dite hoy ..
            // taholeo ami else er moddhe ekta JSON response dia disi ..jeta amra JWT er tutorial eo diachilam
            // karon JWT er tutorial e amra shudhu matro REST API response diachilam .. kintu ekhane amra ekta middlware
            // er moddhe dui dhoroner response e manage korsi
            if (res.locals.html) {
                res.redirect("/");
            } else {
                res.status(500).json({
                    errors: {
                        common: {
                            msg: "Authentication Failure !",
                        },
                    },
                });
            }
        }
    } else {
        // cookie jodi na paowa jay
        if (res.locals.html) {
            res.redirect("/");
        } else {
            res.status(401).json({
                error: "Authentication Failure !",
            });
        }
    }
};

const redirectLoggedIn = function (req, res, next) {
    let cookies =
        Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null; // upore bekkha deowa ase
    if (!cookies) {
        // tar mane logged out .. mane mane next middleware mane login page e niye jabo
        next();
    } else {
        // logged out na .. tar mane login page e jaowa jabe na ..
        res.redirect("/inbox");
    }
};

//🔵 require Role // guard to protect routes that need role based authorization
function requireRole(role) {
    // parameter hishebe receive korbe ekta array // ekhan theke ekta middleware function return kore diyechi ..
    if (req.user.role && role.includes(req.user.role)) {
        // req.user.role set korechi ager middleware e .. mane checkLogin e .. shei ta jodi thake ..
        // checkLogin middleware e gele amra dekhbo .. cookie theke user information data ta ber kore ..
        // req.user tar moddhe assign kore diyechilo .. req.user = decoded ;
        // ar decoded jeta .. shetar moddhe ami set korechilam .. amra jodi login controller e jai ...
        // shekhane login korar shomoy amra kintu jokhon ..  JWT token ta set korechilam data hishebe .. amra kintu
        // user object er moddhe  role dia diyechilam ..
        // tai req.user.role er moddhe logged in user er role ta amra pabo.. so ami dekhsi shei role ta set ase kina
        // and shei role ta amar ei je parameter e role array ta esheche shetar moddhe ase kina ..
        next(); //  next middleware e pass kore dilam ..
    } else {
        if (res.locals.html) {
            next(
                createError(401, "You are not authorized to access this page!")
            );
        } else {
            res.status(401).json({
                errors: {
                    common: {
                        msg: "You are not authorized to view this page !",
                    },
                },
            });
        }
    }
}

// module.exports = checkLogin;
module.exports = {
    checkLogin,
    redirectLoggedIn,
};

// ekhon amra userRouter  er moddhe checkLogin ta ke import kore niyechi ..
// oi file e .. // jei Route ke ami protect korbo mane amar User page
// shei User page e .. decorateHtmlResponse() first e call korechi middleware ..
// tarpore ami checkLogin ta ke call korbo
// amader login Guard ta kaj korse .. and eta kono ekta API URL keo protect korte parbe
// jemon amar add User korar jei beparta .. ekhane kintu decorateHtmlResponse() nai .. tahole amra ki korte pari
// eta keo kintu login guard deowar dorkar hote pare .. ekhaneo ami shob kichu korar age .. checkLogin guard
// middleware hishebe diye dite pari ..

// checkLogin ekhetreo shundor moto kaj korse .. kono error dekhay nai .. ei khetre checkLogin kintu AJAX request
// handle korlo.. tar mane checkLogin amar jekono AJAX, mane kono JSON response dite hobe erokom kono Route eo amar
// protect korbe .. abar jokhon amake HTML response dite hobe .. tokhon amake protect korbe ..
