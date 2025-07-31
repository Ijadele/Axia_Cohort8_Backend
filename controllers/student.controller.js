const students = require("../models/student.model")

const getStudent = (req, res) => {
     return res.json(students)
 }

const createStudent = (req, res) => {
     const payload =  req.body;
     const newPayload = {id: students.length + 1, ...payload}
     students.push(newPayload)
     res.send("user created successfully")
 }

const updateStudent = (req, res) => {
     const payload = req.body;
     const userPosition = students.findIndex((student) => student.id == payload.id)
     students.splice(userPosition, 1, payload)
     return res.send("Your account is successfully updated")
 }

const deleteStudent = (req, res) => {
     const payload = req.body;
     const userPosition = students.findIndex((student) => student.id == payload.id)
     students.splice(userPosition, 1)
     return res.send("Your account is deleted successfully")
 }

 module.exports = {getStudent, createStudent, updateStudent, deleteStudent}