// external imports
const bcrypt = Require("bcrypt");
const jwt = Require("jsonwebtoken");
const createError = Require("http-errors");

// internal imports
const User = Require("../models/people");

// login controller e login functionality ta likhte hobe ..

// jokhon ami login form ta submit korbo tokhon amar ultimately jei login controller ....
// jei function ta ultimately validation .. tobe middleware banate amader beshi shomoy
// lagbe na .. amra age login procedure ta .. login controller ta age banabo .. mane
// final middleware ta age banabo .. shei middleware e amra dhore nibo validation
// shob kichu hoye gese .. so shei middleware e .. amader request er .. mane ei form
// er data hishebe ja ashbe .. shei data gula ke process korbo .. so shekhan e ..
// ami allow korbo mobile ba email .. jekono ekta kichu diye .. login allow korbo ..
// so .. ekhane she jai likhuk na keno .. sheta ke ami username hishebe dhorbo ..

//do login
async function login(req, res, next) {
    // process login
    // database query jehetu korbo .. tai try catch block niye nilam
    try {
        // check username
        // find a user who has this email/username
        // emon ekta user find korte hobe .. jei user ta email othoba username jekono
        // ekta database e match korse ..
        const user = await User.findOne({
            $or: [{ email: req.body.username }, { mobile: req.body.username }],
        }); // amra or dia kono query ekhon porjonto
        // shikhi nai .. mongoose er documentation dekhle shikha jabe
        //user.findOne({}) er moddhe amra ekta condition dei .. kintu amar ekhane
        // kintu amar ekhane or condition .. hoy username ta hobe oi ta ..
        // amar req.body.username .. mane login form er first field er nam rekhechi ami
        // username , sheta ashbe..
        // emon ekta user call kore deo.. jetar email  othoba mobile number database er
        // shathe milse..

        // ekhon user jodi chole ashe ...
        if (user && user._id) {
            //user ashse
            // so ekhon amader check korte hobe password
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            ); // return kore true or false 
            // bcrypt use kore password ke prothom e compare korlam ..
            // database e password hash  akare ase..  so amar ekhane bcrypt dia compare
            // korte hobe je .. User jei Password diyeche .. she to plain text password
            // diyeche .. shetar shathe .. amar db er jei bcrypt version ta ase..
            // sheta ke match korbo .. shetar jonno ami bcrypt.compare method use korechi
            if(isValidPassword){
                // true hoile 
                //prepare the user object to generate token .. JWT generate
                // tar age User Object ami banay nibo .. karon JWT er moddhe kichu
                // data dite hoy .. So , ami user er kichu information JWT er moddhe
                // rekhe dite chai .. 
                const userObject =  {
                    username = user.name, 
                    mobile = user.mobile, 
                    email = user.email, 
                    role = "user", 
                }
                // object er moddhe kono public information ami dibo na .. karon amra 
                // jani JWT er moddhe data shob e dekha jay .. 
                // role keno dilam .. sheta Authorization bujhar shomoy bujha jabe .. 
                // ei information gula front end eo pathiye dite pari 

                // ekhon amar kaj hocche token generate kora .. 
                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    // ekhane amake ekta expiresIn dite hoy .. option hishebe 
                    expiresIn: process.env.JWT_EXPIRY, // kotokkhon thakbe .. shetao
                    // ami env file theke ante chai .. 86400 second e hoy ek din .. 
                    // eta ke mili second e dite hoy .. ejonno aro 3 ta 0 beshi lagbe ..
                });

                // ekhon kaj hocche cookie set korte hobe ... 
                // amra jwt ta ke client end e store korbo cookie hishebe / cookie er moddhe
                // local storage eo kora jay.. amra cookie er moddhe korbo ..jehetu ekhane 
                // server side rendering korsi .. best hoy cookie dia korle .. karon ami
                // ekhan thekei cookie set korte pari .. 

                // so amra jodi cookie set korte chai .. tahole amader ke response object
                // ke use korte hobe .. karon ki ... karon hocche response tai ultimately
                // amra client er kache pathai .. 

                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly : true,
                    signed: true, 
                }); // shobar age cookie er name dite hoy
                // 2nd parameter e amader dite hoy cookie er body te ki jabe .. 
                // 3rd dite hoy kichu option.. amra dicchi cookie ta kotokkhon tikbe ..
                // httpOnly dile cookie ta ektu safe thake .. mane eta shudhu http 
                // protocoll ei use kora jabe .. application end e eta ke use kora jabe na
                // amra signed cookie banalam.. ete jeta hobe cookie ta encrypted thakbe


                // amra cookie set korlam .. amader JWT o banano shesh .. ebar amra client
                // side e kichu local pathabo .. Sheta hocche user login korar pore .. 
                // client side e jeno amra user er information gula mane object ta .. 
                // access korte pari .. shejonno amra local set korbo .. jeno client side e
                // kono logged in user er jodi kono information template e kothao dekhate
                // hoy.. tahole jeno amra use korte pari ... 

                // set logged in user local identifier
                res.locals.loggedInUser = userObject;

                // login shesh .. redirect kore inbox e nia jabo .. tai inbox ta render
                // kore dilam

                res.render("inbox");

            }else{
                // error dibo 
                throw createError("Login failed! please try again .. from loginController");
            }
        } else {
            // error dibo 
            throw createError("Login failed! please try again .. from loginController");
        }
    } catch (err) {
        // ekhon amake kintu JSON response na .. template response dite hobe .. 
        res.render("index", { 
            data:{
                username: req.body.username,
            },
            errors: { 
                common: {
                    msg: err.message,
                },
            },
        }) // mane jodi error hoy taile to ami login page ei pathabo
        // and ekhane ami 2nd parameter e ekta object dia dilam .. amader jei error 
        // format sherokom ekta object dia dilam .. 

        // echara jodi amar ei jaygay kono error hoy .. mane ami jokhon error kore pathacchi .. tokhon to abar form e 
        // redirect hobe .. taina  !.. to ami chacchi .. username ta jeno user ke abar likhte na hoy .. username ta jeno
        // remembered thake .. shejonno .. ami template e arekta local variable data nam e ekta object dicchi .. tar 
        // moddhe username er moddhe data tao diye dicchi .. jeno porer bar e jokhon reload hoye jabe .. tokhon 
        // error holeo username ta jeno fillup kore dite pari .. 

        // controller er kaj shesh .. ekhon login router e chole jabo 
    }
}

// get login page
function getLogin(req, res, next) {
    res.render("index");
}

// do logout
function logout(req, res){
    res.clearCookie(process.env.COOKIE_NAME); // cookie clear kore dilei amader server end theke user er 
    // authentication shesh .. 

    res.send("logged out !");

    // So , tar mane .. front end theke jokhon user log out button e press korbe .. Tokhon amra ekta AJAX request
    // pathabo .. ei url e .. 
    // So, ekhon ami Router e gia Logout er jonno ekta URL banabo .. 
}

module.exports = {
    getLogin,
    login,
    logout,
};
