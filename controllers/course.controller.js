const courses = require('../models/course.model')

const getCourse = (req, res) => {
    return res.json(courses)
}

const createCourse = (req, res) => {
    return res.send('course created')
}

const updateCourse = (req, res) => {
    return res.send('course updated')
}

const deleteCourse = (req, res) => {
    return res.send('course deleted')
}

module.exports = {getCourse, createCourse, updateCourse, deleteCourse}