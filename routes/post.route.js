const express = require("express")
const {createPost, deletePost, updatePost, getUsersPosts, getSinglePost} = require("../controllers/post.controller")
const authentication = require("../middlewares/auth.middleware")
const upload = require("../utils/multer") // configure multer for file uploads


const route = express.Router()

const postUploads = upload.fields([
    { name: "previewPix", maxCount: 10 },
    { name: "detailedPix", maxCount: 5 },
    // { name: "video", maxCount: 3 }
]);

route.post("/post", authentication, postUploads, createPost)

route.delete("/post", authentication, deletePost)

route.put("/post", authentication, updatePost)

route.get("/get-all-post", getUsersPosts)

route.get("/single-post", getSinglePost)

module.exports = route