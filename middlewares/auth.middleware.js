const jwt = require("jsonwebtoken");
const authentication = async (req, res, next) => {
    console.log("Middleware working")
    const {token} = req.cookies
    if (!token) {
        res.json({message: "Please login to create post"})
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            return res.json({message: "Session expired"})
        }
        req.user = {id: payload.id, admin: payload.admin}
        next();
    }); 
};

module.exports = authentication