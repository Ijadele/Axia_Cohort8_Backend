const mongoose = require("mongoose");
const bookSchema = mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String, required: true},
    authors:[{type: mongoose.Types.ObjectId, ref: "user"}]
}, {timestamps: true})

const bookModel = mongoose.model("Book", bookSchema)
module.exports = bookModel;