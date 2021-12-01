/**
 * First kaj hocche login page e .. login page bananor jonno shobar age amader ki lagbe ..
 * User lagbe ... tar mane User add korar functionality age amake banate hobe .. jeno amar database e
 * User thake .. tarpor shei User er upor base kore amra ekhane log in korte parbo ..
 * So shobar age Users page ta amra age kaj korbo .. User related shob functionality age shesh korbo ..
 * tarpor amra login ta dekhbo .
 *
 * So Users page e amader erokom ekta setup ase .. and ekta modal ase .. modal er form shob kichu amader
 * banano ase . form sumit korle form process hoye data save hobe ..
 *
 * ei form ta amra dui vabe process korte pari .. ekta hocche .. submit button press korle ..
 * full page ta reload hoye .. ultimately amar server e kono ekta request hobe and shei khan e shob kaj
 * kore ..validation , database e save kora , file upload .. shob kichu complete kore .. she amader ke
 * abar back ekta html response dibe .. shei html response ta hobe ei page tai.. ekhane ene .. jodi kono
 * error hoy .. sheta same form er moddhei dekhabe ..  jehetu eta ekta modal er moddhe ase .. and ei kaj
 * ta jodi amra oi vabe reload diye korte chai . tahole reload dia anar pore automatically modal ta khulte
 * hobe .. tarpor error dekhaite hobe .. eta khub complex hobe ..
 *
 * eto complex na jeye .. amra jeta korte pari ... amra ei form ta ke javascript er way te .. ajax request
 *  pathiye handle korte pari .. ta te jeta hobe .. amra jokhon submit button e press korbo .. amader ekta
 * form handler function thakbe .. shei function ta actually amader server e request korbe .. ekta API
 * request korbe .. So, amra ekta REST API banabo back-end e .. Shei API Route e hit korar por .. shei
 * API Route theke response ashbe .. and shei response gular upor base kore amra ekhane error show korbo ..
 * othoba .. submit hole modal ta close kore diye ekhane User ke dekhiye dibo .
 *
 * So shobar age ekta REST API banabo amader back-end e.. shekhane amader data save korte hobe .. onno kono form e  jemon Login form e ..
 * arekta way jeta .. sheta hocche submit button e chap dile .. reload diye je ghure asha .. sheta kore
 * dekhabo .. ei khetre amra AJAX way te handle korbo .. shei kaj ta back-end e shesh kore ashbo age ..
 * tarpor amra view te kaj korbo ..
 */
// so first e amra ekta model create korbo .. people nam e .. user nam e korbo na ..
// mongo database er jonno .. collection rakhar jonno .. model ..

// amader model hocche people .. ekhane amader simply ekta Schema banate hoy..

// 🟡⏭ userRouter.js -> notun ekta route banate hobe .. shei route ta process korbe . sheta hobe
// router.post ..and shei URL e amra decorateHtmlResponse dibo na .. karon oita html response hobe na ..
// oita jokhon form theke request hobe .. tokhon shetake ashole server-end e process kore .. REST API hobe
// she response dibe ekta JSON.. so, amar front-end e ami ekta JSON pabo ..

// form e ekta photo upload korar bebostha ase .. User er photo handle korar jonno amake multer use korte hobe
//

const mongoose = require("mongoose");
const peopleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "user"], // duita value er moddhei hote pare ..
            default: "user",
        },
    },
    {
        timestamps: true, // Schema er 2nd parameter e amra ekta object er moddhe .. timestamps true dia
        // diyechi ..jeno jokhon e amar eita save hobe .. tokhon database e jeno created add and updated
        // add nam e duita field automatically create hoy .. sure na ami .. ta te jeta hobe .. eta
        // automatically track rakhbe .. mongo e kore dibe .. tokhon jeta hobe ... amader prottekta record
        // kokhon add hocche shei track ta database e automatically audit akare thakbe ..
    }
);
const People = mongoose.model("people", peopleSchema);
// finally mongoose.model call kore .. people nam e ekta model create korechi ..and shei model ta ekhan theke
// export kore diyechi .. so ei model file ta ke use kore amra amader Users table e kaj korte parbo
module.exports = People;
