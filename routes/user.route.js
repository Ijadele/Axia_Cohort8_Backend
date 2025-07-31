const express = require("express")
const {getUser, getOneUser, createUser, updateUser, deleteUser, loginUser, statusCode, redirectPath, singleFile, multipleFile, arrayFile} = require("../controllers/user.controller")
const authentication = require("../middlewares/auth.middleware")
const upload = require("../utils/multer") // configure multer for file uploads

const moreFields = upload.fields([
    { name: "previewPix", maxCount: 10 },
    { name: "detailPix", maxCount: 5 },
    { name: "video", maxCount: 3 }
]);
const route = express.Router()

route.get("/all-users", getUser)

route.get("/", authentication, getOneUser)

route.post("/", createUser)

route.put("/", updateUser)

route.delete("/", deleteUser)

route.post("/login", loginUser)

route.get("/status", statusCode)

route.post("/single", upload.single("file"), singleFile)

route.post("/multiple", moreFields, multipleFile)

route.post("/array", upload.array("files", 10), arrayFile)

route.get("/redirect", redirectPath)

module.exports = route;