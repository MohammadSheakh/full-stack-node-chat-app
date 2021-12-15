const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
    {
        // field initialize kortesi
        creator: {
            id: mongoose.Types.ObjectId,
            name: String,
            avatar: String,
        },
        participants: {
            id: mongoose.Types.ObjectId,
            name: String,
            avatar: String,
        },
        last_updated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);
const Conversation = mongoose.model("Conversation", conversationSchema);
