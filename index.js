const express = require('express');
const studentRoutes = require('./routes/student.route')
const courseRoutes = require('./routes/course.route')
const userRoutes = require("./routes/user.route")
const blogRoutes = require("./routes/blog.routes")
const postRoutes = require("./routes/post.route")
const kycRoutes = require("./routes/kyc.route")
const bookRoutes = require("./routes/book.routes")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const app = express();

dotenv.config()
// create connection
mongoose
    .connect(process.env.MONGO_API_URL)
    .then(() => console.log("connection was successful"))
    .catch((error) => console.log(error, "Oops! Something went wrong!!!"))
app.use(express.json())
// app.use(express.text({type: ["text/plain", "application/xml", "text/html", "application/javascript"]}))
// app.use(express.urlencoded())
app.use(cookieParser())
// app.use(studentRoutes)

// app.use(courseRoutes)

app.use(userRoutes)
app.use(blogRoutes)
app.use(postRoutes)
app.use(kycRoutes)
app.use(bookRoutes)

app.use((error, req, res, next) => {
    return res.status(error.status || 501).json({message: error.message || "something went wrong"})
})

const port = 5000;
app.listen(port, console.log(`app is listening to port ${port}`))

