const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    age: {
        type: Number,
    },
    admin:{
        type: Boolean,
        default: false,
    },
    hobbies:{
        type: [String]
    },
    kyc:{
        type: mongoose.Types.ObjectId,
        ref: "Kyc",
    },
    posts: [{type: mongoose.Types.ObjectId, ref: "Post"}],
    books: [{type: mongoose.Types.ObjectId, ref: "Book"}],
}, 
{timestamps: true}
);

const userModel = mongoose.model("user", userSchema)

module.exports = userModel