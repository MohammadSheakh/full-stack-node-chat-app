// ei file thekei amar node js project ta shuru hobe ..
// npm i express dotenv ejs mongoose multer cookie-parser express-validator jsonwebtoken bcrypt http-errors
/**
 * dotenv        -> eta dia amra .env file gula read korte pari ..
 * ejs           -> ejs template engine use korbo
 * mongoose      -> database adapter hishebe mongo db er jonno mongoose use korbo
 * multer        -> eta use korbo file upload er jonno
 * cookie-parser -> login authentication ta korbo amra cookie dia .. browser er cookie gula jeno amra perse
 *                  korte pari .. shejonno
 * express-validation -> request validation er jonno ..
 * jsonwebtoken   -> eta use korbo for JWT
 * bcrypt        -> password hash korar jonno lagbe
 * http-errors   -> error banaite kichuta help korbe ..
 */

// application start korar jonno ekhane server create korbo ..
// external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

// internal imports
const {
    notFoundHandler,
    errorHandler,
} = require("./middlewares/common/errorHandler");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

const app = express();
dotenv.config();

// ekhon amader database connection and middle-wire egula amader setup korte hoy ..

// database connection
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, {
        useNewUrlParser: true, // egula dite hobe .. nahole error dey
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("database mongo connection is successful form app.js");
    })
    .catch((err) => {
        // kono error hoile dhorte parbo .. catch korbo ..
        console.log("database err from app.js📉", err);
    }); // 1st param -> database connection string ta dite hoy
// ekhane database er nam hocche chat <- .env file er moddhe ase
// 2nd param e amra kichu options dite pari ..

// database connection is done

// request parser -> amader application e jokhon kono request ashbe tokhon shegulake parse korte
// hoy .. sheta json akare ashte pare .. form data hishebe ashte pare..
app.use(express.json);
app.use(express.urlencoded({ extended: true })); // html template er moddhe form baniye .. shei form o handle korbo
// extended : true // taile she amar query parameter gula o parse korte parbe ..

//🔵 set view engine // ejs template set up korbo ekhon
app.set("view engine", "ejs"); // view engine set up hoye jabe .. by default views folder er moddhe template gula khujbe

//🔵 static folder / public folder set korbo ekhon amra
// application er ei public folder ta open thakbe .. mane .. direct jokhon keo browse korbe amar application e..
// url jodi hoy www.something.com / dia tarpor ei public er moddhe ja thakbe .. she access korte parbe ..
// public er moddhe amra mainly template ta rakhbo .. sheta setup kori ..
app.use(express.static(path.join(__dirname, "public"))); // ekhane amader public folder er path ta dia dite hoy ..
// path.join dia path ta create kore public folder ta dekhiye dilam..

// 🔵 parse cookies // ekhon amake arekta middle wire use korte hobe ..jeta cookie parse korbe ..
app.use(cookieParser(process.env.COOKIE_SECRET)); // ekta secret dite hoy .. amra signed cookie banabo .. signed cookie na baile deowa lage na ..
/**
 * COOKIE_SECRET= wordpress salt generator -> theke SECURE_AUTH_KEY niye .. sheta abar http://www.sha1-online.com/ er
 *  maddhome hash kore nei .. eta ektu secure ... jekono kichui deowa jabe ..
 */

// 🔵 routing setup
app.use("/", loginRouter);
// app.use("/users", usersRouter);
// app.use("/inbox", inboxRouter);

// 🔵 404 not found handler
// common middleware ta jekono route ei use hote pare ..
// page specific middleware thakle .. shegula page er folder e folder e likhbo ..
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(
        `app listening to port ${process.env.PORT} click http://localhost:${process.env.PORT}`
    );
});
