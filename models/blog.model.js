const mongoose = require("mongoose")
const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        enum: ["Male", "Female"],
        required: true,
    },
    author:{
        type: String,
        required: true,
    }
}, {timestamps: true})

const blogModel = mongoose.model("blog", blogSchema)
module.exports = blogModel