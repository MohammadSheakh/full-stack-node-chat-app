// external imports
const createErrors = require("http-errors");
// internal imports
const User = require("../models/people"); // database
const Conversation = require("../models/Conversation"); // database
const Message = require("../models/Message"); // database
const escape = require("../utilities/escape"); //  ekhono jani na eta

// get inbox page
async function getInbox(req, res, next) {
    // res.render("inbox", {
    //     title: "Inbox - Chat Application",
    // });
    // res.render("inbox");
    try {
        // ekhane amra conversation khuje ber kore enechi ..
        // checkLogin kintu req.user set kore dey .. ager din amra dekhechilam.. shei middleware theke eta ashse
        const conversations = await Conversation.find({
            $or: [
                { "creator.id": req.user.userid },
                { "participant.id": req.user.userid },
            ],
            // mane jei conversation she nije initiate koreche .. othoba jei conversation e she participant hishebe
            // ase .. shob gulai ekhane ashbe ..
        });
        res.locals.data = conversations; // tahole jeta hocche res.locals.data er moddhe ami conversations gula peye jacchi
        res.render("inbox"); // inbox page ke render korechi .. mane ei conversations data ta inbox page e access
        // kora jabe .. ekhon amra inbox.ejs e dekhbo ..
    } catch (err) {
        next(err);
    }
}

// search user
async function searchUser(req, res, next) {
    const user = req.body.user;
    const searchQuery = user.replace("+88", ""); // request er shathe ashse .. eta

    // ekhane ami regular expression dia search diyechi .. karon amar ei search ta ekta special search ..
    // ekhane user er nam dia search kora jabe .. mobile number dia search kora jabe ..
    // +88 shoho likhleo ashbe .. abar na likhleo ashbe .. search er khetre full email na likhle ashbe na

    // ekhane ami shobar age escape kore niyechi .. mane malicious kichu thakle sheta escape hoye jabe ..
    // ei escape function ta kintu amar banano ..

    const name_search_regex = new RegExp(escape(searchQuery), "i");
    const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
    const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

    try {
        if (searchQuery !== "") {
            const users = await User.find({
                $or: [
                    { name: name_search_regex },
                    { mobile: mobile_search_regex },
                    { email: email_search_regex },
                ],
                // or use korar mane hocche je kono ekta match korlei result ashbe ..
            });
        }
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}

// get messages of a conversation
async function getMessages(req, res, next) {
    // conversation id jeta thakbe .. tar under er mane against e message gula load korte hobe
    try {
        const messages = await Message.find({
            conversation_id: req.params.conversation_id,
            // Message table e conversation id dia search korechi
        }).sort("-createdAt");
        // and sort korechi .. createdAt dia ulta kore
        // tar mane latest ta shobar age ashbe

        // Conversation er findById kore participant ta ber kore enechi
        // karon eta amar response e pathate hobe
        const { participant } = await Conversation.findById(
            req.params.conversation_id
        );
        // tarpor shob message gula response kore diyechi .. jegula matching messages
        // and shekhan theke participant er information tao diye diyechi .. jeno ei pash e chobi nam .. egula
        // dekhate amar shubidha hoy
        res.status(200).json({
            data: {
                messages: messages,
                participant,
            },
        });

        // otherwise error catch korbe
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occurred",
                },
            },
        });
    }
}

// send message
async function sendMessage(req, res, next) {
    // message othoba file jekono ekta thaktei hobe
    if (req.body.message || (req.files && req.files.length > 0)) {
        try {
            let attachments = null;

            // attachments gula ber kore niyechi .. thakle attachments nam e ekta array te push korechi
            if (req.files && req.files.length > 0) {
                attachments = [];

                req.files.forEach((file) => {
                    attachments.push(file.filename);
                });
            }

            // finally ami newMessage object ta baniyechi .. ja ja amar message save korar jonno amar Model e jei
            // jei field gula ase .. shegula ami input diyechi
            const newMessage = new Message({
                text: req.body.message,
                attachment: attachments,
                sender: {
                    id: req.user.userid,
                    name: req.user.username,
                    avatar: req.user.avatar || null,
                },
                receiver: {
                    id: req.body.receiverId,
                    name: req.body.receiverName,
                    avatar: req.body.avatar || null,
                },
                conversation_id: req.body.conversationId,
            });

            const result = await newMessage.save(); // finally message.save call kore diyechi

            // 🔵 emit socket event // etar kaj pore korbo ..
            // client end e jerokom io.on dia amra listener boshiyechilam .. ekhane taile amader pathate hobe ..
            // mane event emmit kora.. mane throw kora .. event janano
            global.io emit("new_message",{
                    // global.io access korte parbo amar inboxController file e .. 
                    // message send korar shathe shathe ami ekhan theke emit kore dicchi new_message event ta
                    // emit korar shomoy 2nd parameter e ami ei event er shathe kono data dite chai kina .. sheta 
                    // bole dite hobe 
                    // ekhane amar ja ja data proyojon .. shob pathiye diyechi
                    message: {
                        conversation_id : req.body.conversationId,
                        sender:{
                            id: req.user.userid,
                            name: req.user.username,
                            avatar : req.user.avatar || null,
                        },
                        message : req.body.message,
                        attachment : attachments,
                        date_time: result.date_time,
                    },
                    // eta pathanor karon hocche amra tokhon e live dekhate parbo .. jokhon corresponding 
                    // conversation gula open thakbe .. 
            });

            // 🔵shob save korar pore amra ekta response dia dibo
            res.status(200).json({
                message: "Successful ! ",
                data: result, // jei message ta save hoilo .. shetai abar result akare pass kore diyechi
            });
        } catch (err) {
            res.status(500).json({
                errors: {
                    common: {
                        msg: err.message,
                    },
                },
            });
        }
    } else {
        res.status(500).json({
            errors: {
                common: "message text or attachment is required !",
            },
        });
    }
}

module.exports = {
    getInbox,
};
