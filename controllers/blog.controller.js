const blogModel = require("../models/blog.model")

const createBlog = async (req, res) => {
    const {email, password, ...others} = req.body
    if(!email || !password){
        return res.send("Please provide valid reg")
    }
    const isUser = await blogModel.findOne({email})
    if(isUser){
        return res.send("User already exists")
    }
    try {
        const newUser = new blogModel({email, password, ...others})
        const savedUser = await newUser.save()
        return res.json(savedUser)
    } catch (error) {
        console.log(error.message)
    }
}

const getBlog = async (req, res) => {
    const allBloggers = await blogModel.find()
    return res.json(allBloggers) 
}

const updateBlog = async (req, res) => {
    const {id, ...others} = req.body
    const updatedBlog = await blogModel.findByIdAndUpdate(id, {...others}, {new:true})
    return res.json(updatedBlog)
}

const deleteBlog = async (req, res) => {
    const {id} = req.query
    const deletedBlog = await blogModel.findByIdAndDelete(id)
    return res.json(deletedBlog)
}

module.exports = {getBlog, createBlog, updateBlog, deleteBlog}