const multer  = require("multer");
const upload = multer({ dest: "uploads/" }) // configure multer for file uploads

module.exports = upload