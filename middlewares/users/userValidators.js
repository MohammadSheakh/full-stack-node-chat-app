//external imports
const { check, validationResult } = require("express-validator"); // ei check ta hocche ekta middleware
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs"); //  node er fs module theke ber kore niye ashsi ..

//internal imports
const User = require("../../models/people"); // User Model ta import korlam .. jeta People nam e save kora ase

// ⏭ usersRouter.js e ei module ta import kora hoyeche

// 🟡 add user
const addUserValidators = [
    // ei array er moddhe amra amader proyojonio validator gula likhbo
    check("name")
        .isLength({ min: 1 }) // 1 ta nam thaktei hobe .. na hole bolbo name is required
        .withMessage("Name is required")
        .isAlpha("en-US", { ignore: " -" }) // kono character chara ami onno kichu allow korbo na // space and hyphen .. eta ke she ignore korbe
        .withMessage("Name must not contain anything other than alphabet") // is Alpha match na korle error dibe eita
        .trim(), // shuru te shesh e kono gap thakbe na ... eta sanitizer ...
    check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value }); //User Model ta ke import kore niye ashsi
                if (user) {
                    throw createError("Email already is use !"); // eta kintu express error handler er kache jay na ..
                    // .. eta jay hocche porer middleware e..  eta amra porer middleware e dhorte parbo ..
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    // Email er jonno arekta jinish thakte hobe .. sheta hocche email ta jeno unique hoy .. database e aro ekta email thakle.. tahole ami sheta korte dibo na
    // custom() ta likhte hobe .. karon amar database theke query kore dekhte hobe ei email ta ase kina already
    // field er value ta callback function er moddhe pai .. ei body er moddhe ami ekhon check korbo

    check("mobile")
        .isMobilePhone("bn-BD", {
            strictMode: true, // +88 must dite hobe shamne ..
        })
        .withMessage("Mobile number must be a valid Bangladeshi mobile number")
        .custom(async (value) => {
            try {
                const user = await User.findOne({ mobile: value });
                if (user) {
                    throw createError("Mobile Number is already used");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("password")
        .isStrongPassword()
        .withMessage(
            "Password must be at least 8 characters long and should contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol"
        ),
];
// validation korar jonno express validator nam e already ekta package amra install korechi..
// express validator jeta kore .. she amader 🟡 check nam e ekta method dey... // ei check ta hocche ekta middleware

// and amra chaile jevabe .. upload.any ba kono middleware function Route e dite pari .. sherokom o amra ekhane
/**router.post("/", avatarUpload, [check("name"), check("eamil")]);  */ // erokom vabe array akare bivinno check dite
// pari .. comma dia dia .. era purata ekta middleware return kore .. era indivudual e ek ekta middleware ..
// so amra jani ekhane array of middleware o deowa jay express e .. so, array of middleware amra evabe chain korte parbo
// ei name ,email .. egula hocche amar form er field er nam .. so, name , email .. evabe amra validate korte parbo ..

// shudhu tai e noy .. amra chaile
/**
 * [check("name").isLength({min : 1}),
 * check("eamil").isEmail() ]
 */
// express validator use korar shubidha hocche express validator amader ke erokom kichu function diye diyeche ..
// jeta muloto validate js er upor banano ekta package .. etar documentation check kore nite hobe ..

/** 🟡 addUserValidator add korar pore ami jeta korbo .. ei je validation korlam .. ei validation e jodi kono error hoy
 *  shei error ta ke handle korbo
 */
const addUserValidationHandler = function (req, res, next) {
    // validation e jodi kono error hoy shei error ta ke handle korbo ekhane ..
    const errors = validationResult(req); // check nam e jerokom ekta method diyechilo .. validationResult nam e arekta
    // method dey express-validator..
    // validate korar por jei result ta .. shei result ta amader ke she dibe .. mane error gula diye dibe .. jodi kono error thake
    // error gula ektu baje vabe dey .. sheta ke map kore shundor format e neowar jonno mapped()
    const mappedErrors = errors.mapped();
    /**
     * mapped() call korle amra erokom ekta object pabo ..
     * mappedErrors ={
     *  name: {
     *          msg: "name is required",
     *     },
     * email : {
     *      msg : "Invalid email address",
     *      },
     * };
     *
     * eta ashole object akare thake ... Array akare thake na ..
     * name , email .. egula hocche object er ek ekta key ...
     *
     * so ei error ta ase kina .. eta janar jonno
     */
    if (Object.keys(mappedErrors).lenght === 0) {
        // eta amader key er ekta array dey .. er moddhe mappedErrors Object ta pass kore diyechi ..
        // kono error nai ... next() call kore dibo .. mane next middleware e pathiye diyechi
        next();
    } else {
        // error ase ..ekhanei thamiye dite hobe .. jodi age kono file upload hoye thake .. taile shei file ta ke delete
        // kore felte hobe ..  shei kaj tai ekhane korte hobe
        // remove uploaded files ..
        if (req.files.length > 0) {
            // amra jani multer amader file jeta dey .. sheta req.files er moddhe thake
            const { filename } = req.files[0];
            unlink(
                // unlink node er fs module theke ashse .. file delete korte help kore ..
                path.join(__dirnamem, `/../public/uploads/avatars/${filename}`),
                (err) => {
                    if (err) {
                        console.log(
                            "🔴userValidators -> uploaded file related error : ",
                            err
                        );
                    }
                }
            );
        }
        // finally error thake error ta response akare diye dite hobe
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    addUserValidators,
    addUserValidationHandler,
};
