const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloudinary = require("../utils/cloudinary")
const fs = require("fs/promises")
// const dotenv = require("dotenv")

// dotenv.config();



const createUser = async (req, res, next) => {
    // get the person's registration details and spread others
    const { email, password, ...payload } =  req.body;
    // check if email and password exist
    if(!email || !password){
        return res.send("Please provide valid registration credentials")
    }
    // check if user exist in database
    const isUser = await userModel.findOne({ email })
    if(isUser){
        return res.send("User already exists, please login to your account")
    }

    // now create a hashed password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // continue with registration
    try {
        const newUser = new userModel({email, password:hashedPassword, ...payload})
        const savedUser = await newUser.save()
        return res.json(savedUser)
    } catch (error) {
        error.status = 504;
        next(error.message);
    }
 }

const getUser = async (req, res) => {
    try {
        // two method of getting your populate path
        // const allUsers = await userModel.find().populate("posts", "title desc -_id")
        // const allUsers = await userModel.find().populate({path: "posts", select: "title desc -_id"})
        // const allUsers = await userModel.find().populate({path: "posts", select: {title: 1, desc: 1, _id: 0}});
        // to get only female gender users
        // const allUsers = await userModel.find({gender: "Female", age: {$gt: 30, $lt: 100}}, "name email gender age -_id").limit(3).sort({age: -1});
        // const allUsers = await userModel.find().where("gender").equals("Female").where("age").gt(30).lt(100).limit(3).sort({age: -1});
        const allUsers = await userModel.aggregate([
            {
                $match: {
                    gender: "Female",
                    age: { $gt: 30, $lt: 100 }
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    gender: 1,
                    age: 1
                }
            },
            {
                $sort: { age: -1 }
            },
            {
                $limit: 3
            }
        ]);
        return res.json(allUsers)
    } catch (error) {
        return res.send(error.message)
    }
 }

const getOneUser = async (req, res) => {
    const {id} = req.query
    try {
        const user = await userModel.findById(id).populate("kyc").populate("posts").populate("books");
        return res.json(user)
    } catch (error) {
        return res.send(error.message)
    }
}

const updateUser = async (req, res) => {
    const {id, ...payload} = req.body
    const updatedUser = await userModel.findByIdAndUpdate(id, {...payload}, {new: true})
    return res.json(updatedUser)
 }

const deleteUser = async (req, res) => {
    const {id} = req.query
    const deletedUser = await userModel.findByIdAndDelete(id)
    return res.json(deletedUser)
 }

//  login a user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    // get the user from database
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.send("this account does not exist, create account!!!")
    }

    // compare password
    const isValid = bcrypt.compareSync(password, user.password)
    if (!isValid) {
        return res.send("Invalid password!!!")
    }
    // create a token first
    const token = jwt.sign({ id: user.id, admin: user.admin }, process.env.JWT_SECRET, {expiresIn: "1hr"})
    console.log(token)

    // return basic information
    res.cookie("token", token, { 
        maxAge: 1000 * 60 * 60, 
        secure:true, 
        httpOnly:true 
        })
        return res.json({ message: "Login was successful" })
}

// const statusCode = async (req, res) => {
//    return res.redirect(301, "/redirect")
// }

// const statusCode = async (req, res, next) => {
//    throw new Error("Something happened here")
// }

// const singleFile = async (req, res) => {
//     const file = await cloudinary.uploader.upload(req.file.path, {
//         folder: "uploads",
//         resource_type: "video" // or "image" for images
//     });
//     await fs.unlink(req.file.path) // delete the file from local storage after upload  
//     if (!file) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }
//     return res.status(200).json({ message: "Single file uploaded successfully", file });
//     // await fs.unlink(req.file.path) // delete the file from local storage after upload   
// }

const singleFile = async (req, res, next) => {
    try {
        const response = await cloudinary.uploader.upload(req.file.path, {
            folder: "uploads",
            resource_type: "video" // or "image" for images
        });
        console.log(response);
        await fs.unlink(req.file.path) // delete the file from local storage after upload
        return res.status(200).json({ message: "Single file uploaded successfully", file: response });
    } catch (error) {
        await fs.unlink(req.file.path) // delete the file from local storage even if upload fails
        // return res.status(500).json({ message: "File upload failed", error });
        next(error); // pass the error to the next middleware
    }
}

const multipleFile = async (req, res) => {
    const files = req.files
    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }
    return res.status(200).json({ message: "Multiple files uploaded successfully", files });
}

const arrayFile = async (req, res) => {
    const files = req.files
    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }
    return res.status(200).json({ message: "Array of files uploaded successfully", files });
}

const statusCode = async (req, res, next) => {
   const error = new Error("Something happened here")
   error.status = 504
   next(error)
}

const redirectPath = async (req, res) => {
    return res.status(200).json({message: "redirected path"})
}

 module.exports = {getUser, getOneUser, createUser, updateUser, deleteUser, loginUser, statusCode, redirectPath, singleFile, multipleFile, arrayFile}