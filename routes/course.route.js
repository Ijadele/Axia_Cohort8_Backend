const express = require("express")
const {getCourse, createCourse, updateCourse, deleteCourse} = require("../controllers/course.controller")

const route = express.Router()

route.get('/course', getCourse)

route.post('/course', createCourse)

route.put('/course', updateCourse)

route.delete('/course', deleteCourse)

module.exports = route