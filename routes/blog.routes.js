const express = require("express")
const {getBlog, createBlog, updateBlog, deleteBlog} = require("../controllers/blog.controller")

const route = express.Router()

route.get("/blog", getBlog)

route.post("/blog", createBlog)

route.put("/blog", updateBlog)

route.delete("/blog", deleteBlog)

module.exports = route