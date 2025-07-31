const express = require("express")
const {getStudent, createStudent, updateStudent, deleteStudent} = require("../controllers/student.controller")

const route = express.Router()

route.get("/", getStudent)

route.post("/", createStudent)

route.put("/", updateStudent)

route.delete("/", deleteStudent)

module.exports = route