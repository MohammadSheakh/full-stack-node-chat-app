// ekhane amake login form validation korte hobe

// external imports
const { check, validationResult } = Require("express-validator");

// internal imports

// // karon validator gula array akare pathate hoy
const doLoginValidators = [
    check("username")
        .isLength({ min: 1 }) // minimum length hobe ekta .. mane ekta word thaktei hobe ..
        .withMessage("Mobile number or email is required !"),
    check("password")
        .isLength({ min: 1 })
        .withMessage("Password is required !"),
];
// ebar amar kaj hocche validation handler .. mane er porer middleware jeta .. mane validation houar pore ..
// jodi kono error hoy tahole .. shegula ke dhorar jonno arekta middleware amader banaite hoy ..
const doLoginValidationHandler = function (req, res, next) {
    // amra jani validationResult er maddhome amra error pai ..
    // tarpor error gula ke map kora lage amader // tahole amra ekta JSON shundor object pete pari ..
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    // ekhon error na thakle next middleware e pathiye dibo .. ar jodi error thake .. shegula show korbo
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // index page tai render korechi ..
        res.render("index", {
            data: {
                username: req.body.username,
            },
            errors: mappedErrors,
        });
        // and .. tar moddhe data ta abar pathiye diyechi .. karon amar username .. eta to dite hobe .. and errors er moddhe ami
        // mappedErrors ta diye diyechi .. tahole oi pash e mappedErrors er maddhome amra amader jei JSON format ta .. shei format e
        //pabo .. tahole errors ta amar template er local variable hishebe set hoye jabe .. data tao amar template er local variable
        // hishebe set hoye jabe .

        // jokhon amra AJAX request pathiyechilam .. tokhon amra JSON response pathiyechilam.. kintu ekhon amra ei full Object ta
        // template local hishebe.. template er moddhe pabo ..

        // so finally ekhon amar kaj hocche ei loginValidator ta .. Router e boshiye deowa ..
    }
};

module.exports = {
    doLoginValidators,
    doLoginValidationHandler,
};
