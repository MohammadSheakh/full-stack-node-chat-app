// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const User = require("../models/people.js");

//🟡 get users page
async function getUsers(req, res, next) {
    // res.render("users"); // shudhu matro render method call kore user er template ta load kore diyechilam
    // tobe ekhon ekhane amader jeta korte hobe .. database theke query kore tarpore shei users ta ekhane
    // amader pathiye dite hobe .. res.local hishebe ba ekhane javascript object akare .. ekhane 2nd parameter e
    try {
        const users = await User.find(); // Simply database theke just users ta ke niye ashlam
        res.render("users", { users: users }); // 2nd parameter e users namok ekta property er moddhe
        // data ta pathiye dilam ..tar mane template e users nam e ekta variable pabo.. local variable
    } catch (err) {
        next(err); // err ta next e pass kore dilam ..
    }
}

//🟡 add user .. Signup korle file upload, validation , error checking shob shesh e User add korbo ekhane
async function addUser(req, res, next) {
    let newUser;
    // shobar age user er password ta ke hash kore niyechi .. karon database e user er original password rakha jabe na
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // tarpor jodi kono file thake .. tahole sheta avatar er moddhe diye dite hobe ..
    if (req.files && req.files.length > 0) {
        // multer file gula ke req.files er moddhe save kore ..
        newUser = new User({
            ...req.body, // body er moddhe onnano ja field ase .. shegula ke spread kore ber kore niye eshesi
            avatar: req.files[0].filename,
            password: hashedPassword,
        });
    } else {
        //ar jodi kono file na thake
        newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
    }

    // save User or send Error
    try {
        const result = await newUser.save();
        res.status(200).json({
            message: "User was added Successfully !",
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                // ekhane jehetu kono form field nai ..eta ekta common error ..  tai common nam e ekta
                // property er moddhe eta dia diyechi ..amar jodi kono form field chara onno kono common
                // error dite hoy amra evabe dibo .. eta ektu mone rakhte hobe ..
                common: {
                    msg: "Unknown error occurred !",
                },
            },
        });
    }

    /**
     *
     * User add korar shob kichu shesh .. front end theke slash user post method e jodi form er moddhe ashe .. tahole amra
     * sheta ke handle korte parbo .. ekhon amra front-end e chole jabo .. amader ejs template e chole jabo ..
     * shekhan theke amra form handling ta dekhbo ..
     * tar age UsersRouter moddhe jeye final Controller mane ei controller tai diye dite hobe .. router er post method e ..
     *  /url e post method e form e request pathai .. tahole ekhan theke amra response pabo .. file upload hobe .. validation hobe
     */
}

// remove user
async function removeUser(req, res, next) {
    //remove user function
    try {
        //mongo database connection use korbo
        const user = await User.findByIdAndDelete({
            _id: req.params.id,
        });

        // ekhan e amar ki lagbe .. jei user ta delete korbo .. sheta abar back paowa
        //lagbe .. ami jodi delete one ba delete many call kortam .. tahole kintu she
        // back dito na .. jei user ta delete korse ..
        //kintu amar user back ejonno lagbe .. karon jei user ami delete korbo ..
        // tar avatar kintu amake file system theke delete korte hobe ..
        // So, tar mane find by id and delete .. delete to korbei .. tar shathe jeta
        // delete koreche tar object ta user er moddhe diye dibe ..
        if (user.avatar) {
            // call unlink .. just file ta unlink kore dite hobe
            unlink(
                path.join(
                    __dirname,
                    `/../public/uploads/avatars/${user.avatar}`
                ),
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        }

        res.status(200).json({
            message: "User was removed successfully!",
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Could not delete the user",
                },
            },
        });
    }
}

module.exports = {
    getUsers,
    addUser,
    removeUser,
};
