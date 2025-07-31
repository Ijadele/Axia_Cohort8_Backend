const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    previewPix: {
        type: [String],
        required: true,
    },
    detailedPix: {
        type: [String],
        required: true,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    
}, {timeStamps: true})

const postModel = mongoose.model("Post", postSchema)
module.exports = postModel;