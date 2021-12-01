const uploader = require("../../utilities/singleUploader");
// eikhane amader multer middleware ta thakbe ..

function avatarUpload(req, res, next) {
    // multer er upload object ta banabe..
    // multer er object banano .. sheta kintu onek kaj .. shetao amra ei file e rakhbo na ..
    // amra ekta utility function banabo .. jetar amra ekta nam dibo uploader ba something .. shei
    // function ta ultimately amader kaj gula korbe .. ei jayga ta te shudhu matro .. oi middleware ta
    // ei function ta ke call korbe .. and call kore ultimately response diye dibe mane next middleware e
    // pathabe ba.. error hole she error handling korbe ..
    const upload = uploader(
        // jei upload object ta multer er jonno proyojon .. amar to ekta middleware proyojon right ..
        // so ei middleware ta ami call korbo .. ekhan theke upload.anysomething kichu ekta pabo
        // ei upload object ta bananor jonno ami uploader nam e ekta function alada kore banabo ..
        // erokom ekta function ekhan theke call kore dibo .. ar er parameter hishebe .. ekta file
        // upload korar jonno ja ja lage .. shob kichu parameter akare diye diyechi ..
        // ei function ta bananor jonno utilities nam e ekta folder nicchi
        "avatars", // kon folder e ami upload korbo ..shei sub folder tar nam .. public/uploads/avatars
        ["image/jpeg", "image/jpg", "image/png"], //kon kon file ami allow korbo
        1000000, // max file size .. 1Mb ..byte e hishab
        "Only .jpg, jpeg or .png format allowed!" // jodi kono error hoy .. tahole error message ta hobe eita
    );

    // call the middleware function
    upload.any()(req, res, (err) => {
        // ei jayga tay ami error ta process korte parbo .. shei jonnoi evabe korlam ..
        if (err) {
            // error ta jokhon pabo ..ekhon amar upload e kono error hoy .. tahole sheta ami ekhane dhorte parbo ..
            // sheta amar express error handler er kase jabe na .. ei jayga ta tei ami atke dite parbo ..
            // ami porer middleware e ar nite dibo na .. jodi amar upload fail hoy .. so ekhane jeta korechi ..
            // jodi error thake .. tahole simply error ta ke erokom format e diyechi ..

            // amar JSON format e jehetu ami ekhane API response dibo .. karon amar form expect korse je .. ami ekta
            // REST API response dei .. jar karone ami kintu ekhane res.render call kori nai .. ekhane ekta API response
            // diyechi .. JSON Response diyechi .. and shekhan e ekta errors nam e ekta object diyechi .. shei object er
            // moddhe avatar nam e ekta field er moddhe message akare error ta diyechi ..error er message ta ..
            // ei format ei amra amader application er shob gula error pathabo ..
            // er karon ta jokhon amra validation korbo express validator dia .. tokhon e bujhte parben ..
            // karon amar form e avatar charao onnano field ase .. prottek ta field er indivudual error hote pare..
            // SO, prottek ta error jeno ami oi pash e dekhte pai .. ejonno ami Error gula ke ekta object akare ..
            // protita field er nam dia dia alada alada message akare pathiye dicchi ..

            res.status(500).json({
                errors: {
                    avatar: {
                        msg: err.message,
                    },
                },
            });
        } else {
            next(); // error na thakle next middleware e pathiye dibe .. ei porer middleware ta hobe hocche amader
            // validation .. jeta amader request .. mane form field er jei field gula ase .. shei field gula ke
            // validate korbe .. apatoto upload er kaj done amader .. ekhon 🔵usersRouter e avatarUpload ta niye eshe
            // route baniye post method e avatarUpload diye dite hobe ..
        }
    });
    // upload.any() kintu amar middleware function er call na .. upload.any() return kore ekta middleware function ..
    // jeta amra Route e dite partam ..  amake tahole jodi call korte hoy .. tahole upload.any()(); evabe call kore dite
    // hobe.. eta multer er documentation er last er dik e ase .. error ta ke jodi amra ei middleware e control korte
    // chai .. tahole etai amader korte hobe .. shei khan e amra req, res .. finally she amader ke ei khan e error ta
    // dhorte dey ..
}
module.export = avatarUpload; // usersRouter e use korbo ..
/**
 * ekhon upload.any na kijani ekta sheta use korte hoy .. amra age upload.any use kori nai .. amra upload.single dekhechi
 * amra upload.array dekhchi .. kintu ei khetre amar form e kintu picture charao .. bivinno field o ase .. so, field gula
 * keo kintu amar pete hobe .. ejonno multer er ekta system ase .. sheta hocche upload.any ..
 *
 * ekhon amra jokhon route e upload ke diyechilam ..amra kintu shekhanei multer er upload.single, upload.many ..
 * jai use kori na keno .. sheta kintu ekhanei call kore diyechilam.. tar mane upload.any hocche ekta middleware function
 *
 * .. function er call na kintu .. middleware function ta .. sheta req, res receive kore .. oi rokom ekta function hocche
 *  upload.any() .. upload.any jodi amra Router e direct use kortam .. tahole amake shekhane use korte hoto .. kintu
 *  sheta korle ekta shomossha o ase .. Route er moddhe amra jokhon multer er middleware ta use korbo .. tarpore kintu
 * amar ashole file upload jodi error throw kore .. mane multer er ekta behaviour hocche she singleUploader.js er
 * callback e jodi amra error dei .. tahole she next shob middleware ke avoid kore direct.. express er kache pathiye dibe
 * mane amar default error handler er kache chole jabe ..
 *
 * Kintu amar ei Router er moddhe jodi jei Router ami likhbo shekhane kintu amar je multer er jeta ami call korbo ..
 * tarpore kintu amar validation korte hobe .. aro middleware thakte pare ..so, ami kintu tader kache pathabo ashole ..
 * tarmane .. ami chai na multer sheta errorHandle middleware er kache pathiye dik .. She shudhu jeno amar porer middleware
 * er kache pathay .. and shekhane jeno ami error ta dhorte pari .. shei bebostha amake korte hobe ..
 *
 * So amar ei avatarUpload function ta kintu ashole middleware function .. ei middleware tai kintu ami amar Route e dibo..
 *
 * tahole tar moddhe ami multer er middleware function ta ke call kore dite pari chaile ..
 *
 *
 */
